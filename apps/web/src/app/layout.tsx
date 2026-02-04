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
            />
          </CopilotKit>
        </QueryProvider>
      </body>
    </html>
  );
}
