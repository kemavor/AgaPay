'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Collection {
  id: number;
  title: string;
  description?: string;
  target_amount?: number;
  current_amount: number;
  currency: string;
  status: string;
  is_public: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  created_by: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    email: '',
    phone: '',
    method: '',
    provider: '',
    collection_id: ''
  });

  useEffect(() => {
    // Check if a collection was passed via URL parameter
    const collectionId = searchParams.get('collection');
    if (collectionId) {
      // Fetch collection details
      const fetchCollection = async () => {
        try {
          const response = await fetch('/api/collections');
          if (!response.ok) return;
          const data = await response.json();
          const collection = data.collections?.find((c: Collection) => c.id === parseInt(collectionId));
          if (collection) {
            setSelectedCollection(collection);
            setFormData(prev => ({ ...prev, collection_id: collection.id.toString() }));
          }
        } catch (error) {
          console.error('Failed to fetch collection:', error);
        }
      };
      fetchCollection();
    }

    // Check if a collection was selected from the collections page (fallback)
    const storedCollection = localStorage.getItem('selectedCollection');
    if (storedCollection) {
      const collection = JSON.parse(storedCollection);
      setSelectedCollection(collection);
      setFormData(prev => ({ ...prev, collection_id: collection.id.toString() }));
      localStorage.removeItem('selectedCollection');
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-black text-lg font-semibold">Payment Information</h3>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Amount (GHS)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || parseFloat(value) >= 0) {
                    handleInputChange('amount', value);
                  }
                }}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
                placeholder="+233(0)00-000-0000"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-black text-lg font-semibold">Select Payment Method</h3>
            <div className="grid grid-cols-1 gap-4 text-black">
              <button
                onClick={() => handleInputChange('method', 'Mobile Money')}
                className={`p-4 border-2 rounded-lg text-left ${
                  formData.method === 'Mobile Money'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Mobile Money (MoMo)</div>
                <div className="text-sm text-black">MTN, Airtel-Tigo, Telecel</div>
              </button>

              <button
                onClick={() => handleInputChange('method', 'Bank Transfer')}
                className={`p-4 border-2 rounded-lg text-left ${
                  formData.method === 'Bank Transfer'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Bank Transfer</div>
                <div className="text-sm text-black">GTBank, Ecobank, Standard Chartered, Zenith, Fidelity, UBA</div>
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-black text-lg font-semibold">Select {formData.method === 'Mobile Money' ? 'Mobile Network' : 'Bank'}</h3>
            <div className="grid grid-cols-2 gap-3 text-black">
              {formData.method === 'Mobile Money'
                ? ['MTN', 'Airtel-Tigo', 'Telecel'].map((provider) => (
                    <button
                      key={provider}
                      onClick={() => handleInputChange('provider', provider)}
                      className={`p-3 border-2 rounded-lg text-center ${
                        formData.provider === provider
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {provider}
                    </button>
                  ))
                : ['GTBank', 'Ecobank', 'Standard Chartered', 'Zenith', 'Fidelity', 'UBA'].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => handleInputChange('provider', bank)}
                      className={`p-3 border-2 rounded-lg text-center ${
                        formData.provider === bank
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {bank}
                    </button>
                  ))
              }
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-black text-lg font-semibold">Confirm Payment</h3>
            <div className="bg-gray-50 p-4 text-black rounded-lg">
              <p><strong>Amount:</strong> ₵{formData.amount}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Method:</strong> {formData.method}</p>
              {formData.provider && <p><strong>{formData.method === 'Mobile Money' ? 'Network' : 'Bank'}:</strong> {formData.provider}</p>}
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
          <h1 className="text-3xl font-bold text-black">Make Payment</h1>
          <p className="text-black">Secure payment processing with AgaPay</p>
          {selectedCollection && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-900">{selectedCollection.title}</h3>
              {selectedCollection.description && (
                <p className="text-sm text-red-700 mt-1">{selectedCollection.description}</p>
              )}
              {selectedCollection.target_amount && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-red-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.min((selectedCollection.current_amount / selectedCollection.target_amount) * 100, 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${Math.min((selectedCollection.current_amount / selectedCollection.target_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-red-600 mt-1">
                    <span>{formatCurrency(selectedCollection.current_amount, selectedCollection.currency)}</span>
                    <span>{formatCurrency(selectedCollection.target_amount, selectedCollection.currency)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(currentStep / 4) * 100}%` }}
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
                className="px-4 py-2 text-black hover:text-gray-800"
              >
                Back
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={
                  !formData.amount ||
                  !formData.email ||
                  !formData.phone ||
                  (currentStep === 2 && !formData.method) ||
                  (currentStep === 3 && !formData.provider)
                }
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => alert('Payment processed successfully!')}
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Pay ₵{formData.amount}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}