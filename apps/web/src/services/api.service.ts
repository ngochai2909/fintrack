// ════════════════════════════════════════════════════════════
// BASE API SERVICE - Reusable fetch helper
// ════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables')
}

/**
 * Generic API request helper
 * @param endpoint - API endpoint (e.g., '/auth/login')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  })

  const data = await response.json()

  // Kiểm tra HTTP status
  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    )
  }

  return data
}

// Export API_URL nếu cần dùng ở chỗ khác
export { API_URL }
