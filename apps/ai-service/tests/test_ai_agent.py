"""Tests for AI Agent"""
import pytest
from app.models.schemas import UserContextData, WalletInfo, CategoryInfo
from app.core.ai_agent import TransactionParserAgent


class TestTransactionParserAgent:
    """Test cases for TransactionParserAgent"""
    
    @pytest.fixture
    def agent(self):
        """Create agent instance"""
        return TransactionParserAgent()
    
    @pytest.fixture
    def sample_user_data(self):
        """Sample user context data"""
        return UserContextData(
            wallets=[
                WalletInfo(id="1", name="Ví hàng ngày", type="CASH", balance=500000),
                WalletInfo(id="2", name="Ví tiết kiệm", type="BANK", balance=10000000),
            ],
            categories=[
                CategoryInfo(id="1", name="Xăng xe", type="EXPENSE"),
                CategoryInfo(id="2", name="Ăn uống", type="EXPENSE"),
                CategoryInfo(id="3", name="Lương", type="INCOME"),
            ],
        )
    
    @pytest.mark.asyncio
    async def test_parse_basic_expense(self, agent, sample_user_data):
        """Test parsing basic expense transaction"""
        text = "Đổ xăng hết 19K"
        
        result = await agent.parse_transaction(text, sample_user_data)
        
        assert result.type == "EXPENSE"
        assert result.amount == 19000
        assert "xăng" in result.description.lower()
        assert result.confidence > 0.5
    
    @pytest.mark.asyncio
    async def test_parse_with_wallet(self, agent, sample_user_data):
        """Test parsing transaction with wallet mention"""
        text = "Đổ xăng hết 19K, ghi vào ví Hàng ngày"
        
        result = await agent.parse_transaction(text, sample_user_data)
        
        assert result.type == "EXPENSE"
        assert result.amount == 19000
        assert result.wallet_name is not None
        assert "hàng ngày" in result.wallet_name.lower()
    
    @pytest.mark.asyncio
    async def test_parse_income(self, agent, sample_user_data):
        """Test parsing income transaction"""
        text = "Nhận lương 15 triệu"
        
        result = await agent.parse_transaction(text, sample_user_data)
        
        assert result.type == "INCOME"
        assert result.amount == 15000000
        assert "lương" in result.description.lower()
    
    @pytest.mark.asyncio
    async def test_parse_large_amount(self, agent, sample_user_data):
        """Test parsing transaction with large amount"""
        text = "Mua laptop 20tr5"
        
        result = await agent.parse_transaction(text, sample_user_data)
        
        assert result.type == "EXPENSE"
        assert result.amount == 20500000
        assert "laptop" in result.description.lower()
    
    @pytest.mark.asyncio
    async def test_parse_without_context(self, agent):
        """Test parsing without user context"""
        text = "Mua cơm trưa 50K"
        
        result = await agent.parse_transaction(text, None)
        
        assert result.type == "EXPENSE"
        assert result.amount == 50000
        assert result.confidence > 0


# Note: These tests require valid API keys in .env
# Run with: pytest tests/test_ai_agent.py -v
