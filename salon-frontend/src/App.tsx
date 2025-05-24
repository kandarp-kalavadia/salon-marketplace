import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SalonDetails from "./pages/SalonDetails";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import SalonOwnerDashboard from "./pages/dashboard/SalonOwnerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/not-found";
import { useAuth } from "./auth/AuthContext";



function App() {

  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/auth/callback" Component={() => null} />
        <Route path="/auth/silent" Component={() => null} />
        <Route path="/salon/:id" element={<Layout><SalonDetails /></Layout>} />
        <Route path="/payment/success/*" element={<Layout><PaymentSuccess /></Layout>} />
        <Route path="/payment/cancel/*" element={<Layout><PaymentCancel /></Layout>} />
        
        {/* Customer only routes */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute roles={['CUSTOMER']}>
              <Layout><Checkout /></Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Salon owner routes */}
        <Route 
          path="/salon-dashboard/*" 
          element={
            <ProtectedRoute roles={['SALON_OWNER']}>
              <Layout><SalonOwnerDashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin-dashboard/*" 
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Role-based redirects */}
        <Route 
          path="/dashboard" 
          element={
            user?.profile?.role === 'SALON_OWNER' ? (
              <Navigate to="/salon-dashboard" replace />
            ) : user?.profile?.role === 'ADMIN' ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
