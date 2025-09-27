// OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '';
export const APPLE_CLIENT_SECRET = process.env.APPLE_CLIENT_SECRET || '';

// OAuth Scopes
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export const APPLE_SCOPES = [
  'name',
  'email'
];

// OAuth Redirect URIs
export const GOOGLE_REDIRECT_URI = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  : 'http://localhost:3000/api/auth/google/callback';

export const APPLE_REDIRECT_URI = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api/auth/apple/callback`
  : 'http://localhost:3000/api/auth/apple/callback';

// JWT Secret for session management
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// API Endpoints
export const OAUTH_ENDPOINTS = {
  google: {
    auth: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    userinfo: 'https://www.googleapis.com/oauth2/v2/userinfo'
  },
  apple: {
    auth: 'https://appleid.apple.com/auth/authorize',
    token: 'https://appleid.apple.com/auth/token',
    userinfo: 'https://appleid.apple.com/auth/userinfo'
  }
};