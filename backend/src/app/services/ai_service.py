from typing import Dict, Any, List, Optional
from openai import OpenAI
from app.core.config import settings
import json

client = OpenAI(
    base_url=settings.NVIDIA_BASE_URL,
    api_key=settings.NVIDIA_API_KEY,
    timeout=180,  # NVIDIA's free endpoint is slow + cold-start adds time
    max_retries=1,
)

def evaluate_application(
    resume_text: str,
    job_description: str,
    required_skills: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Score a resume against a job description using the LLM.

    Pure function: callers are responsible for extracting the resume text
    (typically from the S3-stored PDF) and passing the job description in.

    When `required_skills` is provided, the final score is anchored to the
    overlap between those skills and what the model finds in the resume —
    so the same resume against the same job produces a stable score even
    if the model's wording drifts slightly between runs.
    """
    if not resume_text or not job_description:
        return {
            "score": 0,
            "strengths": [],
            "missing_skills": [],
            "feedback": "Insufficient information to evaluate application."
        }

    required_skills = required_skills or []

    if required_skills:
        # Structured per-skill verdict — eliminates spelling drift and forces
        # the model to evaluate exactly the skills we care about.
        skills_block = (
            "REQUIRED SKILLS for this role:\n"
            + "\n".join(f"- {s}" for s in required_skills)
            + "\n\nFor EACH required skill above, decide whether the resume "
              "demonstrates it. Return a `skill_evaluations` array with one "
              "entry per required skill (in the same order, with the EXACT "
              "spelling), each marked present=true or present=false."
        )
        format_example = (
            '{\n'
            '    "skill_evaluations": [\n'
            '        {"skill": "React", "present": true},\n'
            '        {"skill": "Kubernetes", "present": false}\n'
            '    ],\n'
            '    "feedback": "Your background shows strong frontend fundamentals. '
            'To match this role we were also looking for more depth in '
            'distributed systems and leading engineering teams."\n'
            '}'
        )
    else:
        skills_block = (
            "Identify the key skills required by the job description, then "
            "decide which the resume demonstrates (`strengths`) vs lacks "
            "(`missing_skills`)."
        )
        format_example = (
            '{\n'
            '    "strengths": ["React", "TypeScript"],\n'
            '    "missing_skills": ["Kubernetes", "team leadership"],\n'
            '    "feedback": "Your background shows strong frontend fundamentals. '
            'To match this role we were also looking for more depth in '
            'distributed systems and leading engineering teams."\n'
            '}'
        )

    prompt = f"""
    You are an AI recruiter screening a candidate's resume against a job description.
    The "feedback" field is shown DIRECTLY to the candidate in their result email,
    so it must be written TO them, not ABOUT them.

    {skills_block}

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    IMPORTANT:
    - Return ONLY valid JSON. No markdown, no commentary.
    - "feedback": 1-2 sentences written TO the candidate in second person ("you/your"). Warm and constructive.
       Do NOT use their name. Do NOT use "the candidate". Do NOT enumerate skills.
       Do NOT tell them to apply for different/lower roles.

    Format:
    {format_example}
    """

    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful hiring assistant"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        top_p=0.9,
        max_tokens=16384,
        stream=False,
        extra_body={"chat_template_kwargs": {"thinking": False}},
    )
    
    content = response.choices[0].message.content.strip()
    
    if content.startswith("```"):
        content = content.split("```")[1]
    content = content.replace("json", "").strip()
    
    try:
        data = json.loads(content)
    except Exception:
        data = {
            "skill_evaluations": [],
            "strengths": [],
            "missing_skills": [],
            "feedback": "Could not evaluate application due to unexpected response format.",
        }

    feedback = data.get("feedback", "")

    if required_skills:
        # Build a lookup from the model's verdicts. Any required skill the
        # model failed to return is treated as missing (defensive default).
        evaluations = data.get("skill_evaluations") or []
        verdicts: Dict[str, bool] = {}
        if isinstance(evaluations, list):
            for entry in evaluations:
                if not isinstance(entry, dict):
                    continue
                skill = entry.get("skill")
                if not isinstance(skill, str):
                    continue
                verdicts[skill.strip().lower()] = bool(entry.get("present"))

        strengths: List[str] = []
        missing: List[str] = []
        for skill in required_skills:
            if verdicts.get(skill.strip().lower(), False):
                strengths.append(skill)
            else:
                missing.append(skill)

        score = int(round((len(strengths) / len(required_skills)) * 100))

        return {
            "score": score,
            "strengths": strengths[:3],
            "missing_skills": missing[:3],
            "feedback": feedback,
        }

    # No required-skill list on the job — fall back to the older heuristic.
    all_strengths = data.get("strengths", [])
    all_missing = data.get("missing_skills", [])

    if not isinstance(all_strengths, list):
        all_strengths = []
    if not isinstance(all_missing, list):
        all_missing = []

    all_strengths = [str(s).strip() for s in all_strengths if str(s).strip()][:10]
    all_missing = [str(s).strip() for s in all_missing if str(s).strip()][:10]

    total = len(all_strengths) + len(all_missing)
    if total == 0:
        score = 0
    else:
        base = (len(all_strengths) / total) * 100
        penalty = len(all_missing) * 5
        score = int(max(0, min(100, base - penalty)))

    return {
        "score": score,
        "strengths": all_strengths[:3],
        "missing_skills": all_missing[:3],
        "feedback": feedback,
    }


JOB_LEVELS = {"FRESHER", "JUNIOR", "MID", "SENIOR"}
EMPLOYMENT_TYPES = {"FULL_TIME", "PART_TIME", "INTERN", "CONTRACT"}


def _empty_job_parse() -> Dict[str, Any]:
    return {
        "title": None,
        "company": None,
        "description": None,
        "required_skills": [],
        "level": None,
        "employment_type": None,
    }


def extract_job_from_description_text(text: str) -> Dict[str, Any]:
    """Parse a free-form job description into structured fields the post-job
    form can prefill. Best-effort — caller is expected to let the user review."""
    if not text.strip():
        return _empty_job_parse()

    # Cap input — a typical JD is ~2-5k chars. Anything past 8k is almost
    # certainly company boilerplate, legal text, or duplicated content and
    # not useful for extraction. Truncating cuts AI time dramatically.
    if len(text) > 8000:
        text = text[:8000]

    prompt = f"""
    Extract structured job posting details from this job description.

    Job Description:
    {text}

    IMPORTANT:
    - Return ONLY valid JSON. No markdown, no commentary.
    - Use null for any field that can't be determined.
    - "level" MUST be one of: FRESHER, JUNIOR, MID, SENIOR (or null).
    - "employment_type" MUST be one of: FULL_TIME, PART_TIME, INTERN, CONTRACT (or null).
    - "required_skills" is an array of short technical skill names (max 15).
    - "description" is the cleaned-up full job description, suitable for posting.

    Format:
    {{
      "title": "Senior Frontend Engineer",
      "company": "Acme Inc.",
      "description": "We are looking for...",
      "required_skills": ["React", "TypeScript", "GraphQL"],
      "level": "SENIOR",
      "employment_type": "FULL_TIME"
    }}
    """

    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You extract structured job posting data from job descriptions.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        top_p=0.9,
        max_tokens=16384,
        stream=False,
        extra_body={"chat_template_kwargs": {"thinking": False}},
    )

    content = response.choices[0].message.content.strip()

    if content.startswith("```"):
        content = content.split("```")[1]
    content = content.replace("json", "").strip()

    try:
        data = json.loads(content)
    except Exception:
        return _empty_job_parse()

    skills = data.get("required_skills", [])
    if not isinstance(skills, list):
        skills = []
    skills = [str(s).strip() for s in skills if str(s).strip()][:15]

    level = data.get("level")
    if level not in JOB_LEVELS:
        level = None

    employment_type = data.get("employment_type")
    if employment_type not in EMPLOYMENT_TYPES:
        employment_type = None

    return {
        "title": data.get("title") or None,
        "company": data.get("company") or None,
        "description": data.get("description") or None,
        "required_skills": skills,
        "level": level,
        "employment_type": employment_type,
    }


def extract_profile_from_resume_text(resume_text: str) -> Dict[str, Any]:
    if not resume_text.strip():
        return {
            "headline": None,
            "bio": None,
            "phone": None,
            "location": None,
            "linkedin_url": None,
            "github_url": None,
            "portfolio_url": None,
            "years_of_experience": None,
            "skills": [],
            "experiences": [],
        }

    prompt = f"""
    Extract applicant profile details from this resume.

    Resume:
    {resume_text}

    IMPORTANT:
    - Return ONLY valid JSON
    - Do NOT include markdown
    - Use null when a value is unknown
    - Dates must be ISO format YYYY-MM-DD or null
    - Keep skills to the 15 most relevant skills

    Format:
    {{
      "headline": "short professional headline or null",
      "bio": "2-3 sentence professional summary or null",
      "phone": "phone number or null",
      "location": "location or null",
      "linkedin_url": "LinkedIn URL or null",
      "github_url": "GitHub URL or null",
      "portfolio_url": "Portfolio URL or null",
      "years_of_experience": 3,
      "skills": ["React", "Python"],
      "experiences": [
        {{
          "company": "Company name",
          "role": "Role title",
          "start_date": "2021-01-01",
          "end_date": null,
          "description": "Short role summary"
        }}
      ]
    }}
    """

    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You extract structured candidate profile data from resumes.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        top_p=0.9,
        max_tokens=16384,
        stream=False,
        extra_body={"chat_template_kwargs": {"thinking": False}},
    )

    content = response.choices[0].message.content.strip()

    if content.startswith("```"):
        content = content.split("```")[1]

    content = content.replace("json", "").strip()

    try:
        data = json.loads(content)
    except Exception:
        return {
            "headline": None,
            "bio": None,
            "phone": None,
            "location": None,
            "linkedin_url": None,
            "github_url": None,
            "portfolio_url": None,
            "years_of_experience": None,
            "skills": [],
            "experiences": [],
        }

    skills = data.get("skills", [])
    experiences = data.get("experiences", [])

    if not isinstance(skills, list):
        skills = []

    if not isinstance(experiences, list):
        experiences = []

    data["skills"] = [
        str(skill).strip()
        for skill in skills
        if str(skill).strip()
    ][:15]

    data["experiences"] = [
        item
        for item in experiences
        if isinstance(item, dict)
    ][:10]

    return data
