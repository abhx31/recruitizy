from uuid import uuid4

from sqlalchemy import (
    Column,
    String,
    ForeignKey,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship

from app.db.database import Base


class ApplicantSkill(Base):
    __tablename__ = "applicant_skills"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    profile_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "applicant_profiles.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    skill_name = Column(
        String,
        nullable=False,
    )

    profile = relationship(
        "ApplicantProfile",
        back_populates="skills",
    )