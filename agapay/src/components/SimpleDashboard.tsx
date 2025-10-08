'use client';

import { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDown } from 'lucide-react';


export default function SimpleDashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [isMounted, setIsMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [paymentsResponse, collectionsResponse] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/collections/my-collections')
      ]);

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        const successfulPayments = paymentsData.payments?.filter(p => p.status === 'success') || [];
        const totalRevenue = successfulPayments.reduce((sum: number, payment: any) => sum + payment.amount, 0);

        setDashboardData(prev => ({
          ...prev,
          totalRevenue,
          totalTransactions: successfulPayments.length,
          recentTransactions: successfulPayments.slice(0, 10)
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mx-auto"></div>
          <p className="mt-4 text-black">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AgaPay</h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Live
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Dropdown>
                <DropdownTrigger>
                  <button className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-black">
                    <span className="capitalize">
                      {timeRange === 'day' ? 'Today' :
                       timeRange === 'week' ? 'This Week' :
                       timeRange === 'month' ? 'This Month' :
                       'This Year'}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Time Range Selection">
                  <DropdownItem
                    key="day"
                    onClick={() => setTimeRange('day')}
                    className={timeRange === 'day' ? 'bg-red-50' : ''}
                  >
                    Today
                  </DropdownItem>
                  <DropdownItem
                    key="week"
                    onClick={() => setTimeRange('week')}
                    className={timeRange === 'week' ? 'bg-red-50' : ''}
                  >
                    This Week
                  </DropdownItem>
                  <DropdownItem
                    key="month"
                    onClick={() => setTimeRange('month')}
                    className={timeRange === 'month' ? 'bg-red-50' : ''}
                  >
                    This Month
                  </DropdownItem>
                  <DropdownItem
                    key="year"
                    onClick={() => setTimeRange('year')}
                    className={timeRange === 'year' ? 'bg-red-50' : ''}
                  >
                    This Year
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto">
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-600 text-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <p className="text-lg font-semibold text-white/95">Total Revenue</p>
              <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
                {dashboardData.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-green-300 mt-1">From all successful transactions</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <p className="text-sm font-medium text-black">Transactions</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                {dashboardData.totalTransactions}
              </p>
              <p className="text-xs sm:text-sm text-green-600 mt-1">Successful payments</p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-black">Chart Placeholder - Recharts needed</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-red-600 hover:text-red-800 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentTransactions.length > 0 ? (
                  dashboardData.recentTransactions.map((transaction: any) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₵{transaction.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{transaction.payment_method || 'Paystack'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-black">
                      No recent transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}