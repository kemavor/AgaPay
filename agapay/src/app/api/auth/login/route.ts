import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch('http://localhost:8000/api/auth/login', {
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