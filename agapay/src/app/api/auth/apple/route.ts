import { NextRequest, NextResponse } from 'next/server';
import { oauthService } from '@/lib/oauth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, user } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    const result = await oauthService.handleAppleCallback(code, user);

    if (!result.success || !result.user || !result.token) {
      return NextResponse.json(
        { error: result.error || 'Apple authentication failed' },
        { status: 400 }
      );
    }

    // Store user data and token
    const response = NextResponse.json({ success: true, user: result.user });

    // Set HTTP-only cookies for security
    response.cookies.set('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    response.cookies.set('admin_user', JSON.stringify(result.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('Apple OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}