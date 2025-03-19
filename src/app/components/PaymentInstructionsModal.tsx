import React from 'react';
import { Shield, Copy, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface PaymentInstructionsModalProps {
  onClose: () => void;
  amount: number;
  tillNumber: string;
  businessName: string;
  mpesaMessage: string;
  onMpesaMessageChange: (message: string) => void;
  onValidatePayment: () => void;
}

function PaymentInstructionsModal({
  onClose,
  amount,
  tillNumber,
  businessName,
  mpesaMessage,
  onMpesaMessageChange,
  onValidatePayment
}: PaymentInstructionsModalProps) {
  const handleCopyTillNumber = () => {
    navigator.clipboard.writeText(tillNumber);
    toast.success('Till number copied to clipboard!');
  };

  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Pay KES {amount}</h3>
            <p className="text-sm text-gray-600">Follow steps below</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">1</span>
            <span>Go to M-PESA</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">2</span>
            <span>Select "Lipa na M-PESA" &gt; "Buy Goods"</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">3</span>
            <div className="flex items-center space-x-2">
              <span>Enter Till</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">{tillNumber}</code>
              <button
                onClick={handleCopyTillNumber}
                className="p-1 text-blue-600 hover:text-blue-700"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">4</span>
            <span>Enter Amount: KES {amount}</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">5</span>
            <span>Enter PIN & Confirm</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paste M-PESA Message
          </label>
          <textarea
            value={mpesaMessage}
            onChange={(e) => onMpesaMessageChange(e.target.value)}
            className="w-full h-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            placeholder="Paste your M-PESA message here..."
          />
        </div>

        <button
          onClick={onValidatePayment}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
        >
          Validate Payment
        </button>
      </div>
    </>
  );
}

export default PaymentInstructionsModal