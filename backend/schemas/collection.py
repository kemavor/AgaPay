from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models import models


class CollectionBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_amount: Optional[float] = None
    currency: str = "GHS"
    status: models.CollectionStatus = models.CollectionStatus.ACTIVE
    is_public: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class CollectionCreate(CollectionBase):
    pass


class CollectionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    status: Optional[models.CollectionStatus] = None
    is_public: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class CollectionResponse(CollectionBase):
    id: int
    current_amount: float
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True