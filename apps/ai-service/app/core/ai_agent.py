"""AI Agent using PydanticAI for transaction parsing"""
import logging
import os
from typing import Optional
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.models.openai import OpenAIModel

from app.config import settings
from app.models.schemas import UserContextData, ParsedTransaction

logger = logging.getLogger(__name__)


class TransactionParseResult(BaseModel):
    """Structured output from AI"""
    type: str = Field(..., description="Transaction type: INCOME, EXPENSE, or TRANSFER")
    amount: float = Field(..., description="Amount in VND (convert K=1000, tr/triệu=1000000)")
    description: str = Field(..., description="Brief description of transaction")
    wallet_name: Optional[str] = Field(None, description="Wallet name if mentioned")
    category_name: Optional[str] = Field(None, description="Category name inferred from description")
    note: Optional[str] = Field(None, description="Additional notes")
    confidence: float = Field(default=0.8, description="Confidence score 0-1")

SYSTEM_PROMPT = """Bạn là AI chuyên phân tích giao dịch tài chính tiếng Việt.

NHIỆM VỤ: Parse văn bản tự nhiên thành giao dịch có cấu trúc.

QUY TẮC:
1. **Loại giao dịch (type)**:
   - "EXPENSE" (chi tiêu): đổ xăng, mua sắm, ăn uống, trả tiền, chi, tiêu...
   - "INCOME" (thu nhập): nhận lương, thu, được tặng, kiếm được...
   - "TRANSFER" (chuyển khoản): chuyển tiền, rút tiền...

2. **Số tiền (amount)**:
   - Chuyển đổi: "K" = 1,000 | "tr/triệu" = 1,000,000
   - Ví dụ: "19K" → 19000 | "1tr5" → 1500000 | "2.5 triệu" → 2500000
   - QUAN TRỌNG: Luôn trả về số VND đầy đủ (không có K, tr)

3. **Mô tả (description)**:
   - Ngắn gọn, rõ ràng, không dấu câu thừa
   - Ví dụ: "đổ xăng", "mua cơm trưa", "nhận lương tháng 1"

4. **Ví (wallet_name)**:
   - Tìm trong user_data.wallets
   - Match tên gần đúng: "ví hàng ngày", "ví tiền mặt", "ví ngân hàng"...
   - Trả về CHÍNH XÁC tên trong danh sách hoặc null

5. **Danh mục (category_name)**:
   - Tìm trong user_data.categories
   - Suy luận từ mô tả: "đổ xăng" → "Xăng xe", "ăn trưa" → "Ăn uống"...
   - Match type phù hợp (EXPENSE category cho chi tiêu)
   - Trả về tên trong danh sách hoặc tên mới hợp lý

VÍ DỤ:
Input: "Đổ xăng hết 19K, ghi vào ví Hàng ngày"
Output:
{
  "type": "EXPENSE",
  "amount": 19000,
  "description": "đổ xăng",
  "wallet_name": "Ví hàng ngày",
  "category_name": "Xăng xe",
  "note": null,
  "confidence": 0.95
}

Input: "Thu lương 15tr"
Output:
{
  "type": "INCOME",
  "amount": 15000000,
  "description": "thu lương",
  "wallet_name": null,
  "category_name": "Lương",
  "note": null,
  "confidence": 0.85
}

Hãy phân tích chính xác và trả về JSON theo format TransactionParseResult.
"""


class TransactionParserAgent:
    """AI Agent to parse natural language into structured transactions"""
    
    def __init__(self):
        self.model = self._initialize_model()
        self.agent = self._create_agent()
        logger.info(f"TransactionParserAgent initialized with {settings.AI_MODEL_PROVIDER}/{settings.AI_MODEL_NAME}")
    
    def _initialize_model(self):
        if settings.AI_MODEL_PROVIDER == "gemini":
            if not settings.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY is required when using Gemini provider")
            
            if not os.environ.get("GEMINI_API_KEY"):
                os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
            
            return GeminiModel(settings.AI_MODEL_NAME)
            
        elif settings.AI_MODEL_PROVIDER == "openrouter":
            if not settings.OPENROUTER_API_KEY:
                raise ValueError("OPENROUTER_API_KEY is required when using OpenRouter provider")
            
            if not os.environ.get("OPENAI_API_KEY"):
                os.environ["OPENAI_API_KEY"] = settings.OPENROUTER_API_KEY
            
            return OpenAIModel(
                settings.AI_MODEL_NAME,
                base_url="https://openrouter.ai/api/v1"
            )
        else:
            raise ValueError(f"Unsupported AI provider: {settings.AI_MODEL_PROVIDER}")
    
    def _create_agent(self) -> Agent:
        return Agent(
            model=self.model,
            result_type=TransactionParseResult,
            system_prompt=SYSTEM_PROMPT
        )
    
    def _build_user_prompt(self, text: str, user_data: Optional[UserContextData]) -> str:
        prompt = f"Văn bản cần parse: \"{text}\"\n\n"
        
        if user_data:
            # Add wallets context
            if user_data.wallets:
                prompt += "CÁC VÍ CÓ SẴN:\n"
                for wallet in user_data.wallets:
                    prompt += f"- {wallet.name} ({wallet.type}, số dư: {wallet.balance:,.0f} VND)\n"
                prompt += "\n"
            
            # Add categories context
            if user_data.categories:
                prompt += "CÁC DANH MỤC CÓ SẴN:\n"
                income_cats = [c for c in user_data.categories if c.type == "INCOME"]
                expense_cats = [c for c in user_data.categories if c.type == "EXPENSE"]
                
                if income_cats:
                    prompt += "Thu nhập: " + ", ".join([c.name for c in income_cats]) + "\n"
                if expense_cats:
                    prompt += "Chi tiêu: " + ", ".join([c.name for c in expense_cats]) + "\n"
                prompt += "\n"
        
        prompt += "Hãy phân tích và trả về kết quả theo format đã định."
        return prompt
    
    async def parse_transaction(
        self, 
        text: str, 
        user_data: Optional[UserContextData] = None
    ) -> ParsedTransaction:
        try:
            user_prompt = self._build_user_prompt(text, user_data)
            logger.info(f"Parsing transaction: {text}")
            logger.debug(f"Full prompt: {user_prompt}")
            
            result = await self.agent.run(user_prompt)
            logger.info(f"Parse result: {result.data}")
            
            return ParsedTransaction(
                type=result.data.type,
                amount=result.data.amount,
                description=result.data.description,
                wallet_name=result.data.wallet_name,
                category_name=result.data.category_name,
                note=result.data.note,
                confidence=result.data.confidence
            )
            
        except Exception as e:
            logger.error(f"Failed to parse transaction: {str(e)}", exc_info=True)
            raise Exception(f"AI parsing failed: {str(e)}")


_agent_instance: Optional[TransactionParserAgent] = None


def get_ai_agent() -> TransactionParserAgent:
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = TransactionParserAgent()
    return _agent_instance
