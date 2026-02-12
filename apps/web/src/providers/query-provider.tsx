'use client'

// ════════════════════════════════════════════════════════════
// REACT QUERY PROVIDER
// ════════════════════════════════════════════════════════════
// Setup QueryClient cho toàn bộ app
// ════════════════════════════════════════════════════════════

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  // Tạo QueryClient instance
  // useState để tránh re-create mỗi lần render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data được coi là "fresh" trong 1 phút
            staleTime: 60 * 1000, // 1 minute

            // Không tự động refetch khi focus window
            // (Có thể bật sau nếu muốn)
            refetchOnWindowFocus: false,

            // Retry 1 lần nếu lỗi
            retry: 1,

            // Cache data trong 5 phút
            gcTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}
