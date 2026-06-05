"""Per-request logging plumbing.

Sets a correlation ID on each incoming request so every log emitted while
handling it can be traced back. The ID is either echoed from an inbound
`X-Request-ID` header (so a reverse proxy / mobile client can supply one
and trace end-to-end), or generated as a fresh UUID4.
"""

import logging
import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging_config import request_id_var

logger = logging.getLogger("app.request")

REQUEST_ID_HEADER = "X-Request-ID"


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Generate/echo a request ID and log a structured access line per request.

    Replaces uvicorn's plain-text access log with one that includes the
    correlation ID, so a single `request_id` value lets you grep every line
    related to one request from across the whole system.
    """

    async def dispatch(self, request: Request, call_next):
        incoming = request.headers.get(REQUEST_ID_HEADER)
        request_id = incoming or uuid.uuid4().hex

        token = request_id_var.set(request_id)
        start = time.perf_counter()

        try:
            response: Response = await call_next(request)
        except Exception:
            logger.exception(
                "request failed",
                extra={
                    "method": request.method,
                    "path": request.url.path,
                },
            )
            raise
        else:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.info(
                "request",
                extra={
                    "method": request.method,
                    "path": request.url.path,
                    "status": response.status_code,
                    "duration_ms": round(duration_ms, 2),
                },
            )
            response.headers[REQUEST_ID_HEADER] = request_id
            return response
        finally:
            request_id_var.reset(token)
