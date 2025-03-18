export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}