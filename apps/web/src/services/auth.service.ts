// ════════════════════════════════════════════════════════════
// AUTH SERVICE - Authentication APIs
// ════════════════════════════════════════════════════════════
// 📌 SECURITY NOTE: Using localStorage (Phase 3 will migrate to HttpOnly Cookie)
// ════════════════════════════════════════════════════════════

import axiosInstance from '@/lib/axios'

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface LoginData {
  email: string
  password: string
}

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ────────────────────────────────────────────────────────────
// Auth Service Object
// ────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Đăng ký tài khoản mới
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return axiosInstance.post<AuthResponse>(
      '/auth/register',
      data
    ) as unknown as Promise<AuthResponse>
  },

  /**
   * Đăng nhập
   */
  async login(data: LoginData): Promise<AuthResponse> {
    return axiosInstance.post<AuthResponse>(
      '/auth/login',
      data
    ) as unknown as Promise<AuthResponse>
  },

  /**
   * Đăng xuất - Xóa tokens khỏi localStorage
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  },
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },

  /**
   * Lưu tokens sau khi login thành công
   */
  saveTokens(accessToken: string, refreshToken: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
    }
  },

  /**
   * Lấy access token từ localStorage
   */
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  },

  /**
   * Kiểm tra user có đang đăng nhập không
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}
