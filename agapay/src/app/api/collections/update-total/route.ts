import { NextRequest, NextResponse } from 'next/server'
import { updateCollectionTotal, collections } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collection_id, amount } = body

    console.log('Received collection update request:', { collection_id, amount })

    if (!collection_id || !amount) {
      console.error('Missing required fields:', { collection_id, amount })
      return NextResponse.json(
        { error: 'Collection ID and amount are required' },
        { status: 400 }
      )
    }

    if (isNaN(parseInt(collection_id)) || parseFloat(amount) <= 0) {
      console.error('Invalid data types:', { collection_id, amount })
      return NextResponse.json(
        { error: 'Invalid collection ID or amount' },
        { status: 400 }
      )
    }

    // Update the collection total
    const updatedCollection = updateCollectionTotal(parseInt(collection_id), parseFloat(amount))

    if (!updatedCollection) {
      console.error('Collection not found:', collection_id)
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    console.log('Collection updated successfully:', {
      id: updatedCollection.id,
      title: updatedCollection.title,
      new_total: updatedCollection.current_amount
    })

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