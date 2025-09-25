from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database_simple import get_db
from models.models import Collection, User
from schemas.collection import CollectionCreate, CollectionUpdate, CollectionResponse
from routers.auth import get_current_user

router = APIRouter(tags=["collections"])


@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify collections router is working"""
    return {"message": "Collections router is working"}


@router.get("/", response_model=List[CollectionResponse])
async def get_collections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all public collections"""
    collections = db.query(Collection).filter(
        Collection.is_public == True,
        Collection.status == "active"
    ).offset(skip).limit(limit).all()
    return collections


@router.get("/my-collections", response_model=List[CollectionResponse])
async def get_my_collections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get collections created by the current user"""
    collections = db.query(Collection).filter(
        Collection.created_by == current_user.id
    ).offset(skip).limit(limit).all()
    return collections


@router.get("/{collection_id}", response_model=CollectionResponse)
async def get_collection(
    collection_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific collection by ID"""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )
    return collection


@router.post("/", response_model=CollectionResponse)
async def create_collection(
    collection: CollectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new collection"""
    db_collection = Collection(
        **collection.dict(),
        created_by=current_user.id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection


@router.put("/{collection_id}", response_model=CollectionResponse)
async def update_collection(
    collection_id: int,
    collection_update: CollectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a collection"""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )

    # Check if user owns the collection
    if collection.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this collection"
        )

    # Update fields
    update_data = collection_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(collection, field, value)

    collection.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(collection)
    return collection


@router.delete("/{collection_id}")
async def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a collection"""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )

    # Check if user owns the collection
    if collection.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this collection"
        )

    db.delete(collection)
    db.commit()
    return {"message": "Collection deleted successfully"}


@router.post("/{collection_id}/amount")
async def update_collection_amount(
    collection_id: int,
    amount_data: dict,
    db: Session = Depends(get_db)
):
    """Update collection current amount (for payment integration)"""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found"
        )

    if "amount" not in amount_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount is required"
        )

    collection.current_amount += amount_data["amount"]
    collection.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(collection)

    return {
        "message": "Collection amount updated successfully",
        "collection_id": collection.id,
        "current_amount": collection.current_amount
    }