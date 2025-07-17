import React, { useEffect, useState } from 'react';
import { api, API_ENDPOINTS } from '../../config/api';
import { AxiosError } from 'axios';
import {
  DollarSign,
  ShoppingBag,
  Car,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface DashboardData {
  summary: {
    total_investment: number;
    total_profit: number;
    vehicles_purchased: number;
    vehicles_sold: number;
    avg_days_to_sell: string;
  };
  age_analysis: Array<{
    age_range: string;
    count: number;
    total_investment: string;
  }>;
  recent_transactions: Array<{
    auction_id: number;
    purchase_date: string;
    purchase_price: string;
    sold_price: string | null;
    make: string;
    model: string;
    year: number;
    status: string;
  }>;
  profit_by_month: Array<{
    month: string;
    vehicles_purchased: string;
    vehicles_sold: string;
    total_purchase_amount: string;
    total_sales_amount: string;
    profit: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(API_ENDPOINTS.AUCTION_DASHBOARD_SUMMARY);
        
        if (response.data?.status === 'success') {
          setDashboardData(response.data.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        const axiosError = error as AxiosError;
        setError(axiosError.response?.data?.message || 'An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <div className="ml-3">
              <p className="text-red-700">{error || 'Failed to load dashboard'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Investment',
      value: `$${dashboardData.summary.total_investment.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: 'bg-blue-600',
    },
    {
      title: 'Total Profit',
      value: `$${dashboardData.summary.total_profit.toLocaleString()}`,
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      color: 'bg-green-600',
    },
    {
      title: 'Vehicles Purchased',
      value: dashboardData.summary.vehicles_purchased.toString(),
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      color: 'bg-purple-600',
    },
    {
      title: 'Vehicles Sold',
      value: dashboardData.summary.vehicles_sold.toString(),
      icon: <Car className="h-6 w-6 text-white" />,
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`rounded-md p-3 ${stat.color}`}>{stat.icon}</div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Average Days to Sell */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Average Days to Sell</h2>
          <div className="flex items-center text-2xl font-bold text-blue-600">
            <Clock className="h-6 w-6 mr-2" />
            {dashboardData.summary.avg_days_to_sell} days
          </div>
        </div>
      </div>

      {/* Age Analysis */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Inventory Age Analysis</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Investment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.age_analysis.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.age_range}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parseFloat(item.total_investment).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recent_transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.year} {transaction.make} {transaction.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.purchase_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parseFloat(transaction.purchase_price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'sold' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status}
                      </span>
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
};

export default Dashboard;
