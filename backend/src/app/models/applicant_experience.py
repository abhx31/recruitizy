from uuid import uuid4
from datetime import date

from sqlalchemy import (
    Column,
    String,
    Text,
    ForeignKey,
    Date,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import relationship

from app.db.database import Base


class ApplicantExperience(Base):
    __tablename__ = "applicant_experiences"

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

    company = Column(
        String,
        nullable=False,
    )

    role = Column(
        String,
        nullable=False,
    )

    start_date = Column(
        Date,
        nullable=True,
    )

    end_date = Column(
        Date,
        nullable=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    profile = relationship(
        "ApplicantProfile",
        back_populates="experiences",
    )