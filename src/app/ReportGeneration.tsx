import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { reportPurposes } from './data';
import { useUserFlow } from '../contexts/UserFlowContext';

function ReportGeneration() {
  const navigate = useNavigate();
  const { hasPaid, setPurpose, setHasGeneratedReport } = useUserFlow();
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState<{ fullName: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (hasPaid) {
      navigate('/app/payment');
    }
  }, [hasPaid, navigate]);

  const handlePurposeSelect = (purposeId: string) => {
    setSelectedPurpose(purposeId);
  };

  const handleGenerateReport = () => {
    setShowModal(true);
    setProgress(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showModal) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            if (selectedPurpose) {
              setPurpose(true);
              setHasGeneratedReport(true);

              // Get user data from localStorage
              const storedUser = localStorage.getItem('user');
              const userData = storedUser ? JSON.parse(storedUser) : {
                fullName: "John Doe",
                idNumber: "12345678"
              };

              // Generate random amount between 10000 and 20000
              const amount = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
              // Generate random balance that's less than the amount
              const balance = Math.floor(Math.random() * (amount - 1000)) + 1000;
              // Generate random credit score between 100 and 500
              const creditScore = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

              // Generate mock report data with user data
              const mockReportData = {
                report_id: `CRB${Date.now()}`,
                personal_information: {
                  full_name: userData.fullName,
                  id_number: userData.idNumber
                },
                credit_accounts: {
                  current_loans: [
                    {
                      loan_id: "L1234",
                      lender: "MOBILE LOAN LENDER",
                      amount: amount,
                      balance: balance
                    }
                  ]
                },
                repayment_history: {
                  timely_payments: 1,
                  late_payments: 3,
                  loan_defaults: 1
                },
                credit_score: creditScore,
                credit_inquiries: [
                  {
                    inquiry_id: "INQ123",
                    institution: "XXX Bank In Kenya",
                    date: new Date().toISOString()
                  }
                ],
                purpose: selectedPurpose,
                generated_at: new Date().toISOString()
              };

              // Store report data
              localStorage.setItem('crb_report_data', JSON.stringify(mockReportData));
            }
            setTimeout(() => {
              setShowModal(false);
              navigate('/app/payment');
            }, 500);
            return 100;
          }
          return prev + 1;
        });
      }, 350);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showModal, navigate, selectedPurpose, setPurpose, setHasGeneratedReport]);

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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Select Report Purpose</h1>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {reportPurposes.map((purpose) => (
              <button
                key={purpose.id}
                onClick={() => handlePurposeSelect(purpose.id)}
                className={`p-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  selectedPurpose === purpose.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-900 shadow hover:shadow-md hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{purpose.icon}</span>
                <span className="font-medium">{purpose.title}</span>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleGenerateReport}
              disabled={!selectedPurpose}
              className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                selectedPurpose
                  ? 'bg-blue-600 hover:bg-blue-700 shadow'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Generate My CRB Report
            </button>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Hello {userData?.fullName?.split(' ')[0] || 'User'}
              </h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generating Your CRB Report
              </h3>
              <p className="text-sm text-gray-600">Please wait while we process your credit report</p>
            </div>

            <div className="mb-5">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-center text-base font-semibold text-blue-600">
                {progress}%
              </div>
            </div>

            <div className="relative h-10">
              <div
                className="absolute inset-0 bg-blue-600 rounded-lg transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm">
                Processing...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportGeneration;