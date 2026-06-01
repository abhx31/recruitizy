from sqlalchemy import Column, String, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from app.db.database import Base
import enum
from sqlalchemy.orm import relationship

class UserRole(enum.Enum):
    Applicant = "applicant"
    Recruiter = "recruiter"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    company_name = Column(String, nullable=True)
    role = Column(Enum(UserRole, name="user_role_enum"), nullable=False)
    hashed_password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    
    refresh_tokens = relationship("RefreshToken", back_populates="user")
    applications = relationship("Application", back_populates="user")
    jobs = relationship("Job", back_populates="recruiter")
    resumes = relationship("Resume", back_populates="user")
    applicant_profile = relationship("ApplicantProfile", back_populates="user", uselist=False,)