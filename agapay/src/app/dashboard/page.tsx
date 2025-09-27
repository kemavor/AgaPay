'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin login
    router.push('/admin/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loader mx-auto"></div>
        <p className="mt-4 text-black">Redirecting to login...</p>
      </div>
    </div>
  )
}