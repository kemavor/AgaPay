import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

const BACKEND_URL = config.apiUrl

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    const response = await fetch(`${BACKEND_URL}/api/users`, {
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}