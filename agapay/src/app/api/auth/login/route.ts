import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${config.apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to login')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}