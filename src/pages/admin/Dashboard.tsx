import React, { useEffect, useState } from 'react';
import { api, API_ENDPOINTS } from '../../config/api';
import { AxiosError } from 'axios';
import {
  BarChart,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Car,
  Clock,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const recentSales = [
    {
      id: '1',
      customer: 'John Smith',
      vehicle: '2020 Toyota Camry',
      amount: '$22,500',
      date: '2023-10-15',
    },
    {
      id: '2',
      customer: 'Sarah Johnson',
      vehicle: '2021 Honda CR-V',
      amount: '$28,900',
      date: '2023-10-12',
    },
    {
      id: '3',
      customer: 'Michael Brown',
      vehicle: '2019 Ford F-150',
      amount: '$32,000',
      date: '2023-10-10',
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.AUCTION_DASHBOARD, { params: {} });
        const summary = response.data?.data?.summary;

        if (summary) {
          const { total_investment, total_profit, vehicles_purchased, vehicles_sold } = summary;

          const statCards = [
            {
              title: 'Total Investment',
              value: `$${Number(total_investment.amount).toLocaleString()}`,
              change: '+0.0%',
              trend: 'up',
              icon: <DollarSign className="h-6 w-6 text-white" />,
              color: 'bg-blue-600',
            },
            {
              title: 'Total Profit',
              value: `$${Number(total_profit.amount).toLocaleString()}`,
              change: '+0.0%',
              trend: 'up',
              icon: <TrendingUp className="h-6 w-6 text-white" />,
              color: 'bg-green-600',
            },
            {
              title: 'Vehicles Purchased',
              value: vehicles_purchased.toString(),
              change: '+0.0%',
              trend: 'up',
              icon: <ShoppingBag className="h-6 w-6 text-white" />,
              color: 'bg-purple-600',
            },
            {
              title: 'Vehicles Sold',
              value: vehicles_sold.toString(),
              change: '+0.0%',
              trend: vehicles_sold > 0 ? 'up' : 'down',
              icon: <Car className="h-6 w-6 text-white" />,
              color: 'bg-amber-600',
            },
          ];

          setStats(statCards);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <p className="col-span-4 text-center text-gray-500">Loading stats...</p>
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`rounded-md p-3 ${stat.color}`}>{stat.icon}</div>
                  <div className="ml-5">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                      <span
                        className={`ml-2 flex items-center text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Sales</h2>
              <a href="#" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                View all
              </a>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.customer}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.vehicle}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {sale.amount}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-md lg:col-span-2">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Sales Overview</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <BarChart className="h-16 w-16 text-gray-300" />
              <span className="ml-4 text-gray-500">Sales chart will be displayed here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
