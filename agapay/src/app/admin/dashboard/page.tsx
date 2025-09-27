'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import SimpleDashboard from '@/components/SimpleDashboard'

function AdminDashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', current: true },
    { name: 'Contributions', href: '/admin/collections', current: false },
    { name: 'Payments', href: '/admin/payments', current: false },
    { name: 'Users', href: '/admin/users', current: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl sm:text-2xl font-bold text-red-600">₵</span>
                <span className="ml-1 sm:ml-2 text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">AgaPay Admin</span>
                <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold text-gray-900 sm:hidden">Admin</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-red-100 text-red-700'
                          : 'text-black hover:text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* User Info and Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info - Hidden on very small screens */}
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px]">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-black truncate max-w-[80px] sm:max-w-[120px]">
                    {user?.email}
                  </p>
                </div>
                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-red-600">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout Button - Hidden on mobile */}
              <div className="hidden sm:block">
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-black px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 sm:p-2 rounded-md transition-colors"
                >
                  <span className="sr-only">Open main menu</span>
                  {!mobileMenuOpen ? (
                    <svg className="block h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors touch-manipulation ${
                      item.current
                        ? 'bg-red-100 text-red-700'
                        : 'text-black hover:text-red-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                {/* Mobile user info */}
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-3 py-2">
                    <div className="h-9 w-9 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-red-600">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</div>
                      <div className="text-xs text-black truncate">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-3 rounded-md text-sm font-medium text-black hover:text-gray-900 hover:bg-gray-50 transition-colors touch-manipulation"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="bg-red-600 text-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-red-100 text-sm sm:text-base">Welcome back, {user?.full_name}</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProtectedRoute>
          <SimpleDashboard />
        </ProtectedRoute>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}