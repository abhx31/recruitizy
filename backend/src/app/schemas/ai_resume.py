from pydantic import BaseModel


class ParsedExperience(BaseModel):
    company: str
    role: str


class ParsedResume(BaseModel):
    headline: str | None
    bio: str | None
    skills: list[str]
    experiences: list[ParsedExperience]