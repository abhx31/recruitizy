from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.job import JobCreate, JobUpdate, JobListResponse, JobResponse
from app.services.job_service import JobService
from app.core.deps import get_current_recruiter
from app.models.user import User
from uuid import UUID

router = APIRouter(prefix="/api/job", tags=["job"])

def get_job_service(db: Session = Depends(get_db)) -> JobService:
    return JobService(db)


@router.post('', response_model=JobResponse)
def create_job(
    data:JobCreate,
    job_service: JobService = Depends(get_job_service),
    current_user: User = Depends(get_current_recruiter)
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
    current_user: User = Depends(get_current_recruiter)
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
    current_user: User = Depends(get_current_recruiter)
):
    job = job_service.get_job_by_id(job_id)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not Found")
    
    if job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    job_service.delete_job(job)
    
    return { "message": "Job deleted successfully" }
    