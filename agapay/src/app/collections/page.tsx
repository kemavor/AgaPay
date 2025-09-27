'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import LinearBuffer from '@/components/LinearBuffer';

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

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      } else {
        setError('Failed to fetch collections');
      }
    } catch (err) {
      setError('Error fetching collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (collection: Collection) => {
    // Store selected collection in localStorage for payment page
    localStorage.setItem('selectedCollection', JSON.stringify(collection));
    router.push('/payment');
  };

  const calculateProgress = (current: number, target?: number) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4">
            <div className="loader mx-auto"></div>
          </div>
          <p className="text-black">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={fetchCollections}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Collections</h1>
              <p className="mt-2 text-black">Browse and contribute to various payment collections</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-black hover:text-gray-800"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">C</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Collections Available</h3>
            <p className="text-black">There are no active collections at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCollectionClick(collection)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{collection.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    collection.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : collection.status === 'inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {collection.status}
                  </span>
                </div>

                {collection.description && (
                  <p className="text-black text-sm mb-4 line-clamp-3">
                    {collection.description}
                  </p>
                )}

                <div className="space-y-3">
                  {collection.target_amount && (
                    <div>
                      <div className="flex justify-between text-sm text-black mb-1">
                        <span>Progress</span>
                        <span>{calculateProgress(collection.current_amount, collection.target_amount).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(collection.current_amount, collection.target_amount)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-black mt-1">
                        <span>{formatCurrency(collection.current_amount, collection.currency)}</span>
                        <span>{formatCurrency(collection.target_amount, collection.currency)}</span>
                      </div>
                    </div>
                  )}

                  {!collection.target_amount && (
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(collection.current_amount, collection.currency)}
                      </p>
                      <p className="text-sm text-black">Raised</p>
                    </div>
                  )}

                  <div className="text-xs text-black">
                    Created: {new Date(collection.created_at).toLocaleDateString()}
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Contribute Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}