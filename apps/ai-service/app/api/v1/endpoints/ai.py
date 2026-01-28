"""AI endpoints for transaction parsing"""
import logging
from fastapi import APIRouter, HTTPException, status

from app.models.schemas import (
    ParseTransactionRequest,
    ParseTransactionResponse,
)
from app.core.ai_agent import get_ai_agent

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/parse-transaction",
    response_model=ParseTransactionResponse,
    status_code=status.HTTP_200_OK,
    summary="Parse natural language to transaction",
    description="Convert natural language text into structured transaction data using AI",
)
async def parse_transaction(request: ParseTransactionRequest) -> ParseTransactionResponse:
    """
    Parse natural language transaction text into structured data.
    
    **Example Request:**
    ```json
    {
      "text": "Đổ xăng hết 19K, ghi vào ví Hàng ngày",
      "user_data": {
        "wallets": [...],
        "categories": [...]
      }
    }
    ```
    
    **Example Response:**
    ```json
    {
      "success": true,
      "data": {
        "type": "EXPENSE",
        "amount": 19000,
        "description": "đổ xăng",
        "wallet_name": "Ví hàng ngày",
        "category_name": "Xăng xe",
        "confidence": 0.95
      }
    }
    ```
    """
    try:
        logger.info(f"Received parse request: {request.text}")
        
        # Get AI agent
        agent = get_ai_agent()
        
        # Parse transaction
        parsed_data = await agent.parse_transaction(
            text=request.text,
            user_data=request.user_data
        )
        
        logger.info(f"Successfully parsed transaction: {parsed_data.description}")
        
        return ParseTransactionResponse(
            success=True,
            data=parsed_data,
            message="Transaction parsed successfully"
        )
        
    except Exception as e:
        logger.error(f"Error parsing transaction: {str(e)}", exc_info=True)
        
        # Return error response
        return ParseTransactionResponse(
            success=False,
            error=str(e),
            message="Failed to parse transaction"
        )


@router.get(
    "/test",
    summary="Test AI endpoint",
    description="Simple test endpoint to check AI service is working"
)
async def test_ai():
    """Test endpoint for AI service"""
    return {
        "status": "ok",
        "message": "AI service is running",
        "endpoint": "/api/v1/ai/parse-transaction"
    }
