import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Download, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  FileText
} from 'lucide-react';
import { fetchPayments, addManualPayment } from '../../services/payments';

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
  const [addForm, setAddForm] = useState({ user_id: '', amount: '', payment_method: '', description: '', status: 'completed', date: '', });
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const [addFormLoading, setAddFormLoading] = useState(false);

  const fetchAllPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPayments();
      if (response.success && response.data && Array.isArray(response.data.data)) {
        setPayments(response.data.data);
      } else {
        setError(response.error || 'Failed to fetch payments');
      }
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPayments();
  }, []);
  
  // Filter payments based on search term and filters
  const filteredPayments = payments.filter(payment => {
    const searchString = `${payment.customer} ${payment.description} ${payment.transactionId}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === 'all' || payment.type.toLowerCase() === filterType.toLowerCase();
    
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                    <div className="text-sm text-gray-500">{payment.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.description}</div>
                    <div className="text-sm text-gray-500">{payment.type}</div>
                      {payment.is_manual && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Manual</span>
                      )}
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
                      onClick={() => handleViewPayment(payment)}
                      className="text-blue-700 hover:text-blue-800 mr-3"
                    >
                      View
                    </button>
                    <button className="text-blue-700 hover:text-blue-800">
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
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DollarSign className="h-6 w-6 text-blue-700" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Payment Details
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Transaction ID: {selectedPayment.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-4 border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                      <p className="text-sm font-medium text-gray-900 mt-1">{selectedPayment.customer}</p>
                      <p className="text-sm text-gray-600">{selectedPayment.email}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Payment Details</h4>
                      <p className="text-sm text-gray-900 mt-1">
                        <span className="font-medium">Type:</span> {selectedPayment.type}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Description:</span> {selectedPayment.description}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Amount:</span> ${selectedPayment.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Date:</span> {new Date(selectedPayment.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Payment Method:</span> {selectedPayment.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          selectedPayment.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : selectedPayment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedPayment.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => window.open('#', '_blank')}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-700 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <FileText className="h-5 w-5 mr-1" />
                  View Receipt
                </button>
                {selectedPayment.status === 'Completed' && (
                  <button
                    type="button"
                    onClick={handleRefund}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <RefreshCw className="h-5 w-5 mr-1" />
                    Process Refund
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 4. Add Add Manual Payment Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setAddFormError(null);
                setAddFormLoading(true);
                if (!addForm.user_id || !addForm.amount || !addForm.payment_method || !addForm.description || !addForm.status) {
                  setAddFormError('All fields are required.');
                  setAddFormLoading(false);
                  return;
                }
                const response = await addManualPayment({
                  user_id: addForm.user_id,
                  amount: parseFloat(addForm.amount),
                  payment_method: addForm.payment_method,
                  description: addForm.description,
                  status: addForm.status,
                  date: addForm.date,
                });
                if (response.success) {
                  setShowAddModal(false);
                  setAddForm({ user_id: '', amount: '', payment_method: '', description: '', status: 'completed', date: '', });
                  fetchAllPayments();
                } else {
                  setAddFormError(response.error || 'Failed to add manual payment');
                }
                setAddFormLoading(false);
              }} className="p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Add Manual Payment</h2>
                {addFormError && <div className="text-red-500 bg-red-50 border border-red-200 rounded p-2">{addFormError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID *</label>
                  <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={addForm.user_id} onChange={e => setAddForm(f => ({ ...f, user_id: e.target.value }))} required disabled={addFormLoading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount *</label>
                  <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={addForm.amount} onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))} required disabled={addFormLoading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
                  <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={addForm.payment_method} onChange={e => setAddForm(f => ({ ...f, payment_method: e.target.value }))} required disabled={addFormLoading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} required disabled={addFormLoading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status *</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={addForm.status} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))} required disabled={addFormLoading}>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={addForm.date} onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))} disabled={addFormLoading} />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" disabled={addFormLoading}>{addFormLoading ? 'Adding...' : 'Add Payment'}</button>
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