'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
// import LinearBuffer from './LinearBuffer'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/admin/login')
        return
      }

      // Add role-based access control if needed
      if (requiredRole && user && user.email !== 'admin@agapay.com') {
        // For now, just check if it's the admin email
        // You can enhance this with proper role management
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, isLoading, user, router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4">
            <div className="loader mx-auto"></div>
          </div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}