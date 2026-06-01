import re
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def validate_password_strength(password: str) -> str:
    """Enforce password policy: min 8 chars, upper, lower, special symbol."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters.")

    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must include at least one uppercase letter.")

    if not re.search(r"[a-z]", password):
        raise ValueError("Password must include at least one lowercase letter.")

    if not re.search(r"[^A-Za-z0-9]", password):
        raise ValueError("Password must include at least one special character.")

    return password

def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta

    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_access_token(token:str) -> Optional[dict]:
    """Verify a JWT access token and return the decoded data."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None