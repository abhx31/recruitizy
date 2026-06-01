from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Enum as SQLEnum, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
import enum
from app.db.database import Base

class ApplicationStatus(enum.Enum):
    PENDING = "PENDING"
    SHORTLISTED = "SHORTLISTED"
    REJECTED = "REJECTED"

class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", name="fk_applications_user_id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", name="fk_applications_job_id"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id", name="fk_applications_resume_id"), nullable=False)
    status = Column(SQLEnum(ApplicationStatus, name="applicationstatus"), default=ApplicationStatus.PENDING) 
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    ai_score = relationship("AIScore", back_populates="application", uselist=False)
    resume = relationship("Resume", lazy="joined")
    
    __table_args__ = (
        Index("idx_applications_user_id", "user_id"),
        Index("idx_applications_job_id", "job_id"),
        # Index("idx_applications_resume_id", "resume_id"),
        UniqueConstraint("user_id", "job_id", name="unique_user_job_application"),
    )