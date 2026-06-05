import logging

from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.models.resume import Resume
from sqlalchemy.orm import Session, joinedload
from app.tasks.application_tasks import process_application
from app.tasks.email_tasks import send_hr_decision_email

logger = logging.getLogger(__name__)

_NOTIFIABLE_STATUSES = {ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED}

class ApplicationService:
    def __init__(self, db: Session):
        self.db = db

    def _with_relations(self, query):
        return query.options(
            joinedload(Application.job),
            joinedload(Application.ai_score),
            joinedload(Application.resume),
            joinedload(Application.user),
        )
        
    def apply(self, user, job: Job, resume: Resume):
        """Create a new application for a user to a job."""
        existing = self.db.query(Application).filter(
            Application.user_id == user.id,
            Application.job_id == job.id,
        ).first()

        if existing:
            raise ValueError("You have already applied to this job.")

        application = Application(
            user_id=user.id,
            job_id=job.id,
            resume_id=resume.id,
            status=ApplicationStatus.PENDING,
        )
        self.db.add(application)
        self.db.commit()

        # Enqueue AI scoring; don't fail the apply if the broker is unreachable.
        # The application is already persisted; worst case it stays PENDING until
        # the worker is reachable and we re-enqueue.
        try:
            process_application.delay(str(application.id))
        except Exception as error:
            logger.exception(
                "Failed to enqueue scoring task for application %s: %s",
                application.id,
                error,
            )

        # Refetch with relations so the response can serialize cleanly
        # (response_model needs application.job populated).
        return self.get_user_application(application.id, user.id)
    
    def update_status(self, application, data):
        """Update the status of an application.

        When a recruiter manually flips the status to SHORTLISTED or REJECTED,
        notify the applicant by email — but only if the status actually
        changed, so re-clicking the same button doesn't spam them.
        """
        previous = application.status
        application.status = data.status
        self.db.commit()
        self.db.refresh(application)

        if previous != application.status and application.status in _NOTIFIABLE_STATUSES:
            try:
                send_hr_decision_email.delay(
                    application.user.email,
                    application.user.name,
                    application.job.title,
                    application.job.company,
                    application.status.value,
                )
            except Exception as error:
                logger.exception(
                    "Failed to enqueue HR decision email for application %s: %s",
                    application.id,
                    error,
                )

        return application
    
    def get_user_applications(self, user_id):
        """Get all applications for a user, with job + ai_score + resume eager-loaded."""
        return self._with_relations(
            self.db.query(Application).filter(Application.user_id == user_id)
        ).order_by(Application.created_at.desc()).all()

    def get_user_application(self, application_id, user_id):
        """Get a single application IF it belongs to the user, with relations loaded."""
        return self._with_relations(
            self.db.query(Application).filter(
                Application.id == application_id,
                Application.user_id == user_id,
            )
        ).first()

    def get_job_applications(self, job_id):
        """Get all applications for a job."""
        return self._with_relations(
            self.db.query(Application).filter(Application.job_id == job_id)
        ).order_by(Application.created_at.desc()).all()