from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets

from app.db.database import get_db
from app.models.user import User, UserRole
from app.models.refresh_token import RefreshToken
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings

class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_email(self, email: str) -> User | None:
        """Fetch a user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def create_user(self, email: str, password: str, name: str, role: str) -> User:
        """Create a new user with hashed password."""
        user = User(
            email=email,
            name=name,
            hashed_password=hash_password(password),
            role=UserRole(role)
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def verify_user_password(self, user: User, password: str) -> bool:
        """Verify a user's password."""
        return verify_password(password, user.hashed_password)
    
    def create_access_token_for_user(self, user: User) -> str:
        """Create a JWT access token for a user"""
        return create_access_token(
            data={"sub": str(user.id), "role": user.role.value},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
    
    def create_refresh_token(self, user_id) -> str:
        token = secrets.token_urlsafe(32)
        db_token = RefreshToken(
            user_id = user_id,
            token = token,
            expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        self.db.add(db_token)
        self.db.commit()
        return token
    
    def get_refresh_token(self, token: str) -> RefreshToken | None:
        return self.db.query(RefreshToken).filter(RefreshToken.token == token).first()
    
    def is_token_expired(self, db_token: RefreshToken) -> bool:
        return db_token.expires_at < datetime.utcnow()
    
    def delete_refresh_token(self, db_token: RefreshToken):
        self.db.delete(db_token)
        self.db.commit()

    def change_password(self, user: User, current_password: str, new_password: str) -> None:
        if not verify_password(current_password, user.hashed_password):
            raise ValueError("Current password is incorrect")

        user.hashed_password = hash_password(new_password)
        self.db.commit()

        self.db.query(RefreshToken).filter(RefreshToken.user_id == user.id).delete()
        self.db.commit()