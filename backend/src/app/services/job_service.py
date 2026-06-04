from sqlalchemy.orm import Session
from sqlalchemy import func, select
from uuid import UUID
from typing import List, Tuple
from datetime import datetime, timedelta

from app.models.job import Job, JobStatus
from app.models.application import Application, ApplicationStatus
from app.schemas.job import JobCreate

class JobService:
    def __init__(self, db:Session):
        self.db = db
        
    def create_job(self, data: JobCreate, recruiter_id: UUID) -> Job:
        """Create a job"""
        job = Job(
            **data.model_dump(),
            recruiter_id=recruiter_id,
            status=JobStatus.OPEN,
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

    def get_jobs_by_recruiter_with_counts(
        self, recruiter_id: UUID
    ) -> List[Job]:
        """Recruiter's jobs, with applicant_count attached to each Job instance.

        applicant_count is set as an attribute (not a column) — Pydantic's
        from_attributes will pick it up when serializing JobResponse.
        """
        # Subquery: applications per job (only counts undeleted jobs' apps)
        count_sq = (
            select(
                Application.job_id,
                func.count(Application.id).label("applicant_count"),
            )
            .group_by(Application.job_id)
            .subquery()
        )

        rows = (
            self.db.query(Job, count_sq.c.applicant_count)
            .outerjoin(count_sq, count_sq.c.job_id == Job.id)
            .filter(Job.recruiter_id == recruiter_id, Job.deleted_at == None)
            .order_by(Job.created_at.desc())
            .all()
        )

        jobs = []
        for job, count in rows:
            job.applicant_count = count or 0
            jobs.append(job)
        return jobs

    def get_stats_for_recruiter(self, recruiter_id: UUID) -> dict:
        """Aggregate stats for a recruiter's hiring activity."""
        one_week_ago = datetime.utcnow() - timedelta(days=7)

        # Jobs query base: only this recruiter's, non-deleted
        job_ids_subq = (
            self.db.query(Job.id)
            .filter(Job.recruiter_id == recruiter_id, Job.deleted_at == None)
            .subquery()
        )

        open_jobs = (
            self.db.query(func.count(Job.id))
            .filter(
                Job.recruiter_id == recruiter_id,
                Job.deleted_at == None,
                Job.status == JobStatus.OPEN,
            )
            .scalar()
        )

        total_applicants = (
            self.db.query(func.count(Application.id))
            .filter(Application.job_id.in_(select(job_ids_subq)))
            .scalar()
        )

        applicants_this_week = (
            self.db.query(func.count(Application.id))
            .filter(
                Application.job_id.in_(select(job_ids_subq)),
                Application.created_at >= one_week_ago,
            )
            .scalar()
        )

        shortlisted = (
            self.db.query(func.count(Application.id))
            .filter(
                Application.job_id.in_(select(job_ids_subq)),
                Application.status == ApplicationStatus.SHORTLISTED,
            )
            .scalar()
        )

        return {
            "open_jobs": open_jobs or 0,
            "total_applicants": total_applicants or 0,
            "applicants_this_week": applicants_this_week or 0,
            "shortlisted": shortlisted or 0,
        }
    
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
        job.status = JobStatus.CLOSED
        self.db.commit()

    def get_existing_active_job(self, title, company, recruiter_id, level, employment_type):
        return self.db.query(Job).filter(
            Job.title == title,
            Job.company == company,
            Job.recruiter_id == recruiter_id,
            Job.level == level,
            Job.employment_type == employment_type,
            Job.status == JobStatus.OPEN,
            Job.deleted_at == None,
        ).first()
    