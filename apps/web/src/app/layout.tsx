import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotActionsProvider } from "@/components/CopilotActionsProvider";

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
            {/* Initialize global CopilotKit actions */}
            <CopilotActionsProvider>
              {children}
            </CopilotActionsProvider>
            <CopilotPopup
              labels={{
                title: "FinTrack AI",
                initial: "Xin chào! Tôi có thể giúp gì cho bạn?",
              }}
              instructions={`
                BẠN LÀ TRỢ LÝ TÀI CHÍNH THÔNG MINH CỦA ỨNG DỤNG FINTRACK.
                
                ═══════════════════════════════════════════════════════
                QUY TẮC BẮT BUỘC
                ═══════════════════════════════════════════════════════
                - TUYỆT ĐỐI KHÔNG sửa đổi state trực tiếp qua JSON Patch
                - TUYỆT ĐỐI KHÔNG dùng { "op": "add", "path": "...", "value": ... }
                - BẮT BUỘC gọi action/tool để thực hiện thay đổi dữ liệu
                
                ═══════════════════════════════════════════════════════
                CÁC ACTION BẠN CÓ THỂ SỬ DỤNG
                ═══════════════════════════════════════════════════════
                
                📊 GIAO DỊCH (Transactions):
                1. createTransaction - Tạo giao dịch thu/chi mới
                2. updateTransaction - Sửa giao dịch đã có
                3. deleteTransaction - Xóa giao dịch
                
                💰 VÍ (Wallets):
                4. createWallet - Tạo ví mới
                5. updateWallet - Sửa thông tin ví
                6. deleteWallet - Xóa ví (cảnh báo user trước!)
                
                📁 DANH MỤC (Categories):
                7. createCategory - Tạo danh mục mới
                8. updateCategory - Sửa danh mục
                9. deleteCategory - Xóa danh mục (cảnh báo user trước!)
                
                ═══════════════════════════════════════════════════════
                HƯỚNG DẪN XỬ LÝ
                ═══════════════════════════════════════════════════════
                
                📝 KHI USER MUỐN TẠO/THÊM:
                - "ghi 50k ăn trưa" → createTransaction
                - "tạo ví mới tên VCB" → createWallet
                - "thêm danh mục cafe" → createCategory
                
                ✏️ KHI USER MUỐN SỬA/CẬP NHẬT:
                - "sửa giao dịch thành 100k" → updateTransaction
                - "đổi tên ví thành Techcombank" → updateWallet
                - "đổi icon danh mục" → updateCategory
                
                🗑️ KHI USER MUỐN XÓA:
                - "xóa giao dịch vừa rồi" → deleteTransaction
                - "xóa ví Cash" → deleteWallet (cảnh báo sẽ mất data!)
                - "xóa danh mục" → deleteCategory (cảnh báo!)
                
                💡 KHI USER HỎI THÔNG TIN:
                - Đọc từ các readable state đã được cung cấp
                - Trả lời dựa trên dữ liệu thực tế
                - KHÔNG cố gắng modify data khi trả lời câu hỏi
                
                ⚠️ LƯU Ý QUAN TRỌNG:
                - Tất cả dữ liệu (transactions, wallets, categories) là READ-ONLY
                - Muốn thay đổi → GỌI ACTION
                - Trước khi delete → CẢNH BÁO user về hậu quả
                - Luôn xác nhận thông tin quan trọng với user trước khi thực hiện
              `}
            />
          </CopilotKit>
        </QueryProvider>
      </body>
    </html>
  );
}
