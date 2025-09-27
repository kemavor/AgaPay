import { secretManager, publicConfig } from './secrets'
import { OAUTH_ENDPOINTS } from './oauth-config'

interface OAuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple';
}

interface AuthResponse {
  success: boolean;
  user?: OAuthUser;
  token?: string;
  error?: string;
}

export class OAuthService {
  private static instance: OAuthService;
  private secretsLoaded: boolean = false;

  static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }

  private async ensureSecretsLoaded() {
    if (!this.secretsLoaded) {
      try {
        await secretManager.loadGoogleSecrets()
        this.secretsLoaded = true
      } catch (error) {
        console.error('Failed to load OAuth secrets:', error)
        throw error
      }
    }
  }

  // Generate Google OAuth URL
  async getGoogleAuthUrl(): Promise<string> {
    await this.ensureSecretsLoaded()

    const clientId = secretManager.getGoogleClientId()
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: publicConfig.google.redirectUri,
      scope: publicConfig.google.scopes.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      state: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    });

    return `${OAUTH_ENDPOINTS.google.auth}?${params.toString()}`;
  }

  // Generate Apple OAuth URL
  async getAppleAuthUrl(): Promise<string> {
    await this.ensureSecretsLoaded()

    const clientId = secretManager.getAppleClientId()
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: publicConfig.apple.redirectUri,
      scope: publicConfig.apple.scopes.join(' '),
      response_type: 'code',
      response_mode: 'form_post'
    });

    return `${OAUTH_ENDPOINTS.apple.auth}?${params.toString()}`;
  }

  // Exchange Google authorization code for user info
  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    try {
      await this.ensureSecretsLoaded()

      const clientId = secretManager.getGoogleClientId()
      const clientSecret = secretManager.getGoogleClientSecret()

      // Exchange code for access token
      const tokenResponse = await fetch(OAUTH_ENDPOINTS.google.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: publicConfig.google.redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();

      // Get user info with access token
      const userResponse = await fetch(OAUTH_ENDPOINTS.google.userinfo, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();

      const user: OAuthUser = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        provider: 'google'
      };

      // Generate JWT token
      const token = await this.generateJWT(user);

      return { success: true, user, token };
    } catch (error) {
      console.error('Google OAuth error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Google authentication failed' };
    }
  }

  // Exchange Apple authorization code for user info
  async handleAppleCallback(code: string, user?: string): Promise<AuthResponse> {
    try {
      await this.ensureSecretsLoaded()

      const clientId = secretManager.getAppleClientId()
      const clientSecret = secretManager.getAppleClientSecret()

      // Exchange code for tokens
      const tokenResponse = await fetch(OAUTH_ENDPOINTS.apple.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: publicConfig.apple.redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();

      // Parse user data (Apple provides it as a base64 encoded string)
      let userData = { email: '', name: 'Apple User' };
      if (user) {
        try {
          userData = JSON.parse(atob(user));
        } catch {
          console.error('Failed to parse Apple user data');
        }
      }

      const oauthUser: OAuthUser = {
        id: tokenData.id_token || 'apple_' + Date.now(),
        email: userData.email,
        name: userData.name || 'Apple User',
        provider: 'apple'
      };

      // Generate JWT token
      const token = await this.generateJWT(oauthUser);

      return { success: true, user: oauthUser, token };
    } catch (error) {
      console.error('Apple OAuth error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Apple authentication failed' };
    }
  }

  // Generate JWT token for authenticated user
  private async generateJWT(user: OAuthUser): Promise<string> {
    // In a real implementation, you'd use a proper JWT library
    // For now, we'll create a simple token with user info
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days expiration
    };

    // Simple base64 encoding (in production, use proper JWT signing)
    const encodedPayload = btoa(JSON.stringify(payload));
    return `oauth_${encodedPayload}`;
  }

  // Verify JWT token
  verifyToken(token: string): OAuthUser | null {
    try {
      if (!token.startsWith('oauth_')) {
        return null;
      }

      const payload = JSON.parse(atob(token.substring(6)));

      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        provider: payload.provider
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
}

export const oauthService = OAuthService.getInstance();