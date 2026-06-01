from datetime import date
from uuid import UUID

from pydantic import BaseModel


class ApplicantSkillResponse(BaseModel):
    id: UUID
    skill_name: str

    class Config:
        from_attributes = True


class ApplicantExperienceResponse(BaseModel):
    id: UUID
    company: str
    role: str
    start_date: date | None
    end_date: date | None
    description: str | None

    class Config:
        from_attributes = True


class ApplicantProfileResponse(BaseModel):
    id: UUID
    headline: str | None
    bio: str | None
    phone: str | None
    location: str | None
    linkedin_url: str | None
    github_url: str | None
    portfolio_url: str | None
    years_of_experience: int | None
    profile_picture_url: str | None
    skills: list[ApplicantSkillResponse]
    experiences: list[ApplicantExperienceResponse]
    
    class Config:
        from_attributes = True



class ApplicantProfileUpdate(BaseModel):
    headline: str | None = None
    bio: str | None = None
    phone: str | None = None
    location: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    years_of_experience: int | None = None