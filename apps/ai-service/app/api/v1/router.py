"""API v1 router aggregator"""
from fastapi import APIRouter

from app.api.v1.endpoints import ai

# Create v1 router
api_v1_router = APIRouter(prefix="/v1")

# Include all endpoint routers
api_v1_router.include_router(
    ai.router,
    prefix="/ai",
    tags=["AI - Transaction Parsing"]
)
