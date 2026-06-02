import logging
import os
import tempfile
from uuid import UUID

from app.core.celery import celery
from app.db.database import SessionLocal
from app.models.ai_score import AIScore
from app.models.application import Application, ApplicationStatus
from app.services.ai_service import evaluate_application
from app.services.email_service import send_email
from app.services.resume_text_extractor import extract_text_from_pdf
from app.services.s3_service import download_file

logger = logging.getLogger(__name__)

DEFAULT_THRESHOLD = 60


@celery.task
def process_application(application_id: str):
    db = SessionLocal()

    try:
        application = db.get(Application, UUID(application_id))

        if not application:
            return

        # Idempotency — if it's already been processed, don't re-score.
        if application.status != ApplicationStatus.PENDING:
            return

        resume = application.resume
        job = application.job

        if resume is None or job is None:
            logger.error(
                "Application %s is missing a resume or job; cannot score.",
                application_id,
            )
            return

        # Pull the PDF from S3 to a temp file and extract its text.
        suffix = os.path.splitext(resume.original_name)[1] or ".pdf"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            file_path = tmp.name

        try:
            download_file(resume.s3_key, file_path)
            resume_text = extract_text_from_pdf(file_path)
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

        ai_evaluation = evaluate_application(
            resume_text=resume_text,
            job_description=job.description or "",
        )
        score = ai_evaluation["score"]
        threshold = job.resume_match_threshold or DEFAULT_THRESHOLD

        if score >= threshold:
            application.status = ApplicationStatus.SHORTLISTED
            template = "accepted.html"
            subject = "You're shortlisted!"
        else:
            application.status = ApplicationStatus.REJECTED
            template = "rejected.html"
            subject = "Application Update"

        ai_score = AIScore(
            application_id=application.id,
            score=score,
            missing_skills=ai_evaluation["missing_skills"],
            strengths=ai_evaluation["strengths"],
            feedback=ai_evaluation["feedback"],
        )

        db.add(ai_score)
        db.commit()

        send_email(
            to=application.user.email,
            subject=subject,
            template=template,
            context={
                "name": application.user.name,
                "job_title": job.title,
                "score": score,
                "missing_skills": ai_score.missing_skills or [],
                "strengths": ai_score.strengths or [],
                "feedback": ai_score.feedback,
            },
        )
    finally:
        db.close()
