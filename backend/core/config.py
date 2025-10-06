from pydantic_settings import BaseSettings
from pydantic import validator
from typing import Optional
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./agapay.db"
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Paystack settings
    PAYSTACK_SECRET_KEY: Optional[str] = None
    PAYSTACK_PUBLIC_KEY: Optional[str] = None

    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    @validator('SECRET_KEY')
    def validate_secret_key(cls, v):
        if v == "your-secret-key-change-this-in-production" and os.getenv("NODE_ENV") == "production":
            raise ValueError("SECRET_KEY must be set in production")
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v

    @validator('PAYSTACK_SECRET_KEY')
    def validate_paystack_keys(cls, v):
        if not v:
            print("Warning: PAYSTACK_SECRET_KEY not configured. Payment features will be limited.")
        return v

    class Config:
        env_file = ".env"


settings = Settings()