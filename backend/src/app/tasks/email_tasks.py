from app.core.celery import celery
from app.services.email_service import send_email


@celery.task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_verification_email(self, email: str, name: str, verify_url: str):
    send_email(
        to=email,
        subject="Verify your email — Recruitizy",
        template="verify_email.html",
        context={"name": name, "verify_url": verify_url},
    )


@celery.task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_hr_decision_email(
    self,
    email: str,
    name: str,
    job_title: str,
    company: str,
    decision: str,
):
    """Notify an applicant that a recruiter has manually accepted or rejected
    their application. `decision` is "SHORTLISTED" (accepted) or "REJECTED".
    """
    if decision == "SHORTLISTED":
        template = "hr_accepted.html"
        subject = f"You're moving forward — {job_title}"
    else:
        template = "hr_rejected.html"
        subject = f"Update on your {job_title} application"

    send_email(
        to=email,
        subject=subject,
        template=template,
        context={
            "name": name,
            "job_title": job_title,
            "company": company,
        },
    )