import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Phone, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { useUserFlow } from '../contexts/UserFlowContext';
import { useSignupCheck } from '../hooks/useSignupCheck';

function SignUp() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const { resetFlow } = useUserFlow();
  const { setSignedUp } = useSignupCheck();
  const [signupProgress, setSignupProgress] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use the signup check hook to handle redirections
  useSignupCheck();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      phone: '',
      idNumber: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^(?:\+254|0)[17]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
      isValid = false;
    }

    if (!formData.idNumber) {
      newErrors.idNumber = 'ID number is required';
      isValid = false;
    } else if (!/^\d{8}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'Please enter a valid 8-digit ID number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const simulateSignup = async () => {
    const interval = setInterval(() => {
      setSignupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);

    return new Promise(resolve => {
      setTimeout(() => {
        clearInterval(interval);
        setSignupProgress(100);
        resolve(true);
      }, 4000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const { confirmPassword, ...signupData } = formData;
        
        // Start progress
        setSignupProgress(0);
        
        // Simulate signup process
        await simulateSignup();
        
        // Generate a temporary email using phone number
        const tempEmail = `${signupData.phone.replace(/[^0-9]/g, '')}@temp.com`;
        
        // Actual signup with generated email
        await signup({ ...signupData, email: tempEmail });
        
        // Save user data to localStorage
        const userData = {
          fullName: formData.fullName,
          phone: formData.phone,
          idNumber: formData.idNumber
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set signup flag
        setSignedUp();
        
        toast.success('Successfully signed up!');
        // Reset any existing flow state before starting new flow
        resetFlow();
        // Redirect to report generation page
        navigate('/app/report');
      } catch (error) {
        setSignupProgress(0);
        toast.error('Failed to sign up. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 py-4">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-white hover:text-blue-200 transition-colors">
          <Shield className="w-6 h-6 mr-2" />
          <span className="text-xl font-bold">CRB Check</span>
        </Link>

        <div className="max-w-md mx-auto mt-6">
          <div className="bg-white rounded-xl shadow-xl p-5">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">Need CRB Report</h1>
              <p className="text-sm text-gray-600">Get your credit report now in just minutes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm`}
                    placeholder="e.g., +254712345678"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ID Number</label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border ${
                      errors.idNumber ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm`}
                    placeholder="Enter your 8-digit ID number"
                    maxLength={8}
                    disabled={isLoading}
                  />
                </div>
                {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm`}
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="space-y-2">
                {signupProgress > 0 && (
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{ width: `${signupProgress}%` }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      Creating Account
                      <span className="ml-1">
                        {signupProgress > 0 && `${Math.round(signupProgress)}%`}
                      </span>
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 -mr-1 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;