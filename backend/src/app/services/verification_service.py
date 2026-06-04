"""Email verification token storage in Redis.

Tokens are short-lived, single-use, and don't need to survive a Redis restart
(a lost token just means the user requests a resend). That's why this is in
Redis instead of Postgres.
"""

import secrets
from typing import Optional
from uuid import UUID

from app.core.redis_client import redis_client

TOKEN_TTL_SECONDS = 24 * 60 * 60       # 24 hours
RESEND_COOLDOWN_SECONDS = 60           # one resend per user per minute

# Public-provider email domains that aren't acceptable for recruiter signup.
# Not exhaustive — designed to catch the obvious "I'll use my personal email"
# attempts. A determined adversary can buy a domain for $10.
FREE_EMAIL_DOMAINS = frozenset({
    # Mainstream personal providers
    "gmail.com", "googlemail.com",
    "yahoo.com", "ymail.com", "rocketmail.com",
    "outlook.com", "hotmail.com", "live.com", "msn.com",
    "icloud.com", "me.com", "mac.com",
    "protonmail.com", "pm.me", "proton.me",
    "aol.com", "mail.com",
    "yandex.com", "yandex.ru",
    "zoho.com", "gmx.com", "gmx.net",
    "tutanota.com", "tuta.io", "fastmail.com",
    # Disposable / throwaway providers
    "mailinator.com", "guerrillamail.com", "10minutemail.com",
    "tempmail.com", "throwawaymail.com", "yopmail.com", "trashmail.com",
})


def is_free_email_domain(email: str) -> bool:
    """True if the email is at a known personal/disposable provider."""
    domain = email.lower().rsplit("@", 1)[-1].strip()
    return domain in FREE_EMAIL_DOMAINS


def _token_key(token: str) -> str:
    return f"email-verify:token:{token}"


def _resend_key(user_id: UUID) -> str:
    return f"email-verify:resend:{user_id}"


def issue_token(user_id: UUID) -> str:
    """Generate a fresh verification token, store it in Redis, and return it.

    The token expires automatically after TOKEN_TTL_SECONDS.
    """
    token = secrets.token_urlsafe(32)
    redis_client.setex(_token_key(token), TOKEN_TTL_SECONDS, str(user_id))
    return token


def consume_token(token: str) -> Optional[UUID]:
    """Look up the user_id for a token and delete the token in one operation.

    Returns the user_id if the token was valid, None if it was invalid/expired.
    Single-use — calling this twice with the same token returns None the second time.
    """
    key = _token_key(token)
    user_id = redis_client.get(key)
    if not user_id:
        return None
    redis_client.delete(key)
    return UUID(user_id)


def try_acquire_resend_slot(user_id: UUID) -> bool:
    """Atomic check-and-set: True if the user is allowed to request a resend now,
    False if they're still in the cooldown window.

    Implemented as SET ... NX EX so the check and the marker happen in one
    Redis round-trip — no race condition between two simultaneous resend requests.
    """
    acquired = redis_client.set(
        _resend_key(user_id),
        "1",
        ex=RESEND_COOLDOWN_SECONDS,
        nx=True,
    )
    return bool(acquired)
