# Secure OAuth Deployment Guide

## 🔐 Secure Secret Management

This application uses a secure secret management system that protects your OAuth credentials from being exposed in client-side code.

## Development Setup

### 1. Local Development (Using JSON Secret File)

For local development, the system can automatically load Google OAuth secrets from the JSON file:

```bash
# The system will automatically look for the secret file at:
# C:\Users\KSI\Downloads\client_secret_71068494417-0ehi264ldrmrjoh87aoeb3r6s7b6llao.apps.googleusercontent.com.json
```

### 2. Environment Variables (Recommended for Production)

Create a `.env.local` file:

```bash
# Copy the example
cp .env.local.example .env.local

# Edit with your actual secrets
```

**Required Environment Variables:**

```bash
# Google OAuth (Client ID is public, Secret is private)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=71068494417-0ehi264ldrmrjoh87aoeb3r6s7b6llao.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_PROJECT_ID=agapay-test

# Apple OAuth
NEXT_PUBLIC_APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Application URL
NEXTAUTH_URL=http://localhost:3000
```

## Production Deployment

### Vercel Deployment

1. **Environment Variables Setup:**
   ```bash
   # Set these in Vercel dashboard:
   GOOGLE_CLIENT_SECRET=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
   GOOGLE_PROJECT_ID=agapay-test
   APPLE_CLIENT_SECRET=your-apple-client-secret
   APPLE_TEAM_ID=your-apple-team-id
   APPLE_KEY_ID=your-apple-key-id
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

2. **Public Variables (safe to expose):**
   ```bash
   # These can be set as public variables:
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=71068494417-0ehi264ldrmrjoh87aoeb3r6s7b6llao.apps.googleusercontent.com
   NEXT_PUBLIC_APPLE_CLIENT_ID=your-apple-client-id
   ```

### Other Platforms (Netlify, Railway, etc.)

Follow the same pattern - set environment variables in your hosting platform's dashboard.

## 🔒 Security Best Practices

### ✅ What's Safe to Expose

- **Client IDs** (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_APPLE_CLIENT_ID`)
- **Redirect URIs**
- **OAuth Scopes**
- **Public Configuration**

### 🚫 What Must NEVER Be Exposed

- **Client Secrets** (`GOOGLE_CLIENT_SECRET`, `APPLE_CLIENT_SECRET`)
- **Private Keys**
- **JWT Signing Secrets**
- **API Keys**
- **Database Credentials**

### 🛡️ Security Features

1. **Secret Isolation**: Client-side code never has access to secret values
2. **Environment Priority**: Environment variables override local files
3. **Development Protection**: Secret files only work in development mode
4. **Validation**: Secrets are validated on startup
5. **Error Handling**: Graceful fallback if secrets aren't available

## 🚀 Google OAuth Configuration

### Google Cloud Console Setup

1. **Authorized JavaScript Origins:**
   ```
   http://localhost:3000
   https://your-domain.com
   ```

2. **Authorized Redirect URIs:**
   ```
   http://localhost:3000/api/auth/google/callback
   https://your-domain.com/api/auth/google/callback
   ```

### Domain Verification

Make sure your domain is verified in Google Cloud Console and that the redirect URIs match exactly.

## 🍎 Apple OAuth Configuration

### Apple Developer Setup

1. **Sign in with Apple Configuration:**
   - Create a Service ID
   - Configure domains and redirect URIs
   - Generate private key
   - Note your Team ID and Key ID

2. **Required Identifiers:**
   - Service ID (Client ID)
   - Team ID
   - Key ID
   - Private Key (.p8 file content)

## 📋 Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Remove or secure local secret files
- [ ] Verify Google OAuth redirect URIs
- [ ] Verify Apple OAuth configuration
- [ ] Test authentication flow in production
- [ ] Set up proper CORS configuration
- [ ] Enable HTTPS (required for OAuth)
- [ ] Set up proper domain verification

## 🔍 Troubleshooting

### Common Issues

1. **"Secrets not loaded"**: Check environment variables or local file path
2. **"Invalid redirect URI"**: Update Google/Apple console with correct URIs
3. **"CORS errors"**: Ensure proper CORS configuration
4. **"Domain not verified"**: Complete domain verification in provider console

### Debug Mode

Enable debug logging:
```bash
DEBUG=oauth:* npm run dev
```

## 📝 Notes

- The secret JSON file is **only** used in development mode
- In production, only environment variables are used
- Client-side code never has access to secret values
- All OAuth operations happen server-side through API routes
- Redirect URIs must match exactly in provider consoles