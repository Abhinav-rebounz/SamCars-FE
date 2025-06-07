import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown,
  Home
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    {
      title: 'Total Revenue',
      value: '$128,430',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: 'bg-blue-600',
    },
    {
      title: 'Cars Sold',
      value: '38',
      change: '+8.2%',
      trend: 'up',
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      color: 'bg-green-600',
    },
  ];

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link 
          to="/" 
          className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Return to Home
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 w-full max-w-3xl">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-center">
                <div className={`rounded-md p-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-5">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    <span className={`ml-2 flex items-center text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
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
        ))}
      </div>
      
      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-md w-full max-w-3xl">
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
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {sale.customer}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {sale.vehicle}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-center">
                      {sale.amount}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
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
  );
};

export default Dashboard;