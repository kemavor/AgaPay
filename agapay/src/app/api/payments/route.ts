import { NextRequest, NextResponse } from 'next/server'

// Mock payments data
const mockPayments = [
  {
    id: 1,
    reference: "test_ref_123456",
    amount: 100,
    currency: "GHS",
    status: "success",
    customer_email: "user1@example.com",
    customer_name: "John Doe",
    payment_method: "mobile_money",
    created_at: "2024-01-15T10:30:00",
    processed_at: "2024-01-15T10:35:00",
    collection_id: 1,
    collection_title: "School Fees Collection"
  },
  {
    id: 2,
    reference: "test_ref_789012",
    amount: 50,
    currency: "GHS",
    status: "success",
    customer_email: "user2@example.com",
    customer_name: "Jane Smith",
    payment_method: "mobile_money",
    created_at: "2024-01-16T14:20:00",
    processed_at: "2024-01-16T14:25:00",
    collection_id: 2,
    collection_title: "Church Building Fund"
  }
]

export async function GET(request: NextRequest) {
  try {
    // Return mock data for now since backend has issues
    return NextResponse.json({ payments: mockPayments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // For testing purposes, simulate a successful payment
    // In a real implementation, this would integrate with Paystack or other payment providers
    const paymentData = {
      id: mockPayments.length + 1,
      ...body,
      status: 'success',
      reference: `test_ref_${Date.now()}`,
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString(),
    }

    // Add collection title if collection_id is provided
    if (body.collection_id) {
      const collections = [
        { id: 1, title: "School Fees Collection" },
        { id: 2, title: "Church Building Fund" },
        { id: 3, title: "Medical Emergency Fund" }
      ]
      const collection = collections.find(c => c.id === body.collection_id)
      if (collection) {
        paymentData.collection_title = collection.title
      }
    }

    // Add to mock payments (in a real app, this would be saved to database)
    mockPayments.push(paymentData)

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      payment: paymentData,
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}