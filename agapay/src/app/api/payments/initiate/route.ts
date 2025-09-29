import { NextRequest, NextResponse } from 'next/server'
import { paystackService } from '@/lib/paystack-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, currency = 'NGN', metadata } = body

    // Validate required fields
    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Email and amount are required' },
        { status: 400 }
      )
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    // Generate unique reference
    const reference = paystackService.generateReference()

    // Prepare payment data
    const paymentData = {
      email,
      amount: paystackService.formatAmount(amount),
      currency,
      reference,
      callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/payments/verify`,
      metadata: metadata || {}
    }

    // Initialize payment with Paystack
    const response = await paystackService.initializePayment(paymentData)

    // Return success response with payment details
    return NextResponse.json({
      success: true,
      data: {
        reference,
        authorization_url: response.data.authorization_url,
        access_code: response.data.access_code,
        amount,
        currency,
        email
      }
    })

  } catch (error) {
    console.error('Payment initialization error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize payment'
      },
      { status: 500 }
    )
  }
}