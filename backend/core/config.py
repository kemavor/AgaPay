from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost/agapay_db"
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Paystack settings
    PAYSTACK_SECRET_KEY: str = "sk_test_your-paystack-secret-key"
    PAYSTACK_PUBLIC_KEY: str = "pk_test_your-paystack-public-key"

    # Redis settings
    REDIS_URL: str = "redis://localhost:6379"

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()