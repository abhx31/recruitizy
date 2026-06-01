from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
import enum
from app.db.database import Base

class JobLevel(enum.Enum):
    FRESHER = "FRESHER"
    JUNIOR = "JUNIOR"
    MID = "MID"
    SENIOR = "SENIOR"
    
class EmploymentType(enum.Enum):
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"
    INTERN = "INTERN"
    CONTRACT = "CONTRACT"
    
class JobStatus(enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"
    DRAFT = "DRAFT"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    company = Column(String, nullable=False)
    required_skills = Column(ARRAY(String), nullable=False)
    resume_match_threshold = Column(Integer, nullable=True)
    level = Column(SQLEnum(JobLevel, name='job_level_enum'), nullable=False)
    employment_type = Column(SQLEnum(EmploymentType, name='employment_type_enum'), nullable=False)
    status = Column(SQLEnum(JobStatus, name='job_status_enum'), default=JobStatus.OPEN, nullable=False)
    recruiter_id = Column(UUID(as_uuid=True), ForeignKey("users.id", name="fk_jobs_recruiter_id"), nullable=False)
    location = Column(String, nullable=True)
    min_salary = Column(Integer, nullable=True)
    max_salary = Column(Integer, nullable=True)
    currency = Column(String, default="INR")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True, default=None)

    recruiter = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

    __table_args__ = (
        Index(
            "idx_job_search",
            "status",
            "level",
            "employment_type",
            "created_at"
        ),
    )