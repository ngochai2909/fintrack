"""Pydantic schemas for request/response validation"""
from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime


# ============================================
# Request Schemas
# ============================================

class WalletInfo(BaseModel):
    """Wallet information for context"""
    id: str
    name: str
    type: str
    balance: float


class CategoryInfo(BaseModel):
    """Category information for context"""
    id: str
    name: str
    type: Literal["INCOME", "EXPENSE", "TRANSFER"]


class UserContextData(BaseModel):
    """User context data to help AI understand available options"""
    wallets: list[WalletInfo] = Field(default_factory=list)
    categories: list[CategoryInfo] = Field(default_factory=list)


class ParseTransactionRequest(BaseModel):
    """Request to parse natural language transaction"""
    text: str = Field(..., description="Natural language text describing the transaction", min_length=1)
    user_data: Optional[UserContextData] = Field(default=None, description="User's wallets and categories for context")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "text": "Đổ xăng hết 19K, ghi vào ví Hàng ngày",
                    "user_data": {
                        "wallets": [
                            {"id": "1", "name": "Ví hàng ngày", "type": "CASH", "balance": 500000},
                            {"id": "2", "name": "Ví tiết kiệm", "type": "BANK", "balance": 10000000}
                        ],
                        "categories": [
                            {"id": "1", "name": "Xăng xe", "type": "EXPENSE"},
                            {"id": "2", "name": "Ăn uống", "type": "EXPENSE"},
                            {"id": "3", "name": "Lương", "type": "INCOME"}
                        ]
                    }
                }
            ]
        }
    }


# ============================================
# Response Schemas
# ============================================

class ParsedTransaction(BaseModel):
    """Structured transaction data extracted from natural language"""
    type: Literal["INCOME", "EXPENSE", "TRANSFER"] = Field(..., description="Transaction type")
    amount: float = Field(..., description="Transaction amount in VND", gt=0)
    description: str = Field(..., description="Transaction description")
    wallet_name: Optional[str] = Field(None, description="Wallet name mentioned in text")
    category_name: Optional[str] = Field(None, description="Category name inferred from description")
    note: Optional[str] = Field(None, description="Additional notes")
    confidence: float = Field(default=1.0, description="AI confidence score (0-1)", ge=0, le=1)
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "type": "EXPENSE",
                    "amount": 19000,
                    "description": "đổ xăng",
                    "wallet_name": "Ví hàng ngày",
                    "category_name": "Xăng xe",
                    "note": None,
                    "confidence": 0.95
                }
            ]
        }
    }


class ParseTransactionResponse(BaseModel):
    """Response for parse transaction endpoint"""
    success: bool
    data: Optional[ParsedTransaction] = None
    error: Optional[str] = None
    message: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: Literal["healthy", "unhealthy"]
    timestamp: datetime
    service: str = "fintrack-ai-service"
    version: str = "1.0.0"
