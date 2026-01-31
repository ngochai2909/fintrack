A. Basic
# Feature 1: Basic nhập liệu

Input: "Đổ xăng hết 19K, ghi vào ví Hàng ngày"
-> API Nest JS 
    -> API FastAPI
        -> PydanticAI (Parse thông tin "text" + "prompt" + "data_user" -> structure input) => {"type": "chi", "value": 19000, "content": "đổ xăng", "wallet": "Ví hàng ngày"}
    -> Update vào DB
    -> Return API về FE

UI: https://github.com/CopilotKit/CopilotKit

BE AI:
https://github.com/ag-ui-protocol/ag-ui?tab=readme-ov-file
https://github.com/pydantic/pydantic-ai
https://www.crewai.com

Model:
- https://aistudio.google.com/
- https://openrouter.ai/models?max_price=0

# Deployment
Viết docker-compose.yml và HOW_TO_DEPLOY.md deploy tất cả các dịch vụ cần thiết:
 Postgresql
 NodeJS
 FastAPI
 NextJS

# Feature 2: Telegram nhập liệu
Mở telegram @bot-tai-chinh
Input: @tieu TEXT (đổ xăng 19k)
Output: Đã nhập liệu thành công

- /@thong-ke


B. Advanced
Nhập mục tiêu chi cho từng khoản theo Tháng

Nâng cấp Agent tài chính: Sau khi nhập chi/tiêu xong sẽ phản hồi về %, số tiền còn lại của mục tiêu
Đưa ra nhận xét về khoản thu/chi đã nhập. Đưa ra nhận xét, góp ý để chi tiêu thông minh (theo văn phong: Vui vẻ, Mắng, ...)