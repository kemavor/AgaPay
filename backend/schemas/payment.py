from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from models.models import PaymentStatus, PaymentMethod, MobileMoneyProvider


class PaymentBase(BaseModel):
    amount: Decimal
    currency: str = "GHS"
    payment_method: PaymentMethod
    description: Optional[str] = None
    customer_email: EmailStr
    customer_name: str
    mobile_money_provider: Optional[MobileMoneyProvider] = None
    mobile_money_number: Optional[str] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    paystack_reference: Optional[str] = None
    paystack_transaction_id: Optional[str] = None
    processed_at: Optional[datetime] = None


class PaymentResponse(PaymentBase):
    id: int
    reference: str
    user_id: int
    status: PaymentStatus
    paystack_reference: Optional[str] = None
    paystack_transaction_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymentInitialize(BaseModel):
    amount: Decimal
    email: EmailStr
    payment_method: PaymentMethod
    callback_url: Optional[str] = None
    collection_id: Optional[int] = None


class MobileMoneyPayment(BaseModel):
    amount: Decimal
    phone: str
    provider: MobileMoneyProvider
    email: EmailStr
    name: str


class PaymentVerification(BaseModel):
    reference: str


class PaystackWebhook(BaseModel):
    event: str
    data: dict


class PaymentStats(BaseModel):
    total_payments: int
    successful_payments: int
    failed_payments: int
    total_revenue: Decimal
    success_rate: float