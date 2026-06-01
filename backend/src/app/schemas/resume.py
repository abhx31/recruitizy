from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class UploadURLRequest(BaseModel):
    filename: str
    content_type:str
    
class UploadURLResponse(BaseModel):
    upload_url: str
    key: str
    
class SaveResumeRequest(BaseModel):
    s3_key: str
    original_name: str
    
class ResumeResponse(BaseModel):
    id: UUID
    original_name: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
    
class DownloadURLResponse(BaseModel):
    download_url: str
