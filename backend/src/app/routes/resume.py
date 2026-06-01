import os
import tempfile
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.database import get_db
from app.core.deps import get_current_applicant
from app.schemas.applicant import ApplicantProfileResponse
from app.schemas.resume import (
    UploadURLRequest,
    UploadURLResponse,
    SaveResumeRequest,
    ResumeResponse,
    DownloadURLResponse
)

from app.services.resume_service import (
    save_resume,
    get_resume_by_id,
    get_latest_resume,
)

from app.services.s3_service import (
    download_file,
    generate_download_url,
    generate_upload_url
)
from app.services.resume_text_extractor import extract_text_from_pdf
from app.services.ai_service import extract_profile_from_resume_text
from app.services.applicant_service import ApplicantService

router = APIRouter(prefix='/api/resume', tags={"Resumes"})


def parse_iso_date(value):
    if not value:
        return None

    try:
        return date.fromisoformat(value)
    except ValueError:
        return None


def normalize_social_url(value, handle_prefix: str) -> str | None:
    """Accept a full URL, partial URL, or bare handle and return a full URL."""
    if not value:
        return None

    v = str(value).strip().lstrip("@").strip()
    if not v:
        return None

    lower = v.lower()
    if lower.startswith(("http://", "https://")):
        return v
    if lower.startswith("www."):
        return f"https://{v[4:]}"
    if "." in v and "/" not in v.split(".")[0]:
        return f"https://{v}"
    return f"{handle_prefix}{v}"


def normalize_profile_data(data: dict) -> dict:
    experiences = []

    for item in data.get("experiences", []):
        experiences.append(
            {
                **item,
                "start_date": parse_iso_date(item.get("start_date")),
                "end_date": parse_iso_date(item.get("end_date")),
            }
        )

    years_of_experience = data.get("years_of_experience")

    if not isinstance(years_of_experience, int):
        years_of_experience = None

    return {
        **data,
        "linkedin_url": normalize_social_url(
            data.get("linkedin_url"), "https://www.linkedin.com/in/"
        ),
        "github_url": normalize_social_url(
            data.get("github_url"), "https://github.com/"
        ),
        "portfolio_url": normalize_social_url(
            data.get("portfolio_url"), "https://"
        ),
        "years_of_experience": years_of_experience,
        "experiences": experiences,
    }

@router.post("/upload-url", response_model=UploadURLResponse)
def get_upload_url(
    payload: UploadURLRequest,
    current_user = Depends(get_current_applicant)
):
    try:
        return generate_upload_url(
            filename=payload.filename,
            content_type=payload.content_type
        )
    except ValueError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="Unable to generate resume upload URL.",
        ) from error
    
@router.post("/save", response_model=ResumeResponse)
def save_resume_data(
    payload: SaveResumeRequest,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_applicant)
):
    resume = save_resume(
        db=db,
        user_id=current_user.id,
        s3_key=payload.s3_key,
        original_name=payload.original_name
    )
    
    return resume


@router.get("/latest", response_model=ResumeResponse | None)
def get_latest_resume_data(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_applicant),
):
    return get_latest_resume(db, current_user.id)


@router.post("/sync-profile", response_model=ApplicantProfileResponse)
def sync_profile_from_latest_resume(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_applicant),
):
    resume = get_latest_resume(db, current_user.id)

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Upload a resume before syncing your profile.",
        )

    suffix = os.path.splitext(resume.original_name)[1] or ".pdf"

    with tempfile.NamedTemporaryFile(
        suffix=suffix,
        delete=False,
    ) as temp_file:
        file_path = temp_file.name

    try:
        download_file(resume.s3_key, file_path)
        resume_text = extract_text_from_pdf(file_path)
        profile_data = extract_profile_from_resume_text(resume_text)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    applicant_service = ApplicantService(db)
    profile = applicant_service.get_or_create_profile(current_user)

    return applicant_service.update_profile_from_resume(
        profile,
        normalize_profile_data(profile_data),
    )

@router.get("/{resume_id}/download", response_model=DownloadURLResponse)
def get_download_url(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_applicant)
):
    resume = get_resume_by_id(db, resume_id, current_user.id)
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    url = generate_download_url(resume.s3_key)
    
    return {"download_url":url}
