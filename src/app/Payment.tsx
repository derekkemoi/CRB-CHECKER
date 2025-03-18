import React, { useState, useEffect } from 'react';
import { Shield, Copy, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUserFlow } from '../contexts/UserFlowContext';

function Payment() {
  const navigate = useNavigate();
  const { hasPurpose, setHasPaid } = useUserFlow();
  const [showModal, setShowModal] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState('');
  const amount = 100;
  const tillNumber = '5204479';
  const businessName = 'FOOTBALL HIGHWAY ENTERPRISES';

  useEffect(() => {
    if (!hasPurpose) {
      navigate('/app/report');
    }
  }, [hasPurpose, navigate]);

  const handleCopyTillNumber = () => {
    navigator.clipboard.writeText(tillNumber);
    toast.success('Till number copied to clipboard!');
  };

  const validateMpesaMessage = (message: string) => {
    if (!/^[A-Z0-9]+/.test(message)) {
      return { isValid: false, error: 'Invalid M-PESA message format' };
    }

    const amountRegex = /Ksh\s*(\d+(?:\.\d{2})?)/;
    const amountMatch = message.match(amountRegex);
    if (!amountMatch) {
      return { isValid: false, error: 'Could not find payment amount in message' };
    }

    const paidAmount = parseFloat(amountMatch[1]);
    if (paidAmount !== amount) {
      return { isValid: false, error: `Payment amount must be KES ${amount}` };
    }

    if (!message.includes(businessName)) {
      return { isValid: false, error: 'Invalid payment recipient' };
    }

    return { isValid: true };
  };

  const handleValidatePayment = () => {
    if (!mpesaMessage.trim()) {
      toast.error('Please paste the M-PESA confirmation message');
      return;
    }

    const validation = validateMpesaMessage(mpesaMessage);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // Update flow state
    setHasPaid(true);
    
    toast.success('Payment validated successfully!');
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8" />
            <span className="text-2xl font-bold">CRB Check</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">CRB Report Generated Successfully</h1>
              <p className="text-gray-600">
                To view your generated report, please complete the payment of
                <span className="font-semibold text-blue-600"> KES {amount}</span>
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
            >
              Make Payment
            </button>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 md:p-6 relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">M-PESA Payment Instructions</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  1
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm md:text-base">Go to M-PESA menu</p>
                  <p className="text-xs md:text-sm text-gray-600">Select M-PESA from your phone menu</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  2
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm md:text-base">Select "Lipa na M-PESA"</p>
                  <p className="text-xs md:text-sm text-gray-600">Choose "Buy Goods and Services"</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  3
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm md:text-base">Enter Till Number</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-base md:text-lg font-mono">
                      {tillNumber}
                    </code>
                    <button
                      onClick={handleCopyTillNumber}
                      className="p-1.5 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Copy Till Number"
                    >
                      <Copy className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  4
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm md:text-base">Enter Amount</p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Enter <span className="font-semibold">KES {amount}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  5
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm md:text-base">Enter M-PESA PIN</p>
                  <p className="text-xs md:text-sm text-gray-600">Wait for confirmation SMS</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  6
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm md:text-base">Copy M-PESA Message</p>
                  <p className="text-xs md:text-sm text-gray-600">Copy the entire confirmation message you receive and paste it below</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Paste M-PESA Message
                </label>
                <textarea
                  value={mpesaMessage}
                  onChange={(e) => setMpesaMessage(e.target.value)}
                  className="w-full h-24 md:h-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder="Paste the M-PESA confirmation message here..."
                />
              </div>

              <button
                onClick={handleValidatePayment}
                className="w-full py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm md:text-base mt-4"
              >
                Validate Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;