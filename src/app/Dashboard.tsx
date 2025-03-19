import React, { useEffect, useState } from 'react';
import { Shield, CreditCard, AlertTriangle, Clock, Search, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { useUserFlow } from '../contexts/UserFlowContext';
import { toast } from 'react-toastify';
import PaymentInstructionsModal from './components/PaymentInstructionsModal';
import ReportReadyModal from './components/ReportReadyModal';
import { paymentConfig } from '../config/pricing';

interface CRBReport {
  report_id: string;
  personal_information: {
    full_name: string;
    id_number: string;
  };
  credit_accounts: {
    current_loans: Array<{
      loan_id: string;
      lender: string;
      amount: number;
      balance: number;
    }>;
  };
  repayment_history: {
    timely_payments: number;
    late_payments: number;
    loan_defaults: number;
  };
  credit_score: number;
  credit_inquiries: Array<{
    inquiry_id: string;
    institution: string;
    date: string;
  }>;
  purpose: string;
  generated_at: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const { hasGeneratedReport, hasPaid, setHasPaid } = useUserFlow();
  const [reportData, setReportData] = useState<CRBReport | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState('');

  useEffect(() => {
    if (!hasGeneratedReport) {
      navigate('/app/report');
      return;
    }

    const data = localStorage.getItem('crb_report_data');
    if (data) {
      setReportData(JSON.parse(data));
    } else {
      navigate('/app/report');
    }
  }, [hasGeneratedReport, navigate]);

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
    if (paidAmount !== paymentConfig.amount) {
      return { isValid: false, error: `Payment amount must be KES ${paymentConfig.amount}` };
    }

    if (!message.includes(paymentConfig.mpesa.businessName)) {
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

    setHasPaid(true);
    setShowPaymentModal(false);
    toast.success('Payment validated successfully!');
  };

  const generatePDF = () => {
    if (!reportData || !hasPaid) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Helper functions
    const addTitle = (text: string, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text(text, 20, y);
    };

    const addSubtitle = (text: string, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      doc.text(text, 20, y);
    };

    const addText = (text: string, y: number) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(text, 20, y);
    };

    const addKeyValue = (key: string, value: string, y: number) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(key, 20, y);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 80, y);
    };

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CRB Credit Report', 20, 25);

    // Report Info
    addTitle('Report Information', 50);
    addKeyValue('Report ID:', reportData.report_id, 60);
    addKeyValue('Generated:', new Date(reportData.generated_at).toLocaleDateString(), 67);
    addKeyValue('Purpose:', reportData.purpose, 74);

    // Personal Information
    addTitle('Personal Information', 90);
    addKeyValue('Full Name:', reportData.personal_information.full_name, 100);
    addKeyValue('ID Number:', reportData.personal_information.id_number, 107);

    // Credit Score
    addTitle('Credit Score', 125);
    let fillColor;
    if (reportData.credit_score >= 700) {
      fillColor = [34, 197, 94];
    } else if (reportData.credit_score >= 500) {
      fillColor = [234, 179, 8];
    } else {
      fillColor = [239, 68, 68];
    }
    doc.setFillColor(...fillColor);
    doc.rect(20, 130, 170, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`${reportData.credit_score}`, 95, 143);

    // Repayment History
    addTitle('Repayment History', 165);
    addKeyValue('Timely Payments:', reportData.repayment_history.timely_payments.toString(), 175);
    addKeyValue('Late Payments:', reportData.repayment_history.late_payments.toString(), 182);
    addKeyValue('Defaults:', reportData.repayment_history.loan_defaults.toString(), 189);

    // Current Loans
    addTitle('Current Loans', 205);
    let yPos = 215;
    reportData.credit_accounts.current_loans.forEach((loan, index) => {
      addSubtitle(`Loan ${index + 1}`, yPos);
      addKeyValue('Loan ID:', loan.loan_id, yPos + 7);
      addKeyValue('Lender:', loan.lender, yPos + 14);
      addKeyValue('Amount:', `KES ${loan.amount.toLocaleString()}`, yPos + 21);
      addKeyValue('Balance:', `KES ${loan.balance.toLocaleString()}`, yPos + 28);
      yPos += 40;
    });

    // Credit Inquiries
    if (yPos < 240) yPos = 240;
    addTitle('Recent Credit Inquiries', yPos);
    yPos += 10;
    reportData.credit_inquiries.forEach((inquiry, index) => {
      addKeyValue('Institution:', inquiry.institution, yPos);
      addKeyValue('Date:', inquiry.date, yPos + 7);
      addKeyValue('Inquiry ID:', inquiry.inquiry_id, yPos + 14);
      yPos += 25;
    });

    // Open PDF in new window
    const pdfOutput = doc.output('bloburl');
    window.open(pdfOutput, '_blank');
  };

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No report data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 md:w-8 md:h-8" />
              <span className="text-xl md:text-2xl font-bold">CRB Check</span>
            </div>
            <button 
              onClick={hasPaid ? generatePDF : () => setShowPaymentModal(true)}
              className={`flex items-center space-x-1 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm transition-all duration-300 ${
                hasPaid 
                  ? 'bg-green-500 hover:bg-green-400' 
                  : 'bg-gray-400 cursor-not-allowed opacity-75'
              }`}
            >
              <span>Download Report</span>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 relative">
        {/* Payment Required Modal */}
        {!hasPaid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-4 relative">
              {showPaymentModal ? (
                <PaymentInstructionsModal
                  onClose={() => setShowPaymentModal(false)}
                  amount={paymentConfig.amount}
                  tillNumber={paymentConfig.mpesa.tillNumber}
                  businessName={paymentConfig.mpesa.businessName}
                  mpesaMessage={mpesaMessage}
                  onMpesaMessageChange={setMpesaMessage}
                  onValidatePayment={handleValidatePayment}
                />
              ) : (
                <ReportReadyModal
                  fullName={reportData.personal_information.full_name}
                  idNumber={reportData.personal_information.id_number}
                  amount={paymentConfig.amount}
                  features={paymentConfig.features}
                  benefits={paymentConfig.benefits}
                  onMakePayment={() => setShowPaymentModal(true)}
                />
              )}
            </div>
          </div>
        )}

        {/* Main Dashboard Content - Blurred when not paid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${!hasPaid ? 'filter blur-sm pointer-events-none' : ''}`}>
          {/* Credit Score Card */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Credit Score</h2>
              <div className={`text-xl font-bold ${getCreditScoreColor(reportData.credit_score)}`}>
                {reportData.credit_score}
              </div>
            </div>
            <div className="mt-3">
              <div className="relative">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getCreditScoreBackground(reportData.credit_score)} transition-all duration-300`}
                    style={{ width: `${(reportData.credit_score / 900) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>0</span>
                  <span>450</span>
                  <span>900</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Score:</span>
                  <span className={`text-sm font-bold ${getCreditScoreColor(reportData.credit_score)}`}>
                    {reportData.credit_score} - {getCreditScoreLabel(reportData.credit_score)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Credit scores in Kenya range from 0 to 900. Higher scores indicate better creditworthiness.
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-red-50 text-red-700">
                  <div className="font-semibold">0-499</div>
                  <div>Poor</div>
                </div>
                <div className="p-2 rounded bg-yellow-50 text-yellow-700">
                  <div className="font-semibold">500-699</div>
                  <div>Fair</div>
                </div>
                <div className="p-2 rounded bg-green-50 text-green-700">
                  <div className="font-semibold">700-900</div>
                  <div>Excellent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Personal Info</h2>
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">Name</p>
                <p className="font-medium text-sm">{reportData.personal_information.full_name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">ID Number</p>
                <p className="font-medium text-sm">{reportData.personal_information.id_number}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">Generated</p>
                <p className="font-medium text-sm">
                  {new Date(reportData.generated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Repayment Summary */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Payments</h2>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-green-500">
                  {reportData.repayment_history.timely_payments}
                </div>
                <p className="text-xs text-gray-500">On Time</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-500">
                  {reportData.repayment_history.late_payments}
                </div>
                <p className="text-xs text-gray-500">Late</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-red-500">
                  {reportData.repayment_history.loan_defaults}
                </div>
                <p className="text-xs text-gray-500">Defaults</p>
              </div>
            </div>
          </div>

          {/* Current Loans */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Current Loans</h2>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th className="pb-2 font-medium">Loan ID</th>
                      <th className="pb-2 font-medium">Lender</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Balance</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.credit_accounts.current_loans.map((loan) => (
                      <tr key={loan.loan_id} className="text-sm">
                        <td className="py-2 pr-2">{loan.loan_id}</td>
                        <td className="py-2 pr-2">{loan.lender}</td>
                        <td className="py-2 pr-2">KES {loan.amount.toLocaleString()}</td>
                        <td className="py-2 pr-2">KES {loan.balance.toLocaleString()}</td>
                        <td className="py-2">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Inquiries</h2>
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              {reportData.credit_inquiries.map((inquiry) => (
                <div key={inquiry.inquiry_id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{inquiry.institution}</p>
                    <p className="text-xs text-gray-500">{inquiry.date}</p>
                  </div>
                  <div className="text-xs text-gray-500">{inquiry.inquiry_id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const getCreditScoreColor = (score: number) => {
  if (score >= 700) return 'text-green-500';
  if (score >= 500) return 'text-yellow-500';
  return 'text-red-500';
};

const getCreditScoreLabel = (score: number) => {
  if (score >= 700) return 'Excellent';
  if (score >= 500) return 'Fair';
  return 'Poor';
};

const getCreditScoreBackground = (score: number) => {
  if (score >= 700) return 'bg-green-500';
  if (score >= 500) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default Dashboard;