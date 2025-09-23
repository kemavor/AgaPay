'use client';

import { useState } from 'react';

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    email: '',
    phone: '',
    method: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (GHS)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="+233 000 000 0000"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-black text-lg font-semibold">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Card', 'Bank Transfer', 'USSD', 'QR Code'].map((method) => (
                <button
                  key={method}
                  onClick={() => handleInputChange('method', method)}
                  className={`p-4 border-2 rounded-lg text-center ${
                    formData.method === method
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Confirm Payment</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Amount:</strong> ₦{formData.amount}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Method:</strong> {formData.method}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Make Payment</h1>
          <p className="text-gray-600">Secure payment processing with AgaPay</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            {renderStep()}
          </div>

          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!formData.amount || !formData.email || !formData.phone || (currentStep === 2 && !formData.method)}
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => alert('Payment processed successfully!')}
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Pay ₦{formData.amount}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}