from pydantic import BaseModel
from typing import List
from uuid import UUID
from app.models.application import ApplicationStatus
from datetime import datetime

class ApplicationCreate(BaseModel):
    job_id: UUID
    
class ApplicationUpdate(BaseModel):
    status: ApplicationStatus
    
class ApplicationResponse(BaseModel):
    id: UUID
    user_id: UUID
    job_id: UUID
    status: ApplicationStatus
    created_at: datetime
    
    model_config = {"from_attributes": True}
    
class ApplicationUpdate(BaseModel):
    status: ApplicationStatus
    
class ApplicationListResponse(BaseModel):
    applications: List[ApplicationResponse]