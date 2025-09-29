import { NextRequest, NextResponse } from 'next/server'
import { paystackService } from '@/lib/paystack-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference') || searchParams.get('trxref')

    if (!reference) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      )
    }

    // Verify transaction with Paystack
    const response = await paystackService.verifyTransaction(reference)

    if (!response.status) {
      return NextResponse.json(
        {
          success: false,
          error: response.message || 'Transaction verification failed'
        },
        { status: 400 }
      )
    }

    const transactionData = response.data

    // Return success response with transaction details
    return NextResponse.json({
      success: true,
      data: {
        reference: transactionData.reference,
        status: transactionData.status,
        amount: transactionData.amount / 100, // Convert back to main currency unit
        currency: transactionData.currency,
        paid_at: transactionData.paid_at,
        created_at: transactionData.created_at,
        customer: transactionData.customer,
        metadata: transactionData.metadata
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment'
      },
      { status: 500 }
    )
  }
}

// Handle POST requests for webhooks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = body.event

    // Verify Paystack signature (in production)
    // const signature = request.headers.get('x-paystack-signature')
    // if (!verifySignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    console.log('Received Paystack webhook:', event)

    // Handle different webhook events
    switch (event) {
      case 'charge.success':
        // Payment successful
        console.log('Payment successful:', body.data)
        break

      case 'charge.failed':
        // Payment failed
        console.log('Payment failed:', body.data)
        break

      case 'transfer.success':
        // Transfer successful
        console.log('Transfer successful:', body.data)
        break

      case 'transfer.failed':
        // Transfer failed
        console.log('Transfer failed:', body.data)
        break

      default:
        console.log('Unhandled event:', event)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process webhook'
      },
      { status: 500 }
    )
  }
}