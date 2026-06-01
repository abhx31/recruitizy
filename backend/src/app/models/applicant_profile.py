from uuid import uuid4
from sqlalchemy import (
    Column,
    String,
    Text,
    ForeignKey,
    Integer,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base


class ApplicantProfile(Base):
    __tablename__ = "applicant_profiles"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    years_of_experience = Column(
        Integer,
        nullable=True,
    )
    profile_picture_url = Column(
        String,
        nullable=True,
    )
    user = relationship(
        "User",
        back_populates="applicant_profile",
    )
    skills = relationship(
        "ApplicantSkill",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
    experiences = relationship(
        "ApplicantExperience",
        back_populates="profile",
        cascade="all, delete-orphan",
    )