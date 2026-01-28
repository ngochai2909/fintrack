#!/bin/bash
# FinTrack AI Service - Demo Commands
# Copy-paste các lệnh này để test AI Agent

echo "========================================"
echo "🤖 FinTrack AI Agent - Demo Commands"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Prerequisites:${NC}"
echo "1. FastAPI running on port 8001"
echo "2. NestJS running on port 3001"
echo ""
echo "Press Enter to continue..."
read

echo ""
echo "========================================"
echo -e "${BLUE}Test 1: Health Check${NC}"
echo "========================================"
echo ""
curl -X GET http://localhost:8001/health
echo ""
echo ""

echo "========================================"
echo -e "${BLUE}Test 2: Parse Basic Expense${NC}"
echo "========================================"
echo ""
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Đổ xăng hết 19K"
  }' | jq '.'
echo ""
echo ""

echo "========================================"
echo -e "${BLUE}Test 3: Parse with Wallet${NC}"
echo "========================================"
echo ""
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mua cafe 45K, ghi vào ví tiền mặt",
    "user_data": {
      "wallets": [
        {"id": "1", "name": "Ví tiền mặt", "type": "CASH", "balance": 500000}
      ],
      "categories": [
        {"id": "1", "name": "Ăn uống", "type": "EXPENSE"}
      ]
    }
  }' | jq '.'
echo ""
echo ""

echo "========================================"
echo -e "${BLUE}Test 4: Parse Income${NC}"
echo "========================================"
echo ""
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Nhận lương tháng 1 là 15 triệu"
  }' | jq '.'
echo ""
echo ""

echo "========================================"
echo -e "${BLUE}Test 5: Parse Large Amount${NC}"
echo "========================================"
echo ""
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mua laptop 20tr5"
  }' | jq '.'
echo ""
echo ""

echo "========================================"
echo -e "${BLUE}Test 6: Various Vietnamese Inputs${NC}"
echo "========================================"
echo ""

echo -e "${YELLOW}Test 6.1: Đi taxi${NC}"
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{"text": "Đi taxi về nhà 80 ngàn"}' | jq '.data'
echo ""

echo -e "${YELLOW}Test 6.2: Ăn trưa${NC}"
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{"text": "Ăn trưa hết 150K"}' | jq '.data'
echo ""

echo -e "${YELLOW}Test 6.3: Mua sắm${NC}"
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{"text": "Mua sắm đồ ăn 250K"}' | jq '.data'
echo ""

echo -e "${YELLOW}Test 6.4: Thu nhập phụ${NC}"
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{"text": "Thu về 500K từ việc phụ"}' | jq '.data'
echo ""

echo ""
echo "========================================"
echo -e "${GREEN}✅ All tests completed!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Check logs in FastAPI terminal"
echo "2. Test with NestJS endpoints (need JWT)"
echo "3. Try more Vietnamese sentences"
echo ""
echo "For NestJS integration:"
echo "  1. Login: curl -X POST http://localhost:3001/auth/login ..."
echo "  2. Use token: curl -X POST http://localhost:3001/ai/transactions -H 'Authorization: Bearer TOKEN' ..."
echo ""
