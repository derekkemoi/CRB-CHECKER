import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserFlowProvider } from './contexts/UserFlowContext';
import Home from './home/Home';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import ReportGeneration from './app/ReportGeneration';
import Payment from './app/Payment';
import Dashboard from './app/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <UserFlowProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/app/report" element={<ReportGeneration />} />
          <Route path="/app/payment" element={<Payment />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </UserFlowProvider>
    </Router>
  );
}

export default App;