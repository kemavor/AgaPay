// Secure Secret Management System
// This module handles loading OAuth secrets securely for both development and production

interface GoogleOAuthSecrets {
  client_id: string
  client_secret: string
  project_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  redirect_uris: string[]
}

interface AppleOAuthSecrets {
  client_id: string
  client_secret: string
  team_id: string
  key_id: string
}

class SecretManager {
  private static instance: SecretManager
  private googleSecrets: GoogleOAuthSecrets | null = null
  private appleSecrets: AppleOAuthSecrets | null = null

  static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager()
    }
    return SecretManager.instance
  }

  // Load Google OAuth secrets from environment or local file (development only)
  async loadGoogleSecrets(): Promise<GoogleOAuthSecrets> {
    // Check environment variables first (production)
    const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
    const envClientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (envClientId && envClientSecret) {
      this.googleSecrets = {
        client_id: envClientId,
        client_secret: envClientSecret,
        project_id: process.env.GOOGLE_PROJECT_ID || 'agapay-test',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        redirect_uris: [process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000']
      }
      return this.googleSecrets
    }

    // For development, try to load from local file
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = require('fs')
        const path = require('path')

        // Try multiple possible locations for the secret file
        const possiblePaths = [
          'C:\\Users\\KSI\\Downloads\\client_secret_71068494417-0ehi264ldrmrjoh87aoeb3r6s7b6llao.apps.googleusercontent.com.json',
          path.join(process.cwd(), 'client_secret_71068494417-0ehi264ldrmrjoh87aoeb3r6s7b6llao.apps.googleusercontent.com.json'),
          path.join(process.cwd(), 'secrets', 'google-oauth.json')
        ]

        for (const filePath of possiblePaths) {
          try {
            if (fs.existsSync(filePath)) {
              const secretData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
              this.googleSecrets = secretData.web

              // Update redirect URI to match our development server
              this.googleSecrets.redirect_uris = ['http://localhost:3000']

              console.log('✅ Google OAuth secrets loaded from local file (development mode)')
              return this.googleSecrets
            }
          } catch (error) {
            // Continue to next path
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not load Google OAuth secrets from local file')
      }
    }

    throw new Error(
      'Google OAuth secrets not found. Please:\n' +
      '1. Set environment variables: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET\n' +
      '2. Or place client_secret JSON file in the project directory for development'
    )
  }

  // Load Apple OAuth secrets from environment
  async loadAppleSecrets(): Promise<AppleOAuthSecrets> {
    const clientId = process.env.APPLE_CLIENT_ID
    const clientSecret = process.env.APPLE_CLIENT_SECRET
    const teamId = process.env.APPLE_TEAM_ID
    const keyId = process.env.APPLE_KEY_ID

    if (!clientId || !clientSecret) {
      throw new Error(
        'Apple OAuth secrets not found. Please set environment variables:\n' +
        'APPLE_CLIENT_ID, APPLE_CLIENT_SECRET, APPLE_TEAM_ID, APPLE_KEY_ID'
      )
    }

    this.appleSecrets = {
      client_id: clientId,
      client_secret: clientSecret,
      team_id: teamId || '',
      key_id: keyId || ''
    }

    return this.appleSecrets
  }

  // Get Google client ID (public, safe to expose)
  getGoogleClientId(): string {
    if (!this.googleSecrets) {
      throw new Error('Google secrets not loaded. Call loadGoogleSecrets() first.')
    }
    return this.googleSecrets.client_id
  }

  // Get Google client secret (private, never expose to client)
  getGoogleClientSecret(): string {
    if (!this.googleSecrets) {
      throw new Error('Google secrets not loaded. Call loadGoogleSecrets() first.')
    }
    return this.googleSecrets.client_secret
  }

  // Get Apple client ID (public, safe to expose)
  getAppleClientId(): string {
    if (!this.appleSecrets) {
      throw new Error('Apple secrets not loaded. Call loadAppleSecrets() first.')
    }
    return this.appleSecrets.client_id
  }

  // Get Apple client secret (private, never expose to client)
  getAppleClientSecret(): string {
    if (!this.appleSecrets) {
      throw new Error('Apple secrets not loaded. Call loadAppleSecrets() first.')
    }
    return this.appleSecrets.client_secret
  }

  // Check if secrets are loaded
  isGoogleLoaded(): boolean {
    return this.googleSecrets !== null
  }

  isAppleLoaded(): boolean {
    return this.appleSecrets !== null
  }
}

// Export singleton instance
export const secretManager = SecretManager.getInstance()

// Public configuration (safe to expose to client)
export const publicConfig = {
  google: {
    // This will be dynamically loaded
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    redirectUri: process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
      : 'http://localhost:3000/api/auth/google/callback'
  },
  apple: {
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
    scopes: ['name', 'email'],
    redirectUri: process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api/auth/apple/callback`
      : 'http://localhost:3000/api/auth/apple/callback'
  }
}

// Helper function to initialize secrets on server startup
export async function initializeSecrets() {
  try {
    if (!secretManager.isGoogleLoaded()) {
      await secretManager.loadGoogleSecrets()
    }
    if (!secretManager.isAppleLoaded()) {
      await secretManager.loadAppleSecrets()
    }
    console.log('✅ OAuth secrets initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize OAuth secrets:', error)
    // Don't throw error in production to allow app to start
    if (process.env.NODE_ENV !== 'production') {
      throw error
    }
  }
}