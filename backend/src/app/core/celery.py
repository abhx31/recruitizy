import os

from celery import Celery
from celery.signals import setup_logging

from app.core.logging_config import configure_logging

configure_logging()


@setup_logging.connect
def _configure_celery_logging(**_kwargs):
    """Stop Celery from re-installing its own log handlers on top of ours.

    Without this, Celery's default `setup_logging_subsystem` wipes our
    `dictConfig` and reverts the worker to plain-text logs.
    """
    configure_logging()


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery = Celery(
    "recruitizy",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

import app.tasks.application_tasks
import app.tasks.email_tasks
