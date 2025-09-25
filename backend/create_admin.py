"""
Create admin user for AgaPay
"""
import asyncio
from sqlalchemy.orm import Session
from database_simple import SessionLocal
from models.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_email = "admin@agapay.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()

        if existing_admin:
            print(f"Admin user {admin_email} already exists!")
            return

        # Create admin user
        admin_user = User(
            email=admin_email,
            phone="+233200000000",
            full_name="AgaPay Administrator",
            hashed_password=get_password_hash("admin123"),
            is_active=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("Admin user created successfully!")
        print(f"Email: {admin_email}")
        print(f"Password: admin123")
        print(f"Name: {admin_user.full_name}")
        print(f"Phone: {admin_user.phone}")

    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()