import React, { useState } from 'react';
import { X, Eye, RefreshCw } from 'lucide-react';
import { Payment } from '../../services/payment';

interface PaymentDetailsModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onRefund: (reason: string) => Promise<void>;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  isOpen,
  onClose,
  onRefund
}) => {
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);

  if (!isOpen || !payment) return null;

  const handleRefund = async () => {
    try {
      setIsRefunding(true);
      await onRefund(refundReason);
      onClose();
    } catch (error) {
      console.error('Refund failed:', error);
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              payment.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Customer Name</span>
              <p className="mt-1">{payment.customerName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="mt-1">{payment.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Amount</span>
              <p className="mt-1">${payment.amount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Date</span>
              <p className="mt-1">{new Date(payment.date).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Method</span>
              <p className="mt-1">{payment.paymentMethod}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Transaction ID</span>
              <p className="mt-1">{payment.transactionId || 'N/A'}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-sm font-medium text-gray-500">Description</span>
            <p className="mt-1">{payment.description || 'No description provided'}</p>
          </div>

          {/* Payment Proof */}
          {payment.paymentProof && (
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Proof</span>
              <div className="mt-2">
                <button
                  onClick={() => setShowImagePreview(true)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Eye className="h-5 w-5 mr-1" />
                  View Image
                </button>
              </div>
            </div>
          )}

          {/* Refund Section */}
          {payment.status === 'completed' && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Process Refund</h3>
              <div className="space-y-3">
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
                <button
                  onClick={handleRefund}
                  disabled={isRefunding || !refundReason.trim()}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isRefunding ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Process Refund'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && payment.paymentProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowImagePreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <img
              src={payment.paymentProof}
              alt="Payment Proof"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsModal; 