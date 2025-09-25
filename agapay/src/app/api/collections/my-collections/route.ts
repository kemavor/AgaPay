import { NextRequest, NextResponse } from 'next/server'

// Mock admin collections data
const mockAdminCollections = [
  {
    id: 1,
    title: "School Fees Collection",
    description: "Collection for student school fees for the academic year",
    target_amount: 5000,
    current_amount: 1250,
    currency: "GHS",
    status: "active",
    is_public: true,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    created_at: "2024-01-01T00:00:00",
    created_by: 1
  },
  {
    id: 2,
    title: "Church Building Fund",
    description: "Fundraising for new church construction",
    target_amount: 10000,
    current_amount: 3500,
    currency: "GHS",
    status: "active",
    is_public: true,
    start_date: "2024-01-15",
    end_date: "2024-12-15",
    created_at: "2024-01-15T00:00:00",
    created_by: 1
  }
]

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return mock data for now since backend has issues
    return NextResponse.json(mockAdminCollections)
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

    // Create a new collection object
    const newCollection = {
      id: mockAdminCollections.length + 1,
      title: body.title,
      description: body.description,
      target_amount: body.target_amount,
      current_amount: 0,
      currency: body.currency,
      status: "active",
      is_public: body.is_public,
      start_date: body.start_date,
      end_date: body.end_date,
      created_at: new Date().toISOString(),
      created_by: 1
    }

    // Return the created collection
    return NextResponse.json(newCollection)
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
  }
}