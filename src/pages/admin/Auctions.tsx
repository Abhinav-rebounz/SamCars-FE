import React, { useState } from 'react';
import { 
  Gavel, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const Auctions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('purchaseDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<any | null>(null);
  
  // Mock data for auction purchases
  const auctions = [
    {
      id: '1',
      vehicle: '2020 Toyota Camry',
      vin: '4T1BF1FK5LU123456',
      purchaseDate: '2023-09-15',
      auctionHouse: 'Auto Auction Inc.',
      purchasePrice: 18500,
      transportCost: 350,
      repairCost: 1200,
      totalInvestment: 20050,
      listPrice: 22500,
      soldPrice: 22000,
      status: 'Sold',
      profit: 1950,
      notes: 'Minor body damage repaired. New tires installed.',
    },
    {
      id: '2',
      vehicle: '2021 Honda CR-V',
      vin: '7FARW2H52ME123456',
      purchaseDate: '2023-09-28',
      auctionHouse: 'City Auto Auction',
      purchasePrice: 24000,
      transportCost: 400,
      repairCost: 800,
      totalInvestment: 25200,
      listPrice: 28900,
      soldPrice: null,
      status: 'Listed',
      profit: 3700,
      notes: 'Excellent condition. Only needed minor detailing.',
    },
    {
      id: '3',
      vehicle: '2019 Ford F-150',
      vin: '1FTEW1EP3KFA12345',
      purchaseDate: '2023-08-20',
      auctionHouse: 'Truck Auction Co.',
      purchasePrice: 26000,
      transportCost: 500,
      repairCost: 2200,
      totalInvestment: 28700,
      listPrice: 32000,
      soldPrice: 31500,
      status: 'Sold',
      profit: 2800,
      notes: 'Needed new brakes and exhaust system repair.',
    },
    {
      id: '4',
      vehicle: '2022 BMW 3 Series',
      vin: 'WBA5R7C54LFH12345',
      purchaseDate: '2023-10-01',
      auctionHouse: 'Luxury Auto Auction',
      purchasePrice: 36000,
      transportCost: 450,
      repairCost: 1500,
      totalInvestment: 37950,
      listPrice: 42500,
      soldPrice: null,
      status: 'In Preparation',
      profit: 4550,
      notes: 'Minor interior repairs needed. Waiting for parts.',
    },
  ];
  
  // Filter auctions based on search term and filters
  const filteredAuctions = auctions.filter(auction => {
    const searchString = `${auction.vehicle} ${auction.vin} ${auction.auctionHouse}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || auction.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort auctions
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];
    
    // Handle date strings
    if (sortField === 'purchaseDate' || sortField === 'soldDate') {
      aValue = new Date(aValue || '1970-01-01').getTime();
      bValue = new Date(bValue || '1970-01-01').getTime();
    }
    
    // Handle numeric values
    if (['purchasePrice', 'totalInvestment', 'listPrice', 'soldPrice', 'profit'].includes(sortField)) {
      aValue = parseFloat(aValue?.toString() || '0');
      bValue = parseFloat(bValue?.toString() || '0');
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
  
  const handleViewAuction = (auction: any) => {
    setSelectedAuction(auction);
    setShowDetailModal(true);
  };
  
  const calculateTotalInvestment = (purchase: number, transport: number, repair: number) => {
    return purchase + transport + repair;
  };
  
  const calculateProfit = (soldPrice: number | null, totalInvestment: number) => {
    return soldPrice ? soldPrice - totalInvestment : 0;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Auction to Sale Tracker</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Auction Purchase
        </button>
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
                placeholder="Search vehicles..."
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
                <option value="in preparation">In Preparation</option>
                <option value="listed">Listed</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Investment</p>
              <p className="text-2xl font-bold text-gray-900">
                ${auctions.reduce((sum, auction) => sum + auction.totalInvestment, 0).toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Profit</p>
              <p className="text-2xl font-bold text-green-600">
                ${auctions.reduce((sum, auction) => sum + auction.profit, 0).toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Vehicles Purchased</p>
              <p className="text-2xl font-bold text-gray-900">{auctions.length}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
              <Gavel className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Vehicles Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {auctions.filter(auction => auction.status === 'Sold').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auctions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('vehicle')}
                >
                  <div className="flex items-center">
                    Vehicle
                    {sortField === 'vehicle' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purchaseDate')}
                >
                  <div className="flex items-center">
                    Purchase Date
                    {sortField === 'purchaseDate' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purchasePrice')}
                >
                  <div className="flex items-center">
                    Purchase Price
                    {sortField === 'purchasePrice' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalInvestment')}
                >
                  <div className="flex items-center">
                    Total Investment
                    {sortField === 'totalInvestment' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('listPrice')}
                >
                  <div className="flex items-center">
                    List Price
                    {sortField === 'listPrice' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('soldPrice')}
                >
                  <div className="flex items-center">
                    Sold Price
                    {sortField === 'soldPrice' && (
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
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('profit')}
                >
                  <div className="flex items-center">
                    Profit
                    {sortField === 'profit' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAuctions.map((auction) => (
                <tr key={auction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{auction.vehicle}</div>
                    <div className="text-sm text-gray-500">VIN: {auction.vin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(auction.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${auction.purchasePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${auction.totalInvestment.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${auction.listPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {auction.soldPrice ? `$${auction.soldPrice.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      auction.status === 'Sold' 
                        ? 'bg-green-100 text-green-800' 
                        : auction.status === 'Listed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${auction.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleViewAuction(auction)}
                      className="text-blue-700 hover:text-blue-800 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Auctions;