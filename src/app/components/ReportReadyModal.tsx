import React from 'react';
import { Shield, Lock, TrendingUp, FileText } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface ReportReadyModalProps {
  fullName: string;
  idNumber: string;
  amount: number;
  features: Feature[];
  benefits: string[];
  onMakePayment: () => void;
}

function ReportReadyModal({
  fullName,
  idNumber,
  amount,
  features,
  benefits,
  onMakePayment
}: ReportReadyModalProps) {
  const featureIcons = {
    'Credit Score': Lock,
    'Analysis': TrendingUp,
    'Full Report': FileText
  };

  return (
    <>
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Hello {fullName}
        </h2>
        <p className="text-sm text-gray-600 mb-3">ID Number: {idNumber}</p>
        <p className="text-sm text-gray-800">
          Your credit report is ready. In order to view you have to pay <span className="font-semibold">KES {amount}</span>
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold text-blue-900 mb-2">
          You will have access to:
        </p>
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature, index) => {
            const Icon = featureIcons[feature.title as keyof typeof featureIcons];
            return (
              <div key={index} className="text-center">
                <Icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-800">{feature.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
        <p className="text-xs font-medium text-yellow-800 mb-2">
          Benefits of your credit report:
        </p>
        <ul className="text-xs text-yellow-700 space-y-1">
          {benefits.map((benefit, index) => (
            <li key={index}>• {benefit}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onMakePayment}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm flex items-center justify-center"
      >
        Make Payment - KES {amount}
      </button>
    </>
  );
}

export default ReportReadyModal