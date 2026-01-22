'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'

export default function LoginPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // 🔥 CLEAR OLD CACHE FIRST
      queryClient.clear()

      // Gọi API login
      const data = await authService.login({ email, password })

      // Lưu tokens vào localStorage
      authService.saveTokens(data.accessToken, data.refreshToken, data.user)

      console.log('✅ Đăng nhập thành công:', data.user)

      // Redirect về dashboard
      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đăng nhập thất bại')
      console.error('❌ Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <div className='w-full max-w-md p-8 space-y-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-white'>FinTrack</h1>
          <p className='mt-2 text-slate-400'>Đăng nhập để quản lý tài chính</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='p-3 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-lg'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-slate-300'
            >
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='mt-1 w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-slate-300'
            >
              Mật khẩu
            </label>
            <input
              id='password'
              name='password'
              type='password'
              required
              className='mt-1 w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition'
              placeholder='••••••••'
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800'
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Footer */}
        <p className='text-center text-sm text-slate-400'>
          Chưa có tài khoản?{' '}
          <Link
            href='/register'
            className='text-emerald-400 hover:text-emerald-300 font-medium'
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
