import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login, signup, logout, getCurrentUser } from '../store/slices/authSlice';
import { LoginCredentials, SignupData } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    login: (credentials: LoginCredentials) => dispatch(login(credentials)),
    signup: (data: SignupData) => dispatch(signup(data)),
    logout: () => dispatch(logout()),
    getCurrentUser: () => dispatch(getCurrentUser()),
  };
};