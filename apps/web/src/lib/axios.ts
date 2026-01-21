'use client'

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// ════════════════════════════════════════════════════════════
// 📌 SECURITY NOTE - TODO for Phase 3
// ════════════════════════════════════════════════════════════
// Current: Using localStorage for JWT tokens (LEARNING PURPOSE)
// Future: Migrate to HttpOnly Cookie for production security
//
// Reasons to migrate:
//   ✅ localStorage vulnerable to XSS attacks
//   ✅ Cookie with HttpOnly flag prevents JavaScript access
//   ✅ More secure for production applications
//
// Will implement in Phase 3 with:
//   - HttpOnly cookies
//   - CSRF protection
//   - Secure & SameSite flags
// ════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined')
}

// ════════════════════════════════════════════════════════════
// Tạo axios instance
// ════════════════════════════════════════════════════════════
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ════════════════════════════════════════════════════════════
// Request interceptor - Tự động thêm token
// ════════════════════════════════════════════════════════════
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('📤', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ════════════════════════════════════════════════════════════
// Response interceptor - Auto refresh token & unwrap data
// ════════════════════════════════════════════════════════════
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅', response.status, response.config.url)
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    console.error('❌', error.response?.status, error.config?.url)

    // ────────────────────────────────────────────────────────
    // Case 1: 401 Unauthorized → Try to refresh token
    // ────────────────────────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu request bị lỗi là /auth/refresh → không retry nữa
      if (originalRequest.url === '/auth/refresh') {
        console.error('🔴 Refresh token hết hạn → Redirect to login')
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // Nếu đang refresh → queue request này lại
      if (isRefreshing) {
        console.log('⏳ Request đang chờ refresh token...')
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            console.log(
              '🔄 Retry request sau khi refresh:',
              originalRequest.url
            )
            return axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        console.error('🔴 Không có refresh token → Redirect to login')
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        console.log('🔄 Đang refresh token...')

        // Gọi API refresh (dùng axios gốc để tránh interceptor loop)
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        console.log('✅ Refresh token thành công!')

        // Lưu tokens mới
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Update header của request gốc
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Process queued requests
        processQueue()

        // Retry request gốc
        console.log('🔄 Retry request gốc:', originalRequest.url)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('🔴 Refresh token thất bại:', refreshError)
        processQueue(refreshError as Error)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ────────────────────────────────────────────────────────
    // Case 2: Other errors
    // ────────────────────────────────────────────────────────
    return Promise.reject(error)
  }
)

export { axiosInstance }
export default axiosInstance
