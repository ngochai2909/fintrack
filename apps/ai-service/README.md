# FinTrack AI Service

FastAPI service sử dụng PydanticAI để parse văn bản tự nhiên thành giao dịch tài chính có cấu trúc.

## 🚀 Cài đặt

```bash
# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt
```

## ⚙️ Cấu hình

1. Copy `.env.example` thành `.env`
2. Thêm API key của bạn (Gemini hoặc OpenRouter)

```bash
cp .env.example .env
# Sau đó chỉnh sửa .env
```

## 🏃 Chạy Service

```bash
# Development mode với auto-reload
uvicorn app.main:app --reload --port 8001

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Parse Transaction
```
POST /api/v1/ai/parse-transaction
Content-Type: application/json

{
  "text": "Đổ xăng hết 19K, ghi vào ví Hàng ngày",
  "user_data": {
    "wallets": [...],
    "categories": [...]
  }
}
```

Response:
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

## 🧪 Testing

```bash
pytest
```

## 📦 Cấu trúc thư mục

```
ai-service/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Configuration
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/   # API routes
│   ├── core/
│   │   └── ai_agent.py      # PydanticAI logic
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   └── utils/
│       └── logger.py        # Logging
├── requirements.txt
├── .env.example
└── README.md
```
