import { NextRequest, NextResponse } from 'next/server'

// Mock collections data for testing
const mockCollections = [
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
  },
  {
    id: 3,
    title: "Medical Emergency Fund",
    description: "Emergency medical fund for community members",
    target_amount: 2000,
    current_amount: 800,
    currency: "GHS",
    status: "active",
    is_public: true,
    start_date: "2024-02-01",
    end_date: "2024-11-30",
    created_at: "2024-02-01T00:00:00",
    created_by: 1
  }
]

export async function GET(request: NextRequest) {
  try {
    // Return mock data for now since backend has issues
    return NextResponse.json(mockCollections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}