from app.core.celery import celery
from app.db.database import SessionLocal
from app.models.application import Application, ApplicationStatus
from app.models.ai_score import AIScore
from uuid import UUID

from app.services.email_service import send_email
from app.services.ai_service import evaluate_application

@celery.task
def process_application(application_id: str):
    db = SessionLocal()
    
    try:
        application = db.get(Application, UUID(application_id))
        
        if not application:
            return
        
        # Prevent Duplicate execution
        if application.status != ApplicationStatus.PENDING:
            return
        
        # Simulate AI scoring and decision
        ai_evaluation = evaluate_application(application)
        score = ai_evaluation["score"]
        threshold = application.job.resume_match_threshold
        
        if score >= threshold:
            application.status = ApplicationStatus.SHORTLISTED
            template = "accepted.html"
            subject = "You're shortlisted!"
        else:
            application.status = ApplicationStatus.REJECTED
            template = "rejected.html"
            subject = "Application Update"
            
        ai_score = AIScore(
            application_id = application.id,
            score = score,
            missing_skills = ai_evaluation["missing_skills"],
            strengths = ai_evaluation["strengths"],
            feedback = ai_evaluation["feedback"]
        )
        
        db.add(ai_score)
        
        db.commit()
            
        send_email(
            to=application.user.email,
            subject=subject,
            template=template,
            context={
                "name": application.user.name,
                "job_title": application.job.title,
                "score": score,
                "missing_skills": ai_score.missing_skills or [],
                "strengths": ai_score.strengths or [],
                "feedback": ai_score.feedback
            }
        )
    finally:
        db.close()