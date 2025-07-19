import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Download, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  FileText,
  Plus,
  X,
  User,
  Calendar,
  CreditCard,
  FileText as FileTextIcon
} from 'lucide-react';
import { fetchPayments, addManualPayment } from '../../services/payments';
import { fetchAllUsers } from '../../services/user';

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  
  // 2. Replace mock payments data with real data and loading/error state
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ 
    user_id: '', 
    amount: '', 
    payment_method: 'cash', 
    description: '', 
    status: 'completed', 
    date: new Date().toISOString().split('T')[0],
    type: 'service'
  });
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchAllPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPayments();
      if (response.success && response.data && Array.isArray(response.data.payments)) {
        setPayments(response.data.payments);
      } else {
        setError(response.error || 'Failed to fetch payments');
      }
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      console.log('Fetching users...');
      const token = localStorage.getItem('accessToken');
      console.log('Auth token exists:', !!token);
      
      const response = await fetchAllUsers();
      console.log('Users API response:', response);
      
      if (response.success) {
        console.log('Fetched users:', response.users);
        setUsers(response.users);
      } else {
        console.error('Failed to fetch users:', response.error);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPayments();
    fetchUsers();
  }, []);
  
  // Filter payments based on search term and filters
  const filteredPayments = payments.filter(payment => {
    const searchString = `${payment.customer} ${payment.description} ${payment.transactionId}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status.toLowerCase() === filterStatus.toLowerCase();
    
    // Enhanced type filtering
    let matchesType = true;
    if (filterType !== 'all') {
      if (filterType === 'stripe') {
        matchesType = payment.is_stripe === true;
      } else {
        matchesType = payment.type.toLowerCase() === filterType.toLowerCase();
      }
    }
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];
    
    // Handle date strings
    if (sortField === 'date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // Handle numeric values
    if (sortField === 'amount') {
      aValue = parseFloat(aValue.toString());
      bValue = parseFloat(bValue.toString());
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
  };
  
  const handleRefund = () => {
    // In a real app, this would process a refund
    alert(`Refund processed for payment ${selectedPayment?.id}`);
    setSelectedPayment(null);
  };
  
  const handleExport = () => {
    // In a real app, this would export payment data
    alert('Exporting payment data...');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Manager</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Manual Payment
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="vehicle hold">Vehicle Hold</option>
                <option value="vehicle purchase">Vehicle Purchase</option>
                <option value="service">Service</option>
                <option value="stripe">Stripe Payments</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {/* 6. Add skeleton loader, empty, and error states for the payments table */}
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading payments...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : !loading && payments.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No payments found.</div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('customer')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortField === 'customer' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center">
                    Description
                    {sortField === 'description' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.map((payment) => (
                <tr 
                  key={payment.id}
                  onClick={() => handleViewPayment(payment)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                    <div className="text-sm text-gray-500">{payment.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.description}</div>
                    <div className="text-sm text-gray-500 capitalize">{payment.type}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {payment.is_manual && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Manual</span>
                      )}
                      {payment.is_stripe && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800">Stripe</span>
                      )}
                      {payment.vehicle && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                          {payment.vehicle.year} {payment.vehicle.make} {payment.vehicle.model}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : payment.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(payment.receiptUrl || '#', '_blank');
                      }}
                      className="text-blue-700 hover:text-blue-800"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedPayments.length}</span> of{' '}
                <span className="font-medium">{sortedPayments.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronUp className="h-5 w-5 rotate-90" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-700">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-white">
                        Payment Details
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Payment ID: #{selectedPayment.id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Payment Status Banner */}
                <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                  selectedPayment.status === 'completed' 
                    ? 'bg-green-50 border-green-400' 
                    : selectedPayment.status === 'pending'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      selectedPayment.status === 'completed' 
                        ? 'bg-green-100' 
                        : selectedPayment.status === 'pending'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      {selectedPayment.status === 'completed' ? (
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : selectedPayment.status === 'pending' ? (
                        <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${
                        selectedPayment.status === 'completed' 
                          ? 'text-green-800' 
                          : selectedPayment.status === 'pending'
                          ? 'text-yellow-800'
                          : 'text-red-800'
                      }`}>
                        Payment {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                      </h3>
                      <p className={`text-sm ${
                        selectedPayment.status === 'completed' 
                          ? 'text-green-700' 
                          : selectedPayment.status === 'pending'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {selectedPayment.status === 'completed' 
                          ? 'Payment has been successfully processed'
                          : selectedPayment.status === 'pending'
                          ? 'Payment is being processed'
                          : 'Payment has been refunded'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="mb-6 text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    ${selectedPayment.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedPayment.currency || 'USD'}
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Customer Name</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPayment.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedPayment.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Payment Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{selectedPayment.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Type</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{selectedPayment.type}</p>
                      </div>
                      {selectedPayment.transactionId && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Transaction ID</p>
                          <p className="text-sm font-mono text-gray-900">{selectedPayment.transactionId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h12v6H6V6z" clipRule="evenodd" />
                    </svg>
                    Payment Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Description</p>
                      <p className="text-sm font-medium text-gray-900">{selectedPayment.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedPayment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {selectedPayment.is_manual && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Entry Type</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Manual Entry
                        </span>
                      </div>
                    )}
                    {selectedPayment.is_stripe && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Gateway</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Stripe Payment
                        </span>
                      </div>
                    )}
                    {selectedPayment.vehicle && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Vehicle</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedPayment.vehicle.year} {selectedPayment.vehicle.make} {selectedPayment.vehicle.model}
                          {selectedPayment.vehicle.stockNumber && (
                            <span className="text-gray-500 ml-2">(Stock #{selectedPayment.vehicle.stockNumber})</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                {selectedPayment.receiptUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(selectedPayment.receiptUrl, '_blank')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Receipt
                  </button>
                )}
                {selectedPayment.status === 'completed' && (
                  <button
                    type="button"
                    onClick={handleRefund}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Process Refund
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Manual Payment Modal */}
      {showAddModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-white">
                        Add Manual Payment
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Record a payment manually for a customer
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setAddFormError(null);
                setAddFormLoading(true);
                
                console.log('Form validation - user_id:', addForm.user_id, 'type:', typeof addForm.user_id);
                console.log('Form validation - amount:', addForm.amount);
                console.log('Form validation - payment_method:', addForm.payment_method);
                console.log('Form validation - description:', addForm.description);
                console.log('Form validation - status:', addForm.status);
                
                if (!addForm.user_id || !addForm.amount || !addForm.payment_method || !addForm.description || !addForm.status) {
                  setAddFormError('All required fields must be filled.');
                  setAddFormLoading(false);
                  return;
                }
                
                // Convert payment type to appropriate IDs
                let vehicle_id = null;
                let service_id = null;
                
                if (addForm.type === 'vehicle_hold' || addForm.type === 'vehicle_purchase') {
                  // For vehicle payments, we'll need to get the vehicle ID from the description or add it later
                  // For now, we'll just use the description to indicate the type
                  vehicle_id = null; // This would need to be implemented based on your business logic
                } else if (addForm.type === 'service') {
                  service_id = null; // This would need to be implemented based on your business logic
                }
                
                // Validate user_id is a number
                const userId = parseInt(addForm.user_id);
                if (isNaN(userId)) {
                  setAddFormError('Please select a valid customer.');
                  setAddFormLoading(false);
                  return;
                }

                const paymentData = {
                  user_id: userId,
                  amount: parseFloat(addForm.amount),
                  payment_method: addForm.payment_method,
                  description: addForm.description,
                  status: addForm.status,
                  date: addForm.date,
                  vehicle_id: vehicle_id,
                  service_id: service_id
                };
                
                console.log('Sending payment data:', paymentData);
                const response = await addManualPayment(paymentData);
                console.log('Payment response:', response);
                
                if (response.success) {
                  setShowAddModal(false);
                  setAddForm({ 
                    user_id: '', 
                    amount: '', 
                    payment_method: 'cash', 
                    description: '', 
                    status: 'completed', 
                    date: new Date().toISOString().split('T')[0],
                    type: 'service'
                  });
                  fetchAllPayments();
                } else {
                  setAddFormError(response.error || 'Failed to add manual payment');
                }
                setAddFormLoading(false);
              }} className="p-6">
                
                {addFormError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{addFormError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Customer *
                    </label>
                    <select 
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      value={addForm.user_id} 
                      onChange={e => {
                        console.log('Selected user_id:', e.target.value);
                        setAddForm(f => ({ ...f, user_id: e.target.value }));
                      }} 
                      required 
                      disabled={addFormLoading || usersLoading}
                    >
                      <option value="">Select a customer ({users.length} users loaded)</option>
                      {users.map(user => {
                        console.log('User data:', user);
                        return (
                          <option key={user.userId || user.user_id} value={user.userId || user.user_id}>
                            {user.displayName || user.email}
                          </option>
                        );
                      })}
                    </select>
                    {usersLoading && (
                      <p className="mt-1 text-sm text-gray-500">Loading customers...</p>
                    )}
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0"
                        className="block w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" 
                        value={addForm.amount} 
                        onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))} 
                        required 
                        disabled={addFormLoading}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      Payment Method *
                    </label>
                    <select 
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      value={addForm.payment_method} 
                      onChange={e => setAddForm(f => ({ ...f, payment_method: e.target.value }))} 
                      required 
                      disabled={addFormLoading}
                    >
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="check">Check</option>
                      <option value="money_order">Money Order</option>
                    </select>
                  </div>

                  {/* Payment Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FileTextIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Payment Type *
                    </label>
                    <select 
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      value={addForm.type} 
                      onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))} 
                      required 
                      disabled={addFormLoading}
                    >
                      <option value="service">Service</option>
                      <option value="vehicle_hold">Vehicle Hold</option>
                      <option value="vehicle_purchase">Vehicle Purchase</option>
                      <option value="deposit">Deposit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Status *
                    </label>
                    <select 
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      value={addForm.status} 
                      onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))} 
                      required 
                      disabled={addFormLoading}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Date
                    </label>
                    <input 
                      type="date" 
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" 
                      value={addForm.date} 
                      onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))} 
                      disabled={addFormLoading}
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FileTextIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Description *
                    </label>
                    <textarea 
                      className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 resize-none" 
                      rows={3}
                      value={addForm.description} 
                      onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} 
                      required 
                      disabled={addFormLoading}
                      placeholder="Enter payment description..."
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addFormLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {addFormLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Payment...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;