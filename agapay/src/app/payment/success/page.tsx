'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [status, setStatus] = useState<'success' | 'failed' | 'pending'>('pending')
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference') || searchParams.get('trxref')

        // Check if this payment has already been processed to prevent duplicates
        const processedPaymentsKey = 'processed_payments'
        const processedPayments = JSON.parse(sessionStorage.getItem(processedPaymentsKey) || '[]')

        if (reference && processedPayments.includes(reference)) {
          console.log('Payment already processed:', reference)
          setVerifying(false)
          return
        }

        if (!reference) {
          // Check session storage for payment details from inline popup
          const storedReference = sessionStorage.getItem('payment_reference')
          const storedAmount = sessionStorage.getItem('payment_amount')
          const storedEmail = sessionStorage.getItem('payment_email')

          if (storedReference && storedAmount && storedEmail) {
            // Check if stored payment was already processed
            if (processedPayments.includes(storedReference)) {
              console.log('Stored payment already processed:', storedReference)
              setVerifying(false)
              return
            }

            // Use stored payment details
            setPaymentData({
              reference: storedReference,
              amount: parseFloat(storedAmount),
              customer: { email: storedEmail },
              paid_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              metadata: { purpose: 'Payment completed via Paystack' }
            })
            setStatus('success')

            // Clear session storage
            sessionStorage.removeItem('payment_reference')
            sessionStorage.removeItem('payment_amount')
            sessionStorage.removeItem('payment_email')
          } else {
            // Show generic success message if no stored details
            setPaymentData({
              reference: 'AGA_PAYMENT',
              amount: 0,
              customer: { email: 'customer@example.com' },
              paid_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              metadata: { purpose: 'Payment completed via Paystack' }
            })
            setStatus('success')
          }
          setVerifying(false)
          return
        }

        const response = await fetch(`/api/payments/verify?reference=${reference}`)
        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setPaymentData(data.data)

          // Update collection total if this was a collection contribution
          if (data.data.metadata?.collection_id) {
            console.log('Updating collection total:', {
              collection_id: data.data.metadata.collection_id,
              amount: data.data.amount,
              metadata: data.data.metadata
            })
            try {
              await updateCollectionTotal(data.data.metadata.collection_id, data.data.amount)
              console.log('Collection total updated successfully')

              // Mark this payment as processed to prevent duplicates
              const updatedProcessedPayments = [...processedPayments, reference]
              sessionStorage.setItem(processedPaymentsKey, JSON.stringify(updatedProcessedPayments))
              console.log('Payment marked as processed:', reference)
            } catch (updateError) {
              console.error('Failed to update collection total:', updateError)
              // Don't fail the whole payment process if collection update fails
            }
          } else {
            console.log('No collection_id in metadata, skipping collection update')
            // Still mark as processed even if no collection update
            const updatedProcessedPayments = [...processedPayments, reference]
            sessionStorage.setItem(processedPaymentsKey, JSON.stringify(updatedProcessedPayments))
            console.log('Payment marked as processed (no collection):', reference)
          }
        } else {
          setStatus('failed')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  const updateCollectionTotal = async (collectionId: string, amount: number) => {
    try {
      console.log('Sending collection update request:', { collectionId, amount })

      const response = await fetch('/api/collections/update-total', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection_id: collectionId,
          amount: amount
        })
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Collection total updated successfully:', result)
      } else {
        console.error('Collection update failed:', result.error)
        throw new Error(result.error || 'Failed to update collection total')
      }
    } catch (error) {
      console.error('Failed to update collection total:', error)
      throw error
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-black">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        {status === 'success' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              {paymentData?.metadata?.collection_id
                ? `Your contribution to "${paymentData.metadata.purpose}" has been processed successfully.`
                : 'Your payment has been processed successfully.'
              }
            </p>

            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium">{paymentData.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₵{paymentData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{paymentData.customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(paymentData.paid_at || paymentData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/contributions?from=payment"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors block text-center"
              >
                Make Another Payment
              </Link>
              <Link
                href="/"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again.</p>

            <div className="space-y-3">
              <Link
                href="/contributions"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors block text-center"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}