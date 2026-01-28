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
)
async def parse_transaction(request: ParseTransactionRequest) -> ParseTransactionResponse:
    try:
        logger.info(f"Received parse request: {request.text}")
        
        agent = get_ai_agent()
        parsed_data = await agent.parse_transaction(
            text=request.text,
            user_data=request.user_data
        )
        
        logger.info(f"Successfully parsed: {parsed_data.description}")
        
        return ParseTransactionResponse(
            success=True,
            data=parsed_data,
            message="Transaction parsed successfully"
        )
        
    except Exception as e:
        logger.error(f"Error parsing transaction: {str(e)}", exc_info=True)
        return ParseTransactionResponse(
            success=False,
            error=str(e),
            message="Failed to parse transaction"
        )


@router.get("/test", summary="Test AI endpoint")
async def test_ai():
    return {
        "status": "ok",
        "message": "AI service is running",
        "endpoint": "/api/v1/ai/parse-transaction"
    }
