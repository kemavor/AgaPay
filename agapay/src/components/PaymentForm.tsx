'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PaymentFormProps {
  className?: string
  defaultAmount?: number
  onSuccess?: (reference: string) => void
  onError?: (error: string) => void
}

export function PaymentForm({ className, defaultAmount = 1000, onSuccess, onError }: PaymentFormProps) {
  const [amount, setAmount] = useState(defaultAmount)
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      // Validate input
      if (!email || !amount) {
        throw new Error('Please fill in all fields')
      }

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      // Initialize payment
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount,
          currency: 'NGN',
          metadata: {
            platform: 'AgaPay',
            purpose: 'Payment'
          }
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment')
      }

      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initialization failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₵)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="100"
            step="100"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter amount"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            placeholder="your@email.com"
          />
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="loader-mini mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ₵${amount.toLocaleString()}`
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Secured by Paystack • Your payment information is encrypted and secure</p>
        </div>
      </form>
    </div>
  )
}