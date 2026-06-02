from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import enum

class JobLevel(str, enum.Enum):
    FRESHER = "FRESHER"
    JUNIOR = "JUNIOR"
    MID = "MID"
    SENIOR = "SENIOR"
    
class EmploymentType(str, enum.Enum):
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"
    INTERN = "INTERN"
    CONTRACT = "CONTRACT"
    
class JobStatus(str, enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    DRAFT = "DRAFT"

class JobCreate(BaseModel):
    title: str
    description: str
    company: str
    required_skills: List[str]
    resume_match_threshold: int
    level: JobLevel
    employment_type: EmploymentType
    
class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    required_skills: Optional[List[str]] = None
    resume_match_threshold: Optional[int] = None
    level: Optional[JobLevel] = None
    employment_type: Optional[EmploymentType] = None
    status: Optional[JobStatus] = None
    
class JobResponse(BaseModel):
    id: UUID
    title: str
    description: str
    company: str
    required_skills: List[str]
    resume_match_threshold: Optional[int] = None
    recruiter_id: UUID
    
    level: JobLevel
    employment_type: EmploymentType
    status: JobStatus
    
    created_at: datetime
    
    model_config = {"from_attributes": True}
        
class JobParsedFile(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    required_skills: Optional[List[str]] = None
        
class JobListResponse(BaseModel):
    jobs: List[JobResponse]
    total: int