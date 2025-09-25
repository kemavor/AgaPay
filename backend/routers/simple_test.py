from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from database_simple import get_db
from models.models import Collection

router = APIRouter(prefix="/api/simple-test", tags=["simple-test"])


@router.post("/update-collection")
async def update_collection_amount(
    collection_id: int = 1,
    amount: float = 100,
    db: Session = Depends(get_db)
):
    """Simple test to update collection amount"""

    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )

    collection.current_amount += amount
    collection.updated_at = datetime.utcnow()
    db.commit()

    return {
        "success": True,
        "message": f"Collection {collection_id} updated by {amount}",
        "collection": {
            "id": collection.id,
            "title": collection.title,
            "current_amount": float(collection.current_amount),
            "target_amount": float(collection.target_amount) if collection.target_amount else None
        }
    }