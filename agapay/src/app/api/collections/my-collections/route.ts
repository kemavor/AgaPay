import { NextRequest, NextResponse } from 'next/server'
import { getAllCollections, addCollection } from '@/lib/data'

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return all collections
    const allCollections = getAllCollections()
    return NextResponse.json(allCollections)
  } catch (error) {
    console.error('Error fetching admin collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Create a new collection using the shared data store
    const newCollection = addCollection({
      title: body.title,
      description: body.description,
      target_amount: body.target_amount,
      currency: body.currency,
      is_public: body.is_public,
      start_date: body.start_date,
      end_date: body.end_date
    })

    // Return the created collection
    return NextResponse.json(newCollection)
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}