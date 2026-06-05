"""Redis-backed rate limiting primitives.

Two patterns are exposed:

  * `try_acquire_cooldown` — one action per N seconds (SET NX EX).
  * `check_fixed_window`   — N actions per window (INCR + EXPIRE).

Both fail open: if Redis is unreachable we log and allow the request, so a
Redis outage doesn't take the whole product down with it. Callers that need
fail-closed behavior should wrap the result themselves.
"""

import logging
import time
from dataclasses import dataclass
from typing import Optional

from redis.exceptions import RedisError

from app.core.redis_client import redis_client

logger = logging.getLogger(__name__)


def _safe(call, fallback):
    """Run a Redis call; on RedisError log and return `fallback`."""
    try:
        return call()
    except RedisError as error:
        logger.warning("Rate limit Redis call failed, failing open: %s", error)
        return fallback


def try_acquire_cooldown(key: str, ttl_seconds: int) -> bool:
    """One-shot cooldown. Returns True if the caller acquired the slot, False
    if they are still inside a previous cooldown window.

    Used for "one resend per minute", "one application per 10s", etc.
    """
    acquired = _safe(
        lambda: redis_client.set(key, "1", ex=ttl_seconds, nx=True),
        fallback=True,  # fail open: pretend we acquired
    )
    return bool(acquired)


@dataclass
class FixedWindowResult:
    allowed: bool
    remaining: int       # how many more requests fit in the current window
    retry_after: int     # seconds until the window resets (0 if allowed)


def check_fixed_window(
    key: str,
    limit: int,
    window_seconds: int,
) -> FixedWindowResult:
    """Fixed-window counter. Each call increments a per-window counter; the
    first call in a fresh window sets the TTL so the bucket cleans itself up.

    The window boundary is determined by floor(now / window_seconds), so all
    requests within the same window share a key. When the window rolls over,
    the next request starts a fresh bucket automatically.
    """
    now = int(time.time())
    bucket = now // window_seconds
    bucket_key = f"{key}:{bucket}"

    count = _safe(lambda: redis_client.incr(bucket_key), fallback=0)

    # Only set TTL on the first INCR of a fresh bucket. Re-setting on every
    # call would keep extending the window, which defeats the purpose.
    if count == 1:
        _safe(lambda: redis_client.expire(bucket_key, window_seconds), fallback=None)

    if count == 0:
        # Redis was unreachable. Fail open.
        return FixedWindowResult(allowed=True, remaining=limit, retry_after=0)

    allowed = count <= limit
    remaining = max(0, limit - count)
    retry_after = 0 if allowed else (bucket + 1) * window_seconds - now

    return FixedWindowResult(
        allowed=allowed,
        remaining=remaining,
        retry_after=retry_after,
    )


def get_client_ip(request) -> Optional[str]:
    """Pull the originating client IP from the request.

    Honors X-Forwarded-For when present (nginx in front of FastAPI on EC2 sets
    this) and falls back to the direct client. Returns None if neither is
    available — callers should handle that case (typically by skipping the
    rate-limit, since no key means we can't enforce one).
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # X-Forwarded-For can be a comma-separated chain; the leftmost entry
        # is the original client. Trust your proxy to set this correctly.
        return forwarded.split(",")[0].strip()

    if request.client and request.client.host:
        return request.client.host

    return None
