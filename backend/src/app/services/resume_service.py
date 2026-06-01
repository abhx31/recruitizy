from sqlalchemy.orm import Session
from app.models.resume import Resume


def save_resume(db:Session, user_id, s3_key, original_name):
    db.query(Resume).filter(
        Resume.user_id == user_id,
        Resume.is_active == True
    ).update({"is_active": False})
    
    resume = Resume(
        user_id = user_id,
        s3_key = s3_key,
        original_name=original_name,
        is_active=True
    )
    
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return resume

def get_resume_by_id(db: Session, resume_id, user_id):
    return db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == user_id
    ).first()


def get_latest_resume(db: Session, user_id):
    return (
        db.query(Resume)
        .filter(
            Resume.user_id == user_id,
            Resume.is_active == True
        )
        .order_by(Resume.created_at.desc())
        .first()
    )
