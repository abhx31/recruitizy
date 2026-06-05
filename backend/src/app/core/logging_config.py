"""Centralized logging configuration.

One source of truth for how logs are produced and shaped across the whole
backend (FastAPI requests, Celery tasks, ad-hoc scripts). Every module just
calls `logger = logging.getLogger(__name__)` — this module decides what to
do with the records.

Why this design:
  * `dictConfig` instead of `basicConfig` so we can configure multiple
    loggers (root, uvicorn.access, uvicorn.error, celery) in one shot
    and avoid duplicate handlers.
  * JSON format by default for production (Docker / log aggregators love it),
    plain text fallback for local dev via LOG_FORMAT=plain.
  * Request IDs flow via a contextvar set by the middleware, picked up by a
    logging filter on every record — no need to pass it through every call.
"""

import logging
import logging.config
import os
from contextvars import ContextVar
from typing import Optional

from pythonjsonlogger import jsonlogger


request_id_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)


class RequestIdFilter(logging.Filter):
    """Inject the current request's ID into every log record.

    The contextvar makes this work across async boundaries without callers
    having to thread the ID through every function signature.
    """

    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_var.get()
        return True


class _PlainFormatter(logging.Formatter):
    """Human-readable formatter for local dev. JSON is great for log
    aggregators but painful to read in a terminal during development."""

    def format(self, record: logging.LogRecord) -> str:
        base = super().format(record)
        rid = getattr(record, "request_id", None)
        return f"[{rid or '-'}] {base}"


def _build_config(log_level: str, log_format: str) -> dict:
    formatters = {
        "json": {
            "()": jsonlogger.JsonFormatter,
            "format": (
                "%(asctime)s %(levelname)s %(name)s "
                "%(message)s %(request_id)s"
            ),
            "rename_fields": {
                "asctime": "timestamp",
                "levelname": "level",
                "name": "logger",
            },
        },
        "plain": {
            "()": _PlainFormatter,
            "format": "%(asctime)s %(levelname)-8s %(name)s — %(message)s",
            "datefmt": "%H:%M:%S",
        },
    }

    return {
        "version": 1,
        "disable_existing_loggers": False,
        "filters": {
            "request_id": {"()": RequestIdFilter},
        },
        "formatters": formatters,
        "handlers": {
            "default": {
                "class": "logging.StreamHandler",
                "level": log_level,
                "formatter": log_format,
                "filters": ["request_id"],
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "app": {"handlers": ["default"], "level": log_level, "propagate": False},
            "uvicorn": {"handlers": ["default"], "level": log_level, "propagate": False},
            "uvicorn.error": {"handlers": ["default"], "level": log_level, "propagate": False},
            "uvicorn.access": {"handlers": ["default"], "level": log_level, "propagate": False},
            "celery": {"handlers": ["default"], "level": log_level, "propagate": False},
        },
        "root": {
            "handlers": ["default"],
            "level": log_level,
        },
    }


def configure_logging() -> None:
    """Apply logging config. Idempotent — calling twice is safe.

    Reads two env vars:
      LOG_LEVEL  — DEBUG / INFO / WARNING / ERROR (default INFO)
      LOG_FORMAT — json / plain (default json; use plain for local dev)
    """
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    fmt = os.getenv("LOG_FORMAT", "json").lower()
    if fmt not in ("json", "plain"):
        fmt = "json"

    logging.config.dictConfig(_build_config(level, fmt))
