import { axiosInstance } from '@/lib/axios'

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

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    return axiosInstance.post<AuthResponse>(
      '/auth/register',
      data
    ) as unknown as Promise<AuthResponse>
  },

  async login(data: LoginData): Promise<AuthResponse> {
    return axiosInstance.post<AuthResponse>(
      '/auth/login',
      data
    ) as unknown as Promise<AuthResponse>
  },

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

  saveTokens(accessToken: string, refreshToken: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
    }
  },

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken')
    }
    return null
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  },

  async getProfile(): Promise<any> {
    return axiosInstance.get('/auth/profile')
  },

  async updateProfile(data: { firstName?: string; lastName?: string; avatar?: string }): Promise<any> {
    const updated = await axiosInstance.patch('/auth/profile', data)
    
    if (typeof window !== 'undefined') {
      const currentUser = this.getUser()
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updated }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
    
    return updated
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<any> {
    return axiosInstance.post('/auth/change-password', data)
  }
}
