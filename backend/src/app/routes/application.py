import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.application import (
    ApplicationResponse,
    ApplicationListResponse,
    ApplicationUpdate,
    RecruiterApplicationListResponse,
    RecruiterApplicationResponse,
    RecruiterApplicationResumeInfo,
)
from uuid import UUID
from app.services.application_service import ApplicationService
from app.services.rate_limit import try_acquire_cooldown
from app.services.resume_service import get_latest_resume
from app.services.s3_service import generate_download_url
from app.core.deps import get_current_verified_applicant, get_current_verified_recruiter
from app.models.user import User
from app.models.job import Job, JobStatus
from app.models.application import Application

logger = logging.getLogger(__name__)

# Soft cooldown between successive apply attempts from the same user — stops
# accidental double-clicks and trivial spam. The DB unique constraint already
# prevents duplicate (user, job) applications; this just gives a cleaner 429
# instead of a noisy 400 in that race.
_APPLY_COOLDOWN_SECONDS = 10

router = APIRouter(prefix="/api/application", tags=["application"])

def get_application_service(db: Session = Depends(get_db)) -> ApplicationService:
    return ApplicationService(db)

@router.post("/{job_id}", response_model=ApplicationResponse)
def apply_to_job(
    job_id: UUID,
    service: ApplicationService = Depends(get_application_service),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_applicant),
):
    if not try_acquire_cooldown(
        key=f"rate:apply:{current_user.id}",
        ttl_seconds=_APPLY_COOLDOWN_SECONDS,
    ):
        raise HTTPException(
            status_code=429,
            detail="You're applying too fast. Please wait a moment before trying again.",
            headers={"Retry-After": str(_APPLY_COOLDOWN_SECONDS)},
        )

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.deleted_at is not None or job.status != JobStatus.OPEN:
        raise HTTPException(status_code=400, detail="Job not open")

    resume = get_latest_resume(db, current_user.id)

    if not resume:
        raise HTTPException(
            status_code=400,
            detail="Please upload a resume in your profile before applying.",
        )

    try:
        application = service.apply(current_user, job, resume)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return application

@router.get('/me', response_model=ApplicationListResponse)
def get_my_applications(
    service: ApplicationService = Depends(get_application_service),
    current_user: User = Depends(get_current_verified_applicant)
):
    applications = service.get_user_applications(current_user.id)
    return {"applications": applications}


@router.get('/me/{application_id}', response_model=ApplicationResponse)
def get_my_application(
    application_id: UUID,
    service: ApplicationService = Depends(get_application_service),
    current_user: User = Depends(get_current_verified_applicant),
):
    application = service.get_user_application(application_id, current_user.id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@router.get('/job/{job_id}', response_model=RecruiterApplicationListResponse)
def get_job_applications(
    job_id: UUID,
    current_user: User = Depends(get_current_verified_recruiter),
    service: ApplicationService = Depends(get_application_service),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    applications = service.get_job_applications(job_id)

    results = []
    for application in applications:
        resume_info = None
        if application.resume:
            # Best-effort download URL — if S3 is mis-configured we don't want
            # the whole list endpoint to 500. The frontend just won't show
            # a download link for that one row.
            download_url = None
            try:
                download_url = generate_download_url(application.resume.s3_key)
            except Exception as error:
                logger.warning(
                    "Failed to generate download URL for resume %s: %s",
                    application.resume.id,
                    error,
                )

            resume_info = RecruiterApplicationResumeInfo(
                id=application.resume.id,
                original_name=application.resume.original_name,
                download_url=download_url,
            )

        results.append(
            RecruiterApplicationResponse(
                id=application.id,
                job_id=application.job_id,
                status=application.status,
                created_at=application.created_at,
                applicant={
                    "id": application.user.id,
                    "name": application.user.name,
                    "email": application.user.email,
                },
                ai_score=application.ai_score,
                resume=resume_info,
            )
        )

    return {"applications": results}
    
@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application_status(
    application_id: UUID,
    data: ApplicationUpdate,
    service: ApplicationService = Depends(get_application_service), 
    current_user: User = Depends(get_current_verified_recruiter),  
    db: Session = Depends(get_db) 
):
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not Authorized")
    
    return service.update_status(application, data)