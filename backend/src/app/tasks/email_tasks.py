from app.core.celery import celery
from app.services.email_service import send_email


@celery.task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_welcome_email(self, email: str, name: str, role: str):
    send_email(
        to=email,
        subject="Welcome to Recruitizy!",
        template="welcome.html",
        context={"name": name, "role": role}
    )


@celery.task(bind=True, autoretry_for=(Exception,), retry_backoff=5, max_retries=3)
def send_verification_email(self, email: str, name: str, verify_url: str):
    send_email(
        to=email,
        subject="Verify your email — Recruitizy",
        template="verify_email.html",
        context={"name": name, "verify_url": verify_url},
    )