import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChatSimulator from './pages/ChatSimulator';
import UserManual from './pages/UserManual';
import Products from './pages/Products';
import Managers from './pages/Managers';
import LegalPolicies from './pages/LegalPolicies';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Legal & Policy Pages (Accessible without login for Meta verification & customers) */}
          <Route path="/privacy" element={<LegalPolicies />} />
          <Route path="/terms" element={<LegalPolicies />} />
          <Route path="/return-policy" element={<LegalPolicies />} />
          <Route path="/refund-policy" element={<LegalPolicies />} />
          <Route path="/contact" element={<LegalPolicies />} />
          <Route path="/legal" element={<LegalPolicies />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managers"
            element={
              <ProtectedRoute>
                <Managers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-simulator"
            element={
              <ProtectedRoute>
                <ChatSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-manual"
            element={
              <ProtectedRoute>
                <UserManual />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;