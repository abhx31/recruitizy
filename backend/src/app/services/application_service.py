from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.models.resume import Resume
from sqlalchemy.orm import Session
from app.tasks.application_tasks import process_application

class ApplicationService:
    def __init__(self, db: Session):
        self.db = db
        
    def apply(self, user, job: Job, resume: Resume):
        """Create a new application for a user to a job."""
        existing = self.db.query(Application).filter(
            Application.user_id == user.id,
            Application.job_id == job.id,
        ).first()
        
        if existing:
            raise ValueError("You have already applied to this job.")
        
        application = Application(
            user_id = user.id,
            job_id = job.id,
            resume_id = resume.id,
            status = ApplicationStatus.PENDING
        )
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        
        process_application.delay(str(application.id))

        return application
    
    def update_status(self, application, data):
        """Update the status of an application."""
        application.status = data.status
        self.db.commit()
        self.db.refresh(application)
        
        return application
    
    def get_user_applications(self, user_id):
        """Get all applications for a user."""
        return self.db.query(Application).filter(
            Application.user_id == user_id
        ).all()
        
    def get_job_applications(self, job_id):
        """Get all applications for a job. """
        return self.db.query(Application).filter(
            Application.job_id == job_id
        ).all()