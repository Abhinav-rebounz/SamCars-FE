import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Car, ArrowLeft, RefreshCcw } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await verifyEmail(token);
        if (response.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          // Update user state to reflect verified email
          setUser(currentUser => currentUser ? {
            ...currentUser,
            emailVerified: true
          } : null);
        } else {
          setStatus('error');
          setMessage(response.message || 'Failed to verify email.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email.');
      }
    };

    verifyToken();
  }, [searchParams, setUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex items-center flex-shrink-0">
              <Car className="h-8 w-8 text-blue-700" />
              <span className="ml-2 text-2xl font-bold text-blue-700">SaamCars</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Status Icon */}
            <div className="p-8 flex flex-col items-center">
              <div className="mb-6">
                {status === 'loading' && (
                  <div className="relative">
                    <RefreshCcw className="h-12 w-12 text-blue-600 animate-spin" />
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="bg-red-100 rounded-full p-3">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                {status === 'loading' && 'Verifying Email'}
                {status === 'success' && 'Email Verified!'}
                {status === 'error' && 'Verification Failed'}
              </h2>

              {/* Message */}
              <p className={`text-center ${
                status === 'success' ? 'text-green-600' : 
                status === 'error' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {message}
              </p>

              {/* Actions */}
              {(status === 'success' || status === 'error') && (
                <div className="mt-8 space-y-4 w-full">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Return to Home
                  </button>
                  
                  {status === 'error' && (
                    <button
                      onClick={() => navigate('/account')}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Go to Account Settings
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {(status === 'success' || status === 'error') && (
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  {status === 'success' 
                    ? 'You can now access all features of your account.' 
                    : 'Need help? Contact our support team.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail; 