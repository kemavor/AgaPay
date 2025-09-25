from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import secrets

from database_simple import get_db
from models.models import Payment, Collection, PaymentStatus, PaymentMethod

router = APIRouter(prefix="/api/test", tags=["test"])


@router.post("/payment")
async def create_test_payment(
    collection_id: int = 1,
    amount: float = 100,
    email: str = "test@example.com",
    db: Session = Depends(get_db)
):
    """Create a test payment for testing collection tracking"""

    # Verify collection exists
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )

    # Create test payment
    reference = f"TEST_{secrets.token_hex(8).upper()}"
    payment = Payment(
        reference=reference,
        user_id=1,
        collection_id=collection_id,
        amount=amount,
        currency="GHS",
        payment_method=PaymentMethod.MOBILE_MONEY,
        customer_email=email,
        customer_name="Test User",
        status=PaymentStatus.SUCCESS,
        processed_at=datetime.utcnow()
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Update collection amount
    collection.current_amount += amount
    collection.updated_at = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "message": "Test payment created",
        "payment": {
            "reference": reference,
            "amount": float(amount),
            "collection_id": collection_id,
            "status": payment.status.value
        },
        "collection": {
            "id": collection.id,
            "title": collection.title,
            "current_amount": float(collection.current_amount),
            "target_amount": float(collection.target_amount) if collection.target_amount else None
        }
    }