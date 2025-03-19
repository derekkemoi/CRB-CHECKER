import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSignupCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isSignedUp = localStorage.getItem('is_signed_up') === 'true';
    const userFlowState = localStorage.getItem('user_flow_state');
    
    if (isSignedUp) {
      if (userFlowState) {
        const { hasGeneratedReport } = JSON.parse(userFlowState);
        if (hasGeneratedReport) {
          navigate('/app/dashboard');
        } else {
          navigate('/app/report');
        }
      } else {
        navigate('/app/report');
      }
    }
  }, [navigate]);

  const setSignedUp = () => {
    localStorage.setItem('is_signed_up', 'true');
  };

  return { setSignedUp };
};