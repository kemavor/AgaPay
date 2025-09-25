'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'

interface User {
  id: number
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
  last_login?: string
}

function AdminUsersContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', current: false },
    { name: 'Collections', href: '/admin/collections', current: false },
    { name: 'Payments', href: '/admin/payments', current: false },
    { name: 'Users', href: '/admin/users', current: true },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH')
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'manager':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-black">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">₵</span>
                <span className="ml-1 sm:ml-2 text-lg sm:text-xl font-bold text-black hidden sm:block">AgaPay Admin</span>
                <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold text-black sm:hidden">Admin</span>
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
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-black hover:text-blue-600 hover:bg-gray-50'
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
                  <p className="text-xs sm:text-sm font-medium text-black truncate max-w-[80px] sm:max-w-[120px]">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-black truncate max-w-[80px] sm:max-w-[120px]">
                    {user?.email}
                  </p>
                </div>
                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-blue-600">
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
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-black hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                {/* Mobile user info */}
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-3 py-2">
                    <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-medium text-black truncate">{user?.full_name}</div>
                      <div className="text-xs text-black truncate">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-3 rounded-md text-sm font-medium text-black hover:text-black hover:bg-gray-50 transition-colors touch-manipulation"
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

      {/* Page Content */}
      <div className="bg-blue-600 text-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
              <p className="text-blue-100 text-sm sm:text-base">Manage user accounts and permissions</p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2">
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {users.length} Total Users
              </span>
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Admin User
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProtectedRoute>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">Registered Users</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">User</th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Email</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Role</th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                    <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Joined</th>
                    <th className="hidden xl:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Last Login</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-black">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-black">{user.full_name}</div>
                              <div className="text-xs text-black sm:hidden">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{user.email}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.is_active)}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{formatDate(user.created_at)}</div>
                        </td>
                        <td className="hidden xl:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">
                            {user.last_login ? formatDate(user.last_login) : 'Never'}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ProtectedRoute>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  return (
    <ProtectedRoute>
      <AdminUsersContent />
    </ProtectedRoute>
  )
}