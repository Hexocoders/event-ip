'use client';

import { useState } from 'react';
import { FiDownload, FiCreditCard, FiDollarSign, FiCalendar } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2024-03-01',
    description: 'Rock Concert Ticket Sales',
    amount: 1250.00,
    status: 'completed',
    paymentMethod: 'Visa ending in 4242'
  },
  {
    id: '2',
    date: '2024-02-28',
    description: 'Jazz Festival Revenue',
    amount: 890.50,
    status: 'completed',
    paymentMethod: 'PayPal'
  },
  {
    id: '3',
    date: '2024-02-27',
    description: 'Event Promotion Fee',
    amount: -50.00,
    status: 'completed',
    paymentMethod: 'Account Balance'
  },
  {
    id: '4',
    date: '2024-02-26',
    description: 'Ticket Refund - Order #12345',
    amount: -75.00,
    status: 'pending',
    paymentMethod: 'Original Payment Method'
  }
];

export default function PaymentPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const totalEarnings = MOCK_TRANSACTIONS
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = MOCK_TRANSACTIONS
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 pt-16">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Payments</h1>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center">
              <FiDownload className="mr-2" />
              Download Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FiDollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-sm text-gray-500">Total Earnings</div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalEarnings.toFixed(2)}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FiCreditCard className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-sm text-gray-500">Pending Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ${pendingAmount.toFixed(2)}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiCalendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-sm text-gray-500">Next Payout Date</div>
              <div className="text-2xl font-bold text-gray-900">Mar 15, 2024</div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                  <option value="day">Today</option>
                </select>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOCK_TRANSACTIONS.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 