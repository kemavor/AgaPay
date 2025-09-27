'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardBody, Button } from '@heroui/react'

export default function HelpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'payment'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-black mb-4">Message Sent!</h2>
          <p className="text-black mb-8">
            Thank you for contacting AgaPay support. We've received your message and will get back to you within 24-48 hours.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                inquiryType: 'payment'
              })
            }}
            className="bg-blue-600 text-white"
          >
            Send Another Message
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about payments or need assistance with our platform? We're here to help.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-black">Send us a Message</h2>
                  <p className="text-black">Fill out the form below and we'll respond as soon as possible.</p>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          placeholder="+233 20 000 0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Inquiry Type *
                        </label>
                        <select
                          required
                          value={formData.inquiryType}
                          onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        >
                          <option value="payment">Payment Issues</option>
                          <option value="technical">Technical Support</option>
                          <option value="account">Account Help</option>
                          <option value="general">General Inquiry</option>
                          <option value="complaint">Complaint/Petition</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                        placeholder="Please provide detailed information about your inquiry or issue..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-3"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-bold text-black">Contact Information</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-black mb-2">Email Support</h4>
                    <p className="text-black">support@agapay.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Phone Support</h4>
                    <p className="text-black">+233 30 290 0000</p>
                    <p className="text-sm text-black">Mon-Fri, 9AM-5PM GMT</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Live Chat</h4>
                    <p className="text-black">Available on our website</p>
                    <p className="text-sm text-black">Mon-Fri, 9AM-6PM GMT</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <h3 className="text-xl font-bold text-black">Common Issues</h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-black mb-1">Payment Failed</h4>
                    <p className="text-sm text-black">Check your payment method and account balance</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Account Access</h4>
                    <p className="text-sm text-black">Use the Forgot Password option to reset</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Transaction Status</h4>
                    <p className="text-sm text-black">Check your email for payment confirmation</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Refund Requests</h4>
                    <p className="text-sm text-black">Contact support within 7 days of transaction</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}