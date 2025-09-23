from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
import uuid
import secrets
import httpx
from datetime import datetime

from database_simple import get_db
from models.models import Payment, User, PaymentStatus, PaymentMethod, MobileMoneyProvider
from schemas.payment import (
    PaymentCreate, PaymentResponse, PaymentInitialize,
    MobileMoneyPayment, PaymentVerification, PaystackWebhook,
    PaymentStats
)
from services.paystack import PaystackService
from core.config import settings

router = APIRouter()


@router.post("/initialize", response_model=dict)
async def initialize_payment(
    payment_data: PaymentInitialize,
    db: Session = Depends(get_db)
):
    """Initialize a payment transaction"""

    # Generate unique reference
    reference = f"AGA_{secrets.token_hex(8).upper()}"

    # Create payment record
    payment = Payment(
        reference=reference,
        user_id=1,  # TODO: Get from auth token
        amount=payment_data.amount,
        currency="GHS",
        payment_method=payment_data.payment_method,
        customer_email=payment_data.email,
        customer_name="Customer",  # TODO: Get from user
        status=PaymentStatus.PENDING
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Initialize with Paystack
    paystack_service = PaystackService()

    if payment_data.payment_method == PaymentMethod.MOBILE_MONEY:
        # Handle mobile money payment
        paystack_response = await paystack_service.initialize_mobile_money(
            amount=int(payment_data.amount * 100),  # Convert to pesewas
            email=payment_data.email,
            phone="+233200000000",  # TODO: Get from request
            provider="mtn"  # TODO: Get from request
        )
    else:
        # Handle card payment
        paystack_response = await paystack_service.initialize_transaction(
            amount=int(payment_data.amount * 100),
            email=payment_data.email,
            reference=reference,
            callback_url=payment_data.callback_url or "http://localhost:3003/payment/callback"
        )

    if not paystack_response.get("status"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to initialize payment"
        )

    return {
        "status": "success",
        "message": "Payment initialized",
        "data": {
            "reference": reference,
            "authorization_url": paystack_response["data"]["authorization_url"],
            "access_code": paystack_response["data"]["access_code"]
        }
    }


@router.post("/mobile-money", response_model=dict)
async def process_mobile_money_payment(
    payment_data: MobileMoneyPayment,
    db: Session = Depends(get_db)
):
    """Process mobile money payment for Ghana"""

    # Generate unique reference
    reference = f"AGA_MOBILE_{secrets.token_hex(8).upper()}"

    # Create payment record
    payment = Payment(
        reference=reference,
        user_id=1,  # TODO: Get from auth token
        amount=payment_data.amount,
        currency="GHS",
        payment_method=PaymentMethod.MOBILE_MONEY,
        mobile_money_provider=payment_data.provider,
        mobile_money_number=payment_data.phone,
        customer_email=payment_data.email,
        customer_name=payment_data.name,
        status=PaymentStatus.PROCESSING
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Process with Paystack
    paystack_service = PaystackService()
    paystack_response = await paystack_service.submit_mobile_money(
        amount=int(payment_data.amount * 100),
        email=payment_data.email,
        phone=payment_data.phone,
        provider=payment_data.provider.value,
        reference=reference
    )

    if not paystack_response.get("status"):
        payment.status = PaymentStatus.FAILED
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to process mobile money payment"
        )

    return {
        "status": "success",
        "message": "Mobile money payment submitted",
        "data": {
            "reference": reference,
            "status": "processing"
        }
    }


@router.get("/verify/{reference}", response_model=dict)
async def verify_payment(
    reference: str,
    db: Session = Depends(get_db)
):
    """Verify payment status"""

    payment = db.query(Payment).filter(Payment.reference == reference).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    # Verify with Paystack
    paystack_service = PaystackService()
    verification_result = await paystack_service.verify_transaction(reference)

    if verification_result.get("status"):
        payment_data = verification_result["data"]
        payment.status = PaymentStatus.SUCCESS if payment_data["status"] == "success" else PaymentStatus.FAILED
        payment.paystack_transaction_id = str(payment_data["id"])
        payment.processed_at = datetime.utcnow()
        db.commit()

    return {
        "status": "success",
        "data": {
            "reference": payment.reference,
            "amount": float(payment.amount),
            "currency": payment.currency,
            "status": payment.status.value,
            "payment_method": payment.payment_method.value,
            "created_at": payment.created_at.isoformat(),
            "processed_at": payment.processed_at.isoformat() if payment.processed_at else None
        }
    }


@router.post("/webhook")
async def paystack_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Paystack webhook events"""

    # Get webhook signature from headers
    signature = request.headers.get("x-paystack-signature")
    if not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing signature"
        )

    # Get raw body
    body = await request.body()

    # Verify signature (implement this in production)
    # paystack_service = PaystackService()
    # if not paystack_service.verify_webhook_signature(body, signature):
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Invalid signature"
    #     )

    # Parse webhook data
    try:
        import json
        webhook_data = json.loads(body)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON"
        )

    event = webhook_data.get("event")
    data = webhook_data.get("data")

    if event == "charge.success":
        # Update payment status
        reference = data.get("reference")
        payment = db.query(Payment).filter(Payment.reference == reference).first()

        if payment:
            payment.status = PaymentStatus.SUCCESS
            payment.paystack_transaction_id = str(data.get("id"))
            payment.processed_at = datetime.utcnow()
            db.commit()

    elif event == "charge.failed":
        # Update payment status
        reference = data.get("reference")
        payment = db.query(Payment).filter(Payment.reference == reference).first()

        if payment:
            payment.status = PaymentStatus.FAILED
            payment.processed_at = datetime.utcnow()
            db.commit()

    return {"status": "success"}


@router.get("/stats", response_model=PaymentStats)
async def get_payment_stats(
    db: Session = Depends(get_db)
):
    """Get payment statistics"""

    total_payments = db.query(Payment).count()
    successful_payments = db.query(Payment).filter(Payment.status == PaymentStatus.SUCCESS).count()
    failed_payments = db.query(Payment).filter(Payment.status == PaymentStatus.FAILED).count()

    total_revenue = db.query(Payment).filter(
        Payment.status == PaymentStatus.SUCCESS
    ).with_entities(Payment.amount).all()

    total_revenue_amount = sum(amount[0] for amount in total_revenue) if total_revenue else 0
    success_rate = (successful_payments / total_payments * 100) if total_payments > 0 else 0

    return PaymentStats(
        total_payments=total_payments,
        successful_payments=successful_payments,
        failed_payments=failed_payments,
        total_revenue=total_revenue_amount,
        success_rate=success_rate
    )


@router.get("/", response_model=List[PaymentResponse])
async def get_payments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all payments"""

    payments = db.query(Payment).offset(skip).limit(limit).all()
    return payments


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific payment"""

    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    return payment