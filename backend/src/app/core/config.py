import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # JWT Settings
    SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7

    # AI Settings
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
    NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-ai/deepseek-v4-pro")
    
    # Databse Settings
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # Email Settings
    RESEND_API_KEY = os.getenv("RESEND_API_KEY")
    EMAIL_FROM = os.getenv("EMAIL_FROM", "Recruitizy <noreply@abhinavdev.in.net>")
    EMAIL_REPLY_TO = os.getenv("EMAIL_REPLY_TO", "abhinav@abhinavdev.in.net")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # AWS S3 Settings
    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
    AWS_REGION = os.getenv("AWS_REGION")
    AWS_ACCESS_KEY_ID = (
        os.getenv("AWS_ACCESS_KEY_ID")
        or os.getenv("AWS_ACCESS_KEY")
    )
    AWS_SECRET_ACCESS_KEY = (
        os.getenv("AWS_SECRET_ACCESS_KEY")
        or os.getenv("AWS_SECRET_KEY")
    )

settings = Settings()
