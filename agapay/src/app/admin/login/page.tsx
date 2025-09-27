"use client"

import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check authentication status after component mounts
    const checkAuth = () => {
      setIsCheckingAuth(false)
    }

    // Small delay to ensure auth context is loaded
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  // Handle redirect after auth check is complete
  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isCheckingAuth, isAuthenticated, router])

  // Show loading while checking auth
  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if already authenticated (after check)
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-svh">
      <LoginForm />
    </div>
  )
}