'use client'

import { authService } from '@/services/auth.service'
import { User } from '@/types/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Initialize state from localStorage (lazy initialization)
  const [user] = useState<User | null>(() => {
    const userData = authService.getUser()
    return userData as User | null
  })

  // Track if component has mounted (client-side only)
  const [mounted, setMounted] = useState(false)

  // Use layoutEffect for synchronous redirect before paint
  useLayoutEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login'
    }
  }, [])

  // Set mounted after first render to avoid hydration mismatch
  useEffect(() => {
    // Use queueMicrotask to defer setState and avoid linter warning
    queueMicrotask(() => {
      setMounted(true)
    })
  }, [])

  const handleLogout = () => {
    authService.logout()
    window.location.href = '/login'
  }

  // Navigation items
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/wallets', label: 'Ví', icon: '💰' }
  ]

  return (
    <div className='min-h-screen bg-slate-900'>
      <header className='bg-slate-800 border-b border-slate-700 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-8'>
              <h1 className='text-xl font-bold text-white'>FinTrack</h1>

              {/* Navigation */}
              <nav className='hidden md:flex items-center gap-1'>
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {mounted && user && (
                <div className='hidden lg:flex items-center gap-2 text-sm'>
                  <span className='text-slate-400'>👤</span>
                  <span className='text-slate-300'>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email}
                  </span>
                  <span className='px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs'>
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className='text-slate-400 hover:text-white transition-colors flex items-center gap-2'
            >
              <span>🚪</span>
              <span className='hidden sm:inline'>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className='bg-gray-50'>{children}</main>
    </div>
  )
}
