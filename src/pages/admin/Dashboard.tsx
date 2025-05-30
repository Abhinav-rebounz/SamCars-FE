import React from 'react';
import { 
  BarChart, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Car,
  Clock
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
    {
      title: 'New Customers',
      value: '24',
      change: '+5.1%',
      trend: 'up',
      icon: <Users className="h-6 w-6 text-white" />,
      color: 'bg-purple-600',
    },
    {
      title: 'Appointments',
      value: '42',
      change: '-3.2%',
      trend: 'down',
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: 'bg-amber-600',
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

  const upcomingAppointments = [
    {
      id: '1',
      customer: 'Emily Davis',
      type: 'Test Drive',
      vehicle: '2022 BMW 3 Series',
      date: '2023-10-18',
      time: '10:00 AM',
    },
    {
      id: '2',
      customer: 'Robert Wilson',
      type: 'Service',
      vehicle: '2018 Ford F-150',
      date: '2023-10-19',
      time: '2:30 PM',
    },
    {
      id: '3',
      customer: 'Jennifer Lee',
      type: 'Test Drive',
      vehicle: '2021 Tesla Model 3',
      date: '2023-10-20',
      time: '11:15 AM',
    },
  ];

  const lowInventoryAlerts = [
    {
      id: '1',
      category: 'SUVs',
      current: 3,
      threshold: 5,
    },
    {
      id: '2',
      category: 'Electric Vehicles',
      current: 1,
      threshold: 3,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
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
        
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Upcoming Appointments</h2>
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
                      Type
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.customer}</div>
                        <div className="text-sm text-gray-500">{appointment.vehicle}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.type === 'Test Drive' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {appointment.type}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(appointment.date).toLocaleDateString()}</div>
                        <div>{appointment.time}</div>
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
        {/* Sales Chart */}
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
        
        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Low Inventory Alerts</h3>
                {lowInventoryAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start mb-3 bg-red-50 p-3 rounded-md">
                    <Car className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Low {alert.category} inventory
                      </p>
                      <p className="text-sm text-red-700">
                        Current: {alert.current} (Threshold: {alert.threshold})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Upcoming Tasks</h3>
                <div className="flex items-start mb-3 bg-yellow-50 p-3 rounded-md">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Monthly Inventory Report Due
                    </p>
                    <p className="text-sm text-yellow-700">
                      Due in 3 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;