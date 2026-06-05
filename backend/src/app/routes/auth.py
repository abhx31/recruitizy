from fastapi import APIRouter, Depends, HTTPException, Request, Response, Cookie
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserResponse, MessageResponse, RefreshTokenResponse, ChangePasswordRequest
from app.services.auth_service import AuthService
from app.core.config import settings
from app.tasks.email_tasks import send_verification_email
from app.services.rate_limit import check_fixed_window, get_client_ip
from app.services.verification_service import (
    consume_token,
    is_free_email_domain,
    issue_token,
    try_acquire_resend_slot,
)

from app.models.user import User, UserRole, VerificationStatus
from app.core.deps import get_current_user

# Rate-limit policy lives at the top of the route file so it's easy to find
# and tune. Numbers picked to be invisible to humans, painful for scripts.
_LOGIN_LIMIT = 10
_LOGIN_WINDOW = 60          # 10 login attempts per minute per (IP, email)

_SIGNUP_LIMIT = 5
_SIGNUP_WINDOW = 60 * 60    # 5 signups per hour per IP


def _enforce_rate_limit(key: str, limit: int, window: int, message: str) -> None:
    result = check_fixed_window(key, limit=limit, window_seconds=window)
    if not result.allowed:
        raise HTTPException(
            status_code=429,
            detail=message,
            headers={"Retry-After": str(result.retry_after)},
        )

router = APIRouter(prefix="/api/auth", tags=["auth"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

@router.post("/signup", response_model=TokenResponse)
def signup(
    data: SignupRequest,
    request: Request,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Rate limit account creation per source IP to deter automated signup spam.
    ip = get_client_ip(request)
    if ip:
        _enforce_rate_limit(
            key=f"rate:signup:{ip}",
            limit=_SIGNUP_LIMIT,
            window=_SIGNUP_WINDOW,
            message="Too many signup attempts. Please try again later.",
        )

    # Check if exists
    if auth_service.get_user_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Recruiters must use a company email, not a personal/free provider.
    if data.role == UserRole.Recruiter.value and is_free_email_domain(data.email):
        raise HTTPException(
            status_code=400,
            detail="Please use your company email address.",
        )

    # Create user (default verification_status=PENDING_EMAIL via the model)
    user = auth_service.create_user(data.email, data.password, data.name, data.role)

    # Every new account must verify their email before they can use the product.
    # The verify email IS the welcome — no separate welcome email.
    token = issue_token(user.id)
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    send_verification_email.delay(user.email, user.name, verify_url)

    # Create tokens
    access_token = auth_service.create_access_token_for_user(user)
    refresh_token = auth_service.create_refresh_token(user.id)
    
    # Set cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS*24*60*60
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )
    
@router.post("/login", response_model=TokenResponse)
def login (
    data: LoginRequest,
    request: Request,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Rate limit by (IP, email) so a single IP can't grind through guesses on
    # one account, and a single email can't be targeted from many IPs. Email
    # is lowercased so case variations share the same bucket.
    ip = get_client_ip(request) or "unknown"
    email_key = data.email.strip().lower()
    _enforce_rate_limit(
        key=f"rate:login:{ip}:{email_key}",
        limit=_LOGIN_LIMIT,
        window=_LOGIN_WINDOW,
        message="Too many login attempts. Please try again in a minute.",
    )

    # Find User
    user = auth_service.get_user_by_email(data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify Password
    if not auth_service.verify_user_password(user, data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create tokens
    access_token = auth_service.create_access_token_for_user(user)
    refresh_token = auth_service.create_refresh_token(user.id)
    
    # Set Cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS*24*60*60
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )
    
@router.post('/refresh', response_model=RefreshTokenResponse)
def refresh(
    response: Response,
    refresh_token: str = Cookie(None),
    auth_service: AuthService = Depends(get_auth_service)
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    
    db_token = auth_service.get_refresh_token(refresh_token)
    if not db_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    if auth_service.is_token_expired(db_token):
        auth_service.delete_refresh_token(db_token)
        raise HTTPException(status_code=401, detail="Refresh token expired")
    
    user = db_token.user
    access_token = auth_service.create_access_token_for_user(user)
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )
    
@router.post("/logout", response_model=MessageResponse)
def logout(
    response: Response,
    refresh_token: str = Cookie(None),
    auth_service: AuthService = Depends(get_auth_service)
):
    if refresh_token:
        db_token = auth_service.get_refresh_token(refresh_token)
        if db_token:
            auth_service.delete_refresh_token(db_token)
            
    response.delete_cookie("refresh_token")
    return MessageResponse(message="Logged out successfully")
        
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged-in user profile"""
    return UserResponse.model_validate(current_user)


@router.get("/verify-email", response_model=MessageResponse)
def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    user_id = consume_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=400,
            detail="Verification link is invalid or has expired. Please request a new one.",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.verification_status = VerificationStatus.VERIFIED
    db.commit()

    return MessageResponse(message="Email verified successfully")


@router.post("/resend-verification", response_model=MessageResponse)
def resend_verification(
    current_user: User = Depends(get_current_user),
):
    if current_user.verification_status == VerificationStatus.VERIFIED:
        raise HTTPException(
            status_code=400,
            detail="Your email is already verified.",
        )

    if not try_acquire_resend_slot(current_user.id):
        raise HTTPException(
            status_code=429,
            detail="Please wait a minute before requesting another verification email.",
        )

    token = issue_token(current_user.id)
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    send_verification_email.delay(current_user.email, current_user.name, verify_url)

    return MessageResponse(message="Verification email sent")

@router.post("/change-password", response_model=MessageResponse)
def change_password(
    data: ChangePasswordRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
):
    try:
        auth_service.change_password(current_user, data.current_password, data.new_password)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    response.delete_cookie("refresh_token")
    return MessageResponse(message="Password updated successfully")