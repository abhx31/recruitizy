from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import verify_access_token
from app.models.user import User, VerificationStatus

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency that verifies JWT and returns current user.
    """
    token = credentials.credentials
    
    # Verify token
    payload = verify_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Get user from database
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

def get_current_recruiter(current_user: User = Depends(get_current_user)) -> User:
    """Only allow recruiters (verified or not)."""
    if current_user.role.value != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiter access denied"
        )
    return current_user


def get_current_verified_recruiter(
    current_user: User = Depends(get_current_recruiter),
) -> User:
    """Only allow recruiters whose email has been verified.

    Use this for any route that grants access to candidate data, allows posting
    jobs, etc. Unverified recruiters can still log in (to see the 'verify your
    email' screen), but every privileged action goes through this gate.
    """
    if current_user.verification_status != VerificationStatus.VERIFIED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email to continue.",
        )
    return current_user


def get_current_applicant(current_user: User = Depends(get_current_user)) -> User:
    """Only allow applicants"""
    if current_user.role.value != "applicant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Applicant access required"
        )
    return current_user