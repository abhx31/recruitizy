from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from uuid import UUID

from app.core.security import validate_password_strength

# Request schemas
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str  # "applicant" or "recruiter"

    @field_validator("password")
    @classmethod
    def _check_password_strength(cls, value: str) -> str:
        return validate_password_strength(value)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def _check_new_password_strength(cls, value: str) -> str:
        return validate_password_strength(value)

# Response schemas
class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    role: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class MessageResponse(BaseModel):
    message: str
    
class RefreshTokenResponse(BaseModel):
    access_token: str