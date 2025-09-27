import { NextRequest, NextResponse } from 'next/server'
import { getPublicCollections } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    const publicCollections = getPublicCollections()
    return NextResponse.json({ collections: publicCollections })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}