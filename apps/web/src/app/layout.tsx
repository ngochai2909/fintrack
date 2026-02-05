import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinTrack - Quản lý tài chính cá nhân",
  description: "Ứng dụng quản lý thu chi cá nhân",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <CopilotKit runtimeUrl="/api/copilotkit">
            {children}
            <CopilotPopup
              labels={{
                title: "FinTrack AI",
                initial: "Xin chào! Tôi có thể giúp gì cho bạn?",
              }}
              instructions={`
                BẠN LÀ TRỢ LÝ TÀI CHÍNH CỦA ỨNG DỤNG FINTRACK.
                
                QUY TẮC BẮT BUỘC:
                - TUYỆT ĐỐI KHÔNG được sửa đổi state trực tiếp qua JSON Patch operations
                - TUYỆT ĐỐI KHÔNG được dùng { "op": "add", "path": "...", "value": ... }
                - BẮT BUỘC phải gọi action/tool createTransaction để tạo giao dịch
                
                CÁCH XỬ LÝ YÊU CẦU:
                - Khi user muốn "ghi", "tạo", "thêm", "nhập" giao dịch → GỌI createTransaction
                - Đọc thông tin từ các readable state (transactions, wallets, categories)
                - Trả lời câu hỏi dựa trên dữ liệu đã đọc
                
                CHÚ Ý: Dữ liệu transactions, wallets, categories là READ-ONLY.
              `}
            />
          </CopilotKit>
        </QueryProvider>
      </body>
    </html>
  );
}
