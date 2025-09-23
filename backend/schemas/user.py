from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    phone: str
    full_name: str


class UserCreate(UserBase):
    password: str

    @validator('phone')
    def validate_phone(cls, v):
        # Ghana phone number validation
        if not v.startswith('+233') and not v.startswith('0'):
            raise ValueError('Phone number must start with +233 or 0')
        if len(v) not in [10, 13]:  # 0200000000 or +233200000000
            raise ValueError('Invalid phone number length for Ghana')
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None