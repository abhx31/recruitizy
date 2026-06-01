import os

from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery = Celery(
    "recruitizy",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery.autodiscover_tasks(["app.tasks"])
import app.tasks.email_tasks  # noqa: E402,F401
