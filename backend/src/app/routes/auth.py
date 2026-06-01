from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserResponse, MessageResponse, RefreshTokenResponse, ChangePasswordRequest
from app.services.auth_service import AuthService
from app.core.config import settings
from app.tasks.email_tasks import send_welcome_email

from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

@router.post("/signup", response_model=TokenResponse)
def signup(
    data: SignupRequest,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Check if exists
    if auth_service.get_user_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = auth_service.create_user(data.email, data.password, data.name, data.role)
    
    # Send welcome email
    send_welcome_email.delay(user.email, user.name, user.role.value)
    
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
    response: Response,
    auth_service: AuthService = Depends(get_auth_service)
):
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