import { NextRequest, NextResponse } from 'next/server'
import { updateCollectionTotal } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collection_id, amount } = body

    if (!collection_id || !amount) {
      return NextResponse.json(
        { error: 'Collection ID and amount are required' },
        { status: 400 }
      )
    }

    // Update the collection total
    const updatedCollection = updateCollectionTotal(parseInt(collection_id), amount)

    if (!updatedCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedCollection
    })

  } catch (error) {
    console.error('Error updating collection total:', error)
    return NextResponse.json(
      { error: 'Failed to update collection total' },
      { status: 500 }
    )
  }
}