// Paystack Payment Service
interface PaystackPaymentRequest {
  email: string
  amount: number
  currency: string
  reference: string
  callback_url: string
  metadata?: {
    custom_fields?: Array<{
      display_name: string
      variable_name: string
      value: string
    }>
  }
}

interface PaystackTransactionResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface PaystackVerificationResponse {
  status: boolean
  message: string
  data: {
    id: number
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string
    created_at: string
    customer: {
      email: string
      first_name?: string
      last_name?: string
    }
    metadata: Record<string, any>
  }
}

class PaystackService {
  private secretKey: string
  private baseUrl: string

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || ''
    this.baseUrl = 'https://api.paystack.co'

    if (!this.secretKey) {
      console.warn('⚠️ Paystack secret key not configured')
    }
  }

  // Initialize a payment transaction
  async initializePayment(paymentData: PaystackPaymentRequest): Promise<PaystackTransactionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to initialize payment')
      }

      return await response.json()
    } catch (error) {
      console.error('Paystack initialization error:', error)
      throw error
    }
  }

  // Verify a payment transaction
  async verifyTransaction(reference: string): Promise<PaystackVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to verify payment')
      }

      return await response.json()
    } catch (error) {
      console.error('Paystack verification error:', error)
      throw error
    }
  }

  // Generate unique transaction reference
  generateReference(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `AGP_${timestamp}_${random}`.toUpperCase()
  }

  // Format amount to kobo (Paystack expects amounts in smallest currency unit)
  formatAmount(amount: number): number {
    return Math.round(amount * 100) // Convert to kobo/cents
  }
}

export const paystackService = new PaystackService()