import React, { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStats } from '../../services/dashboard';
import DashboardCharts from '../../components/admin/DashboardCharts';
import {
  DollarSign,
  ShoppingBag,
  Car,
  Users,
  TrendingUp,
  CreditCard,
  Calendar,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboardStats();
        
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.error || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Dashboard Error</h3>
              <p className="mt-2 text-red-700">{error || 'Failed to load dashboard data'}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Core business metrics - only the most important ones
  const coreMetrics = [
    {
      title: 'Total Revenue',
      value: `$${dashboardData.summary.total_revenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-blue-600',
      subtitle: `$${dashboardData.summary.revenue_this_month.toLocaleString()} this month`
    },
    {
      title: 'Total Vehicles',
      value: dashboardData.summary.total_vehicles.toString(),
      icon: <Car className="h-6 w-6" />,
      color: 'bg-green-600',
      subtitle: `${dashboardData.summary.available_vehicles} available`
    },
    {
      title: 'Total Users',
      value: dashboardData.summary.total_users.toString(),
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-700',
      subtitle: `${dashboardData.summary.new_users_this_month} new this month`
    },
    {
      title: 'Auction Profit',
      value: `$${dashboardData.summary.auction_profit.toLocaleString()}`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-green-700',
      subtitle: `$${dashboardData.summary.auction_investment.toLocaleString()} invested`
    }
  ];

  // Secondary metrics - simplified
  const secondaryMetrics = [
    {
      title: 'Payments',
      value: dashboardData.summary.total_payments.toString(),
      icon: <CreditCard className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Sold',
      value: dashboardData.summary.sold_vehicles.toString(),
      icon: <ShoppingBag className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Appointments',
      value: dashboardData.summary.total_appointments.toString(),
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Test Drives',
      value: dashboardData.summary.test_drives.toString(),
      icon: <Eye className="h-5 w-5" />,
      color: 'text-green-700',
      bgColor: 'bg-green-50'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Business overview and key metrics
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            {new Date(dashboardData.date_range.from).toLocaleDateString()} - {new Date(dashboardData.date_range.to).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <DashboardCharts 
        salesChart={dashboardData.sales_chart}
        inventoryBreakdown={dashboardData.inventory_breakdown}
      />

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dashboardData.recent_activity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'payment' && <div className="p-2 bg-green-100 rounded-lg"><CreditCard className="h-4 w-4 text-green-600" /></div>}
                  {activity.type === 'vehicle' && <div className="p-2 bg-blue-100 rounded-lg"><Car className="h-4 w-4 text-blue-600" /></div>}
                  {activity.type === 'auction' && <div className="p-2 bg-amber-100 rounded-lg"><TrendingUp className="h-4 w-4 text-amber-600" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts - Only show if there are critical alerts */}
      {dashboardData.alerts.filter(alert => alert.priority === 'critical' || alert.priority === 'high').length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Important Alerts</h2>
              <AlertTriangle className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {dashboardData.alerts
                .filter(alert => alert.priority === 'critical' || alert.priority === 'high')
                .slice(0, 3)
                .map((alert) => (
                <div key={alert.alert_id} className={`p-4 rounded-lg border-l-4 ${
                  alert.priority === 'critical' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {alert.priority === 'critical' ? 
                        <AlertTriangle className="h-5 w-5 text-red-500" /> : 
                        <Clock className="h-5 w-5 text-orange-500" />
                      }
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
