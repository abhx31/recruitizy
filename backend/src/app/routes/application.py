from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.application import ApplicationResponse, ApplicationListResponse, ApplicationUpdate
from uuid import UUID
from app.services.application_service import ApplicationService
from app.services.resume_service import get_latest_resume
from app.core.deps import get_current_applicant, get_current_recruiter
from app.models.user import User
from app.models.job import Job, JobStatus
from app.models.application import Application

router = APIRouter(prefix="/api/application", tags=["application"])

def get_application_service(db: Session = Depends(get_db)) -> ApplicationService:
    return ApplicationService(db)

@router.post("/{job_id}", response_model=ApplicationResponse)
def apply_to_job(
    job_id: UUID,
    service: ApplicationService = Depends(get_application_service),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_applicant),
):
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
    current_user: User = Depends(get_current_applicant)
):
    applications = service.get_user_applications(current_user.id)
    return {"applications": applications}


@router.get('/me/{application_id}', response_model=ApplicationResponse)
def get_my_application(
    application_id: UUID,
    service: ApplicationService = Depends(get_application_service),
    current_user: User = Depends(get_current_applicant),
):
    application = service.get_user_application(application_id, current_user.id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@router.get('/job/{job_id}', response_model=ApplicationListResponse)
def get_job_applications(
    job_id: UUID,
    current_user: User = Depends(get_current_recruiter),
    service: ApplicationService = Depends(get_application_service),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    applications = service.get_job_applications(job_id)
    
    return {
        "applications": applications,
    }
    
@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application_status(
    application_id: UUID,
    data: ApplicationUpdate,
    service: ApplicationService = Depends(get_application_service), 
    current_user: User = Depends(get_current_recruiter),  
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