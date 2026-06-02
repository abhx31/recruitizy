from typing import Dict, Any
from openai import OpenAI
from app.core.config import settings
import json

client = OpenAI(
    base_url=settings.NVIDIA_BASE_URL,
    api_key=settings.NVIDIA_API_KEY,
    timeout=60,
    max_retries=1,
)

def evaluate_application(resume_text: str, job_description: str) -> Dict[str, Any]:
    """Score a resume against a job description using the LLM.

    Pure function: callers are responsible for extracting the resume text
    (typically from the S3-stored PDF) and passing the job description in.
    """
    if not resume_text or not job_description:
        return {
            "score": 0,
            "strengths": [],
            "missing_skills": [],
            "feedback": "Insufficient information to evaluate application."
        }
    
    prompt = f"""
    You are an AI recruiter
    
    Analyze the resume against the job description.
    
    Resume:
    {resume_text}
    
    Job Description:
    {job_description}
    
    IMPORTANT:
    - Return ONLY valid JSON
    - Do NOT include any explanations or text outside the JSON
    - Do NOT use markdown
    
    Format:
    {{
        "strengths": ["skill1", "skill2"],
        "missing_skills": ["skill1", "skill2"],
        "feedback": "short constructive feedback"
    }}
    """
    
    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful hiring assistant"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=1000,
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
        data={
            "strengths": [],
            "missing_skills": [],
            "feedback": "Could not evaluate application due to unexpected response format."
        }
        
    all_strengths = data.get("strengths", [])
    all_missing = data.get("missing_skills", [])
    
    if not isinstance(all_strengths, list):
        all_strengths = []

    if not isinstance(all_missing, list):
        all_missing = []
        
    all_strengths = all_strengths[:10]
    all_missing = all_missing[:10]
    
    total = len(all_strengths) + len(all_missing)

    if total == 0:
        score = 0
    else:
        base = (len(all_strengths) / total) * 100
        penalty = len(all_missing) * 5
        score = int(max(0, min(100, base - penalty)))
        
    strengths = data.get("strengths", [])[:3]
    missing_skills = data.get("missing_skills", [])[:3]
    feedback = data.get("feedback", "")
    

    return {
        "score": score,
        "strengths": strengths,
        "missing_skills": missing_skills,
        "feedback": feedback
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
        max_tokens=4096,
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
