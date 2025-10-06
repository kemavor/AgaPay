// Frontend configuration
export const config = {
  // API URL - Use environment variable or fallback to localhost
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Paystack configuration
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Feature flags
  features: {
    debug: process.env.NODE_ENV === 'development',
    analytics: process.env.NODE_ENV === 'production'
  }
}

// Environment validation
export const validateEnvironment = () => {
  const errors: string[] = []

  // Required environment variables
  if (!config.paystackPublicKey && config.isProduction) {
    errors.push('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is required in production')
  }

  if (!config.apiUrl) {
    errors.push('NEXT_PUBLIC_API_URL is required')
  }

  if (config.isProduction) {
    if (config.apiUrl.includes('localhost') || config.apiUrl.includes('127.0.0.1')) {
      errors.push('API URL cannot be localhost in production')
    }

    if (config.appUrl.includes('localhost') || config.appUrl.includes('127.0.0.1')) {
      errors.push('App URL cannot be localhost in production')
    }
  }

  // Development warnings
  if (config.isDevelopment) {
    if (!config.paystackPublicKey) {
      console.warn('⚠️ NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY not configured. Payment features will be limited.')
    }

    if (config.apiUrl.includes('localhost')) {
      console.log('ℹ️ Using localhost API URL for development')
    }
  }

  if (errors.length > 0) {
    const errorMessage = `Configuration Error:\n${errors.join('\n')}`
    console.error('🚨 ' + errorMessage)

    if (config.isProduction) {
      throw new Error(errorMessage)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: config.isDevelopment && !config.paystackPublicKey
      ? ['Paystack public key not configured']
      : []
  }
}

// Validate environment only when explicitly called (not on import)
export const validateEnvironmentForBuild = () => {
  // Only validate for actual production builds, not for development
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL?.includes('localhost')) {
    validateEnvironment()
  }
}

// Helper function to get API URL
export const getApiUrl = (path: string) => {
  const baseUrl = config.apiUrl.replace(/\/$/, '') // Remove trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}` // Ensure path starts with /
  return `${baseUrl}${cleanPath}`
}

// Helper function to make authenticated API requests
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  const response = await fetch(getApiUrl(url), finalOptions)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}