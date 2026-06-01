from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from uuid import uuid4
from datetime import datetime

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", name="fk_resumes_user_id"), nullable=False)
    s3_key = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")
    
    __table_args__ = (
        Index("idx_resumes_user_id", "user_id"),
        Index("idx_resumes_user_active", "user_id", "is_active"),
    )