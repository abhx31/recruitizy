import os
import tempfile

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.job import (
    JobCreate,
    JobListResponse,
    JobParseRequest,
    JobParseUploadURLRequest,
    JobParseUploadURLResponse,
    JobParsedFile,
    JobResponse,
    JobUpdate,
    RecruiterJobStats,
)
from app.services.job_service import JobService
from app.services.ai_service import extract_job_from_description_text
from app.services.resume_text_extractor import extract_text_from_pdf
from app.services.s3_service import download_file, generate_upload_url
from app.core.deps import get_current_verified_recruiter
from app.models.user import User
from uuid import UUID

router = APIRouter(prefix="/api/job", tags=["job"])

def get_job_service(db: Session = Depends(get_db)) -> JobService:
    return JobService(db)


@router.post('', response_model=JobResponse)
def create_job(
    data:JobCreate,
    job_service: JobService = Depends(get_job_service),
    current_user: User = Depends(get_current_verified_recruiter)
):
    existing = job_service.get_existing_active_job(
        title = data.title,
        company = data.company,
        recruiter_id = current_user.id,
        level = data.level,
        employment_type = data.employment_type
    )
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Active Job already exists"
        )
    
    job = job_service.create_job(
        data=data,
        recruiter_id=current_user.id
    )
    
    return job

@router.get("", response_model=JobListResponse)
def get_jobs(
    skip: int = 0,
    limit: int = 20,
    job_service: JobService = Depends(get_job_service)
):
    jobs, total = job_service.get_all_jobs(skip, limit)

    return {
        "jobs": jobs,
        "total": total
    }


@router.get("/me", response_model=JobListResponse)
def get_my_jobs(
    job_service: JobService = Depends(get_job_service),
    current_user: User = Depends(get_current_verified_recruiter),
):
    """List the recruiter's own jobs, with applicant_count on each."""
    jobs = job_service.get_jobs_by_recruiter_with_counts(current_user.id)
    return {"jobs": jobs, "total": len(jobs)}


@router.get("/me/stats", response_model=RecruiterJobStats)
def get_my_stats(
    job_service: JobService = Depends(get_job_service),
    current_user: User = Depends(get_current_verified_recruiter),
):
    """Aggregate stats for the recruiter's dashboard."""
    return job_service.get_stats_for_recruiter(current_user.id)


@router.post("/parse-upload-url", response_model=JobParseUploadURLResponse)
def get_jd_upload_url(
    payload: JobParseUploadURLRequest,
    _: User = Depends(get_current_verified_recruiter),
):
    """Mint a presigned S3 URL so the browser can upload a JD file directly.

    Matches the resume upload pattern: client gets the URL, PUTs the file to
    S3, then calls /parse with the returned key. Backend never sees the bytes.
    """
    try:
        return generate_upload_url(
            filename=payload.filename,
            content_type=payload.content_type,
        )
    except ValueError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="Unable to generate upload URL.",
        ) from error


@router.post("/parse", response_model=JobParsedFile)
def parse_job_from_s3(
    payload: JobParseRequest,
    _: User = Depends(get_current_verified_recruiter),
):
    """Download an uploaded JD from S3, extract text, parse with AI.

    The file stays in S3 after parsing — same lifecycle as resumes. A bucket
    lifecycle rule can age out the `jd-uploads/*` prefix if storage grows.
    """
    suffix = os.path.splitext(payload.s3_key)[1].lower() or ".pdf"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        file_path = tmp.name

    try:
        download_file(payload.s3_key, file_path)

        if suffix == ".pdf":
            text = extract_text_from_pdf(file_path)
        elif suffix in (".txt", ".md"):
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                text = f.read()
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Upload a PDF or a plain-text file.",
            )
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Couldn't read any text from this file.",
        )

    return extract_job_from_description_text(text)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: UUID,
    job_service: JobService = Depends(get_job_service)
):
    job = job_service.get_job_by_id(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not Found")
    
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: UUID,
    data: JobUpdate,
    job_service: JobService = Depends(get_job_service),
    current_user: User = Depends(get_current_verified_recruiter)
):
    job = job_service.get_job_by_id(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not Found")
    
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    updated_job = job_service.update_job(
        job,
        **data.model_dump(exclude_unset=True)
    )
    
    return updated_job

@router.delete("/{job_id}", status_code=204)
def delete_job(
    job_id: UUID,
    job_service: JobService = Depends(get_job_service),
    current_user: User = Depends(get_current_verified_recruiter)
):
    job = job_service.get_job_by_id(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not Found")
    
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    job_service.delete_job(job)
    
    return { "message": "Job deleted successfully" }
    