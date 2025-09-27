'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { oauthService } from '@/lib/oauth-service'

interface User {
  id: number | string
  email: string
  name: string
  phone?: string
  full_name?: string
  is_active?: boolean
  provider?: 'google' | 'apple' | 'local'
  picture?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  oauthLogin: (provider: 'google' | 'apple') => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount and validate it
    const checkAuthStatus = async () => {
      const savedToken = localStorage.getItem('admin_token')
      const savedUser = localStorage.getItem('admin_user')

      if (savedToken && savedUser) {
        try {
          // Check if it's an OAuth token
          if (savedToken.startsWith('oauth_')) {
            const oauthUser = oauthService.verifyToken(savedToken)
            if (oauthUser) {
              setToken(savedToken)
              setUser({
                ...oauthUser,
                name: oauthUser.name,
                provider: oauthUser.provider
              })
            } else {
              // Invalid OAuth token
              localStorage.removeItem('admin_token')
              localStorage.removeItem('admin_user')
            }
          } else {
            // Validate regular token by making a request to the /me endpoint
            const response = await fetch('http://localhost:8000/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${savedToken}`,
              },
            })

            if (response.ok) {
              const userData = await response.json()
              setToken(savedToken)
              setUser(userData)
            } else {
              // Token is invalid, clear localStorage
              localStorage.removeItem('admin_token')
              localStorage.removeItem('admin_user')
            }
          }
        } catch (error) {
          // Error validating token, clear localStorage
          console.error('Token validation error:', error)
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
        }
      }
      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.access_token)

        // Get user info (you might need to decode the JWT or create a /me endpoint)
        const userResponse = await fetch('http://localhost:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
          },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser({
            ...userData,
            name: userData.full_name || userData.name,
            provider: 'local'
          })

          // Save to localStorage
          localStorage.setItem('admin_token', data.access_token)
          localStorage.setItem('admin_user', JSON.stringify(userData))

          return true
        }
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const oauthLogin = async (provider: 'google' | 'apple') => {
    try {
      if (provider === 'google') {
        // Use API endpoint to get auth URL (server-side secret handling)
        const response = await fetch('/api/auth/google/init')
        if (!response.ok) {
          throw new Error('Failed to initialize Google OAuth')
        }
        const { authUrl } = await response.json()
        window.location.href = authUrl
      } else if (provider === 'apple') {
        const authUrl = await oauthService.getAppleAuthUrl()
        window.location.href = authUrl
      }
    } catch (error) {
      console.error('OAuth login error:', error)
      // Optionally show an error message to the user
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      oauthLogin,
      logout,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}