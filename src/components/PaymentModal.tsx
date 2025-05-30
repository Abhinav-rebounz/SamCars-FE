import React, { useState } from 'react';
import { DollarSign, Car, Wrench, X } from 'lucide-react';
import { vehicles } from '../data/vehicles';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [paymentType, setPaymentType] = useState<'reserve' | 'service'>('reserve');
  const [vin, setVin] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null);
  const [vinChecked, setVinChecked] = useState(false);

  const handleVinCheck = () => {
    if (vin.length !== 4) {
      setError('Please enter exactly 4 digits of the VIN');
      return;
    }

    // Find vehicle with matching last 4 digits of VIN
    const vehicle = vehicles.find(v => v.vin.slice(-4) === vin);
    
    if (!vehicle) {
      setError('No vehicle found with this VIN');
      setSelectedVehicle(null);
      setVinChecked(true);
      return;
    }

    if (vehicle.isSold) {
      setError('This vehicle is already sold');
      setSelectedVehicle(null);
      setVinChecked(true);
      return;
    }

    setSelectedVehicle(vehicle);
    setError('');
    setVinChecked(true);
    // Set default amount to 10% of vehicle price for reservation
    setAmount((vehicle.price * 0.1).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (paymentType === 'reserve') {
        if (!selectedVehicle) {
          throw new Error('Please check VIN first');
        }
      }

      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setVin('');
    setAmount('');
    setPaymentType('reserve');
    setSelectedVehicle(null);
    setVinChecked(false);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Make a Payment</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700 mb-4">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
              <p className="text-gray-600">
                {paymentType === 'reserve' 
                  ? 'Your vehicle reservation has been confirmed.' 
                  : 'Your service payment has been processed.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="form-label">Payment Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('reserve');
                      resetForm();
                    }}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                      paymentType === 'reserve'
                        ? 'border-blue-700 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-700'
                    }`}
                  >
                    <Car className={`h-6 w-6 mr-2 ${
                      paymentType === 'reserve' ? 'text-blue-700' : 'text-gray-500'
                    }`} />
                    <span className={paymentType === 'reserve' ? 'text-blue-700' : 'text-gray-700'}>
                      Reserve Vehicle
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType('service');
                      resetForm();
                    }}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                      paymentType === 'service'
                        ? 'border-blue-700 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-700'
                    }`}
                  >
                    <Wrench className={`h-6 w-6 mr-2 ${
                      paymentType === 'service' ? 'text-blue-700' : 'text-gray-500'
                    }`} />
                    <span className={paymentType === 'service' ? 'text-blue-700' : 'text-gray-700'}>
                      Pay for Service
                    </span>
                  </button>
                </div>
              </div>

              {paymentType === 'reserve' && (
                <div className="mb-6">
                  <label className="form-label">Last 4 Digits of VIN</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={vin}
                      onChange={(e) => {
                        setVin(e.target.value.toUpperCase());
                        setVinChecked(false);
                        setSelectedVehicle(null);
                        setError('');
                      }}
                      maxLength={4}
                      placeholder="Enter last 4 digits"
                      required
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleVinCheck}
                      className="btn-outline"
                    >
                      Check VIN
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    This helps us identify the vehicle you want to reserve
                  </p>

                  {/* Vehicle Details */}
                  {selectedVehicle && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Vehicle Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Vehicle:</span> {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Price:</span> ${selectedVehicle.price.toLocaleString()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>{' '}
                          <span className="text-green-700">Available</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6">
                <label className="form-label">Amount ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                {paymentType === 'reserve' && selectedVehicle && (
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum reservation amount: ${(selectedVehicle.price * 0.1).toLocaleString()}
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (paymentType === 'reserve' && !selectedVehicle)}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Make Payment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;