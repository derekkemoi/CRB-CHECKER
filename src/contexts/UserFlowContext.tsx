import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserFlowContextType {
  hasPaid: boolean;
  hasGeneratedReport: boolean;
  setHasPaid: (value: boolean) => void;
  setHasGeneratedReport: (value: boolean) => void;
  resetFlow: () => void;
}

const UserFlowContext = createContext<UserFlowContextType | undefined>(undefined);

export function UserFlowProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  
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
      hasPaid, 
      hasGeneratedReport 
    }));
  }, [hasPaid, hasGeneratedReport]);

  useEffect(() => {
    // Only handle redirects for paths under /app
    if (!location.pathname.startsWith('/app/')) {
      return;
    }

    const redirectLogic = () => {
      // If user hasn't generated report, they should be in report generation page
      if (!hasGeneratedReport && location.pathname !== '/app/report') {
        navigate('/app/report');
        return;
      }

      // If user has generated report, they should be in dashboard
      if (hasGeneratedReport && location.pathname !== '/app/dashboard') {
        navigate('/app/dashboard');
        return;
      }
    };

    redirectLogic();
  }, [location.pathname, hasGeneratedReport, hasPaid, navigate]);

  const resetFlow = () => {
    setHasPaid(false);
    setHasGeneratedReport(false);
    localStorage.removeItem('user_flow_state');
    localStorage.removeItem('crb_report_data');
  };

  return (
    <UserFlowContext.Provider 
      value={{ 
        hasPaid, 
        hasGeneratedReport,
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