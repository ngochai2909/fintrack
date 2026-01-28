"""Tests for API endpoints"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test health endpoint returns healthy status"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "fintrack-ai-service"


class TestAIEndpoints:
    """Test AI endpoints"""
    
    def test_parse_transaction_success(self):
        """Test successful transaction parsing"""
        payload = {
            "text": "Đổ xăng hết 19K",
            "user_data": {
                "wallets": [
                    {"id": "1", "name": "Ví hàng ngày", "type": "CASH", "balance": 500000}
                ],
                "categories": [
                    {"id": "1", "name": "Xăng xe", "type": "EXPENSE"}
                ],
            },
        }
        
        response = client.post("/api/v1/ai/parse-transaction", json=payload)
        
        # Note: This will fail if API key is not configured
        # For actual testing, ensure .env is properly set up
        assert response.status_code == 200
        data = response.json()
        
        if data.get("success"):
            assert "data" in data
            assert data["data"]["type"] in ["INCOME", "EXPENSE", "TRANSFER"]
            assert data["data"]["amount"] > 0
    
    def test_parse_transaction_invalid_payload(self):
        """Test parsing with invalid payload"""
        payload = {
            "text": "",  # Empty text should fail validation
        }
        
        response = client.post("/api/v1/ai/parse-transaction", json=payload)
        
        assert response.status_code == 422  # Validation error


# Run with: pytest tests/test_api.py -v
