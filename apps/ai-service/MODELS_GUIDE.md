# 🤖 Hướng dẫn chọn AI Model

## Câu hỏi thường gặp

### ❓ Làm sao biết mình đang dùng model gì?

**Trả lời:** API key của Google AI Studio **KHÔNG gắn** với model cụ thể!

- 1 API key → Dùng được cho **TẤT CẢ models** của Gemini
- Bạn **chọn model trong file `.env`**, không phải khi tạo key
- Có thể đổi model bất cứ lúc nào bằng cách sửa `.env`

---

## 📋 Danh sách Gemini Models

### Google AI Studio (Miễn phí)

| Model Name | Tốc độ | Chất lượng | Giới hạn | Khuyến nghị |
|------------|--------|------------|----------|-------------|
| `gemini-1.5-flash` | ⚡⚡⚡ Rất nhanh | ⭐⭐⭐⭐ Tốt | 15 req/min | ✅ **Dùng cái này!** |
| `gemini-1.5-flash-8b` | ⚡⚡⚡⚡ Cực nhanh | ⭐⭐⭐ Khá | 15 req/min | Dùng nếu muốn nhanh hơn |
| `gemini-1.5-pro` | ⚡⚡ Chậm hơn | ⭐⭐⭐⭐⭐ Xuất sắc | 2 req/min | Dùng cho task phức tạp |
| `gemini-pro` | ⚡⚡ Trung bình | ⭐⭐⭐⭐ Tốt | 15 req/min | Legacy, không khuyến nghị |

**Xem thêm:** https://ai.google.dev/gemini-api/docs/models/gemini

---

## ⚙️ Cách cấu hình

### File: `apps/ai-service/.env`

```env
# API Key (lấy từ Google AI Studio)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Provider
AI_MODEL_PROVIDER=gemini

# Chọn model (uncomment 1 dòng)
AI_MODEL_NAME=gemini-1.5-flash        # ✅ Khuyến nghị cho FinTrack
# AI_MODEL_NAME=gemini-1.5-flash-8b   # Nếu muốn nhanh hơn
# AI_MODEL_NAME=gemini-1.5-pro        # Nếu cần chất lượng cao hơn
# AI_MODEL_NAME=gemini-pro            # Legacy model
```

---

## 🎯 Khuyến nghị cho FinTrack

### Dùng `gemini-1.5-flash` vì:

✅ **Nhanh** - Response time < 1s  
✅ **Chất lượng tốt** - Đủ để parse tiếng Việt  
✅ **Free limit cao** - 15 requests/phút  
✅ **Hiểu tiếng Việt** - Được train với Vietnamese data  
✅ **Cost-effective** - Miễn phí với quota hợp lý  

---

## 🔄 Thay đổi Model

### Cách 1: Sửa file `.env`

```bash
cd apps/ai-service
nano .env  # hoặc dùng editor khác

# Đổi dòng:
AI_MODEL_NAME=gemini-1.5-flash
# thành:
AI_MODEL_NAME=gemini-1.5-pro

# Save và restart service
```

### Cách 2: Environment variable

```bash
export AI_MODEL_NAME=gemini-1.5-pro
uvicorn app.main:app --reload --port 8001
```

---

## 🧪 Test với models khác nhau

### Test gemini-1.5-flash (default)

```bash
curl -X POST http://localhost:8001/api/v1/ai/parse-transaction \
  -H "Content-Type: application/json" \
  -d '{"text": "Đổ xăng hết 19K"}'
```

### Đổi sang gemini-1.5-pro

1. Sửa `.env`: `AI_MODEL_NAME=gemini-1.5-pro`
2. Restart service
3. Chạy lại curl command trên
4. So sánh kết quả!

---

## 📊 So sánh Models (với tiếng Việt)

### Test case: "Mua cafe sữa 45K ghi vào ví tiền mặt"

**gemini-1.5-flash:**
```json
{
  "type": "EXPENSE",
  "amount": 45000,
  "description": "mua cafe sữa",
  "wallet_name": "ví tiền mặt",
  "category_name": "Ăn uống",
  "confidence": 0.95
}
```
⏱️ Response time: ~800ms

**gemini-1.5-pro:**
```json
{
  "type": "EXPENSE",
  "amount": 45000,
  "description": "mua cafe sữa",
  "wallet_name": "ví tiền mặt",
  "category_name": "Đồ uống",
  "confidence": 0.98,
  "note": "Cafe với sữa"
}
```
⏱️ Response time: ~1500ms

**Kết luận:** Flash đủ tốt cho use case của chúng ta!

---

## ⚠️ Rate Limits (Free Tier)

| Model | Requests/Minute | Requests/Day |
|-------|-----------------|--------------|
| gemini-1.5-flash | 15 | 1,500 |
| gemini-1.5-flash-8b | 15 | 1,500 |
| gemini-1.5-pro | 2 | 50 |
| gemini-pro | 15 | 1,500 |

**Lưu ý:** Nếu vượt limit, API sẽ trả về error 429 (Too Many Requests)

---

## 🌐 OpenRouter Models (Alternative)

Nếu không muốn dùng Google AI Studio, dùng OpenRouter:

```env
OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXX
AI_MODEL_PROVIDER=openrouter

# Free models
AI_MODEL_NAME=google/gemini-flash-1.5        # Gemini qua OpenRouter
AI_MODEL_NAME=meta-llama/llama-3.1-8b-instruct:free
AI_MODEL_NAME=mistralai/mistral-7b-instruct:free
```

**Xem models:** https://openrouter.ai/models?max_price=0

---

## 🔍 Debug Model Selection

### Check model đang dùng

Khi start service, xem logs:

```
========================================
🚀 FinTrack AI Service Starting...
Environment: development
AI Provider: gemini
AI Model: gemini-1.5-flash        ← Check dòng này!
Port: 8001
========================================
```

### Test API info

```bash
curl http://localhost:8001/health
```

Response sẽ có thông tin về service đang chạy.

---

## 💡 Tips

1. **Bắt đầu với `gemini-1.5-flash`** - Đủ tốt cho hầu hết cases
2. **Upgrade lên `pro`** nếu cần chất lượng cao hơn
3. **Monitor logs** để xem AI parse thế nào
4. **Test nhiều câu** để đánh giá model
5. **Respect rate limits** - Đừng spam requests

---

## 🆘 Troubleshooting

### Lỗi: "Model not found"

**Nguyên nhân:** Tên model sai hoặc không tồn tại

**Fix:** Check spelling, xem list models ở trên

### Lỗi: 429 Too Many Requests

**Nguyên nhân:** Vượt rate limit

**Fix:** 
- Đợi 1 phút
- Hoặc đổi sang model khác có limit cao hơn

### AI parse sai

**Nguyên nhân:** Model không hiểu context

**Fix:**
1. Thử model mạnh hơn (pro)
2. Cải thiện system prompt trong `ai_agent.py`
3. Cung cấp thêm user context (wallets, categories)

---

## 📚 Resources

- **Gemini Models Doc:** https://ai.google.dev/gemini-api/docs/models/gemini
- **Google AI Studio:** https://aistudio.google.com/
- **OpenRouter:** https://openrouter.ai/
- **PydanticAI Doc:** https://ai.pydantic.dev/

---

**Tóm lại:** API key không biết model nào, bạn chọn model trong `.env`! ✨
