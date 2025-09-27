'use client';

import { useState } from 'react';
import LinearBuffer from './LinearBuffer';

interface PaymentData {
  amount: string;
  email: string;
  phone: string;
  method: string;
}

const paymentMethods = [
  { id: 'card', name: 'Card Payment', icon: 'C', description: 'Pay with debit/credit card' },
  { id: 'ussd', name: 'USSD', icon: 'U', description: 'Pay with USSD code' },
  { id: 'qr', name: 'QR Code', icon: 'Q', description: 'Scan QR code to pay' },
  { id: 'bank', name: 'Bank Transfer', icon: 'B', description: 'Direct bank transfer' },
  { id: 'momopay', name: 'Mobile Money', icon: 'M', description: 'Pay with MTN, AirtelTigo, Vodafone' },
];

export default function SimplePaymentWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: '',
    email: '',
    phone: '',
    method: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2;
      setPaymentStatus(success ? 'success' : 'error');
      if (success) {
        setCurrentStep(5);
      }
    }, 3000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Enter Payment Amount</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Amount (GHS)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-black">₵</span>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={paymentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+233 20 000 0000"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Select Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleInputChange('method', method.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    paymentData.method === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <h4 className="font-medium text-black">{method.name}</h4>
                      <p className="text-sm text-black">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Payment Details</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-black">Payment details form would appear here based on selected method.</p>
              <p className="text-sm text-black mt-2">Card form, bank details form, etc.</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Confirm Payment</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-black">Amount:</span>
                <span className="font-semibold">₵{paymentData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Email:</span>
                <span className="font-semibold">{paymentData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Phone:</span>
                <span className="font-semibold">{paymentData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Method:</span>
                <span className="font-semibold">
                  {paymentMethods.find(m => m.id === paymentData.method)?.name}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="text-black">Total:</span>
                <span className="text-xl font-bold text-blue-600">₵{paymentData.amount}</span>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {paymentStatus === 'success' ? (
                <span className="text-5xl text-green-600"></span>
              ) : (
                <span className="text-5xl text-red-600"></span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-black">
              {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
            </h3>
            <p className="text-black">
              {paymentStatus === 'success'
                ? 'Your payment has been processed successfully.'
                : 'There was an issue processing your payment. Please try again.'
              }
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return paymentData.amount && paymentData.email && paymentData.phone;
      case 2:
        return paymentData.method;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-black">Make Payment</h2>
          <p className="mt-2 text-sm text-black">Secure payment processing with AgaPay</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-4 py-2 text-black hover:text-gray-800"
                >
                  <span className="mr-2">←</span>
                  Back
                </button>
              )}
              <div className="flex-1" />
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center px-6 py-2 rounded-lg ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-black cursor-not-allowed'
                  }`}
                >
                  Next
                  <span className="ml-2">→</span>
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`flex items-center px-6 py-2 rounded-lg ${
                    isProcessing
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex flex-col items-center w-full">
                      <div className="w-full mb-2">
                        <LinearBuffer />
                      </div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay ₵${paymentData.amount}`
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}