from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
from contextlib import asynccontextmanager

from database_simple import get_db, engine
from models import models
from routers import auth, payments, users, collections, test_payments, simple_test
from core.config import settings


# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="AgaPay API",
    description="Payment processing API for Ghana",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003", "http://localhost:3001", "http://localhost:3000", "http://localhost:3002"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https?://.*",  # Allow all origins in development
    expose_headers=["*"],
    max_age=600,
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])

# Debug: Try to include collections router
try:
    app.include_router(collections.router, prefix="/api/collections", tags=["Collections"])
    print("DEBUG: Collections router included successfully - updated")
except Exception as e:
    print(f"DEBUG: Error including collections router: {e}")
    import traceback
    traceback.print_exc()

app.include_router(test_payments.router, tags=["Test"])
app.include_router(simple_test.router, tags=["Simple-Test"])


@app.get("/")
async def root():
    return {"message": "AgaPay API is running", "version": "1.0.0"}

@app.get("/api/collections-direct-test")
async def collections_direct_test():
    return {"message": "Direct collections test working - updated"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AgaPay API"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )