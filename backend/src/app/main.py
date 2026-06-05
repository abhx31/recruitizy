import logging
import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.logging_config import configure_logging

configure_logging()

from app.core.redis_client import redis_client
from app.core.request_logging import RequestIdMiddleware
from app.db.database import get_db
from app.routes import applicant, application, auth, job, resume

logger = logging.getLogger(__name__)

app = FastAPI()

# Request ID middleware first so its contextvar is set BEFORE CORS or any
# other middleware logs anything during the request lifecycle.
app.add_middleware(RequestIdMiddleware)

DEFAULT_ORIGINS = "http://localhost:3000,http://localhost:3001"
origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(job.router)
app.include_router(application.router)
app.include_router(resume.router)
app.include_router(applicant.router)


@app.get("/")
def read_root():
    return {"message": "Server is running successfully!"}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    """Liveness + readiness check used by Docker and any external monitor.

    Returns 200 only when every external dependency we need (DB, Redis) is
    reachable. A failure anywhere flips the response to 503 so orchestrators /
    healthcheck watchers can act (restart, remove from load balancer, etc.).
    """
    checks: dict[str, str] = {}

    try:
        db.execute(text("SELECT 1"))
        checks["db"] = "ok"
    except Exception as error:
        logger.warning("Health check: DB unreachable: %s", error)
        checks["db"] = "error"

    try:
        if redis_client.ping():
            checks["redis"] = "ok"
        else:
            checks["redis"] = "error"
    except Exception as error:
        logger.warning("Health check: Redis unreachable: %s", error)
        checks["redis"] = "error"

    healthy = all(value == "ok" for value in checks.values())
    return JSONResponse(
        status_code=200 if healthy else 503,
        content={
            "status": "ok" if healthy else "degraded",
            "checks": checks,
        },
    )
