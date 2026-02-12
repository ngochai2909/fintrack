'use client';

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { CopilotActionsProvider } from "@/components/CopilotActionsProvider";
import { QuotaHandlerWrapper } from "@/components/quota-handler-wrapper";
import { Sidebar } from "@/components/Sidebar";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotActionsProvider>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </CopilotActionsProvider>
      <CopilotPopup
        labels={{
          title: "FinTrack AI",
          initial: "Xin chào! Tôi có thể giúp gì cho bạn?",
        }}
        instructions="Bạn là trợ lý tài chính thông minh của FinTrack."
      />
      <QuotaHandlerWrapper />
    </CopilotKit>
  );
}
