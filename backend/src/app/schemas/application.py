from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.application import ApplicationStatus
from app.schemas.job import EmploymentType, JobLevel, JobStatus


class ApplicationCreate(BaseModel):
    job_id: UUID


class ApplicationUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationJobInfo(BaseModel):
    id: UUID
    title: str
    company: str
    level: JobLevel
    employment_type: EmploymentType
    status: JobStatus

    model_config = {"from_attributes": True}


class ApplicationAIScoreInfo(BaseModel):
    score: int
    strengths: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    feedback: Optional[str] = None

    model_config = {"from_attributes": True}


class ApplicationResumeInfo(BaseModel):
    id: UUID
    original_name: str

    model_config = {"from_attributes": True}


class ApplicationResponse(BaseModel):
    id: UUID
    user_id: UUID
    job_id: UUID
    status: ApplicationStatus
    created_at: datetime
    job: ApplicationJobInfo
    ai_score: Optional[ApplicationAIScoreInfo] = None
    resume: Optional[ApplicationResumeInfo] = None

    model_config = {"from_attributes": True}


class ApplicationListResponse(BaseModel):
    applications: List[ApplicationResponse]
