from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Tuple
from datetime import datetime

from app.models.job import Job, JobStatus
from app.schemas.job import JobCreate

class JobService:
    def __init__(self, db:Session):
        self.db = db
        
    def create_job(self, data: JobCreate, recruiter_id: UUID) -> Job:
        """Create a job"""
        job = Job(
            **data.model_dump(),
            recruiter_id = recruiter_id,
            status = JobStatus.OPEN,
            is_active = True
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def get_job_by_id(self, job_id: UUID) -> Job:
        """Get a job based on the job id"""
        job = self.db.query(Job).filter(Job.id == job_id, Job.deleted_at == None).first()
        return job
    
    def get_all_jobs(self, skip: int = 0, limit: int = 20) -> Tuple[List[Job], int]:
        """Get all the jobs with pagination"""
        total = self.db.query(Job).filter(Job.deleted_at == None).count()
        jobs = self.db.query(Job).filter(Job.deleted_at == None).order_by(Job.created_at.desc()).offset(skip).limit(limit).all()
        return jobs, total
    
    def get_jobs_by_recruiter(self, recruiter_id: UUID) -> List[Job]:
        """Get all jobs created by the specific recruiter"""
        jobs = self.db.query(Job).filter(Job.recruiter_id == recruiter_id, Job.deleted_at == None).order_by(Job.created_at.desc()).all()
        return jobs
    
    def update_job(self, job: Job, title=None, description=None, company=None, required_skills=None, resume_match_threshold=None, level=None, employment_type=None, status=None) -> Job:
        if title is not None:
            job.title = title
        if description is not None:
            job.description = description
        if company is not None:
            job.company = company
        if required_skills is not None:
            job.required_skills = required_skills
        if resume_match_threshold is not None:
            job.resume_match_threshold = resume_match_threshold
        if level is not None:
            job.level = level
        if employment_type is not None:
            job.employment_type = employment_type
        if status is not None:
            job.status = status
        
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def delete_job(self, job: Job):
        job.deleted_at = datetime.utcnow()
        job.is_active = False
        job.status = JobStatus.CLOSED
        self.db.commit()
    
    def get_existing_active_job(self, title, company, recruiter_id, level, employment_type):
        return self.db.query(Job).filter(
            Job.title == title,
            Job.company == company,
            Job.recruiter_id == recruiter_id,
            Job.level == level,
            Job.employment_type == employment_type,
            Job.is_active == True,
            Job.deleted_at == None
        ).first()
    