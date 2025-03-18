import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserFlowContextType {
  hasPurpose: boolean;
  hasPaid: boolean;
  hasGeneratedReport: boolean;
  setPurpose: (value: boolean) => void;
  setHasPaid: (value: boolean) => void;
  setHasGeneratedReport: (value: boolean) => void;
  resetFlow: () => void;
}

const UserFlowContext = createContext<UserFlowContextType | undefined>(undefined);

export function UserFlowProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [hasPurpose, setPurpose] = useState(() => {
    const stored = localStorage.getItem('user_flow_state');
    if (stored) {
      const { hasPurpose } = JSON.parse(stored);
      return hasPurpose;
    }
    return false;
  });

  const [hasPaid, setHasPaid] = useState(() => {
    const stored = localStorage.getItem('user_flow_state');
    if (stored) {
      const { hasPaid } = JSON.parse(stored);
      return hasPaid;
    }
    return false;
  });

  const [hasGeneratedReport, setHasGeneratedReport] = useState(() => {
    const stored = localStorage.getItem('user_flow_state');
    if (stored) {
      const { hasGeneratedReport } = JSON.parse(stored);
      return hasGeneratedReport;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('user_flow_state', JSON.stringify({ 
      hasPurpose,
      hasPaid, 
      hasGeneratedReport 
    }));
  }, [hasPurpose, hasPaid, hasGeneratedReport]);

  useEffect(() => {
    // Only handle redirects for paths under /app
    if (!location.pathname.startsWith('/app/')) {
      return;
    }

    const redirectLogic = () => {
      // If user has paid and generated report, they should always be in dashboard
      if (hasPaid && hasGeneratedReport && location.pathname !== '/app/dashboard') {
        navigate('/app/dashboard');
        return;
      }

      // If user has generated report but hasn't paid, they should be in payment page
      if (hasGeneratedReport && !hasPaid && location.pathname !== '/app/payment') {
        navigate('/app/payment');
        return;
      }

      // If user hasn't generated report, they should be in report generation page
      if (!hasGeneratedReport && location.pathname !== '/app/report') {
        navigate('/app/report');
        return;
      }

      // Prevent access to payment page without generated report
      if (location.pathname === '/app/payment' && !hasGeneratedReport) {
        navigate('/app/report');
        return;
      }

      // Prevent access to dashboard without payment and report
      if (location.pathname === '/app/dashboard' && (!hasPaid || !hasGeneratedReport)) {
        if (!hasGeneratedReport) {
          navigate('/app/report');
        } else {
          navigate('/app/payment');
        }
        return;
      }
    };

    redirectLogic();
  }, [location.pathname, hasGeneratedReport, hasPaid, navigate]);

  const resetFlow = () => {
    setPurpose(false);
    setHasPaid(false);
    setHasGeneratedReport(false);
    localStorage.removeItem('user_flow_state');
    localStorage.removeItem('crb_report_data');
  };

  return (
    <UserFlowContext.Provider 
      value={{ 
        hasPurpose,
        hasPaid, 
        hasGeneratedReport,
        setPurpose,
        setHasPaid, 
        setHasGeneratedReport,
        resetFlow
      }}
    >
      {children}
    </UserFlowContext.Provider>
  );
}

export function useUserFlow() {
  const context = useContext(UserFlowContext);
  if (context === undefined) {
    throw new Error('useUserFlow must be used within a UserFlowProvider');
  }
  return context;
}