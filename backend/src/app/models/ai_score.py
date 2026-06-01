from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from app.db.database import Base


class AIScore(Base):
    __tablename__ = "ai_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", name="fk_aiscore_application_id"), nullable=False, unique=True)
    score = Column(Integer, nullable=False)
    missing_skills = Column(ARRAY(String), nullable=True)
    strengths = Column(ARRAY(String), nullable=True)
    feedback = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    application = relationship("Application", back_populates="ai_score")
    
    __table_args__ = (
        Index("idx_aiscore_application_id", "application_id"),
        CheckConstraint("score >= 0 AND score <= 100", name="check_score_range"),
    )