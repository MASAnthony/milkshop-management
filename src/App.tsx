import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminProducts from './pages/AdminProducts';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrders from './pages/CustomerOrders';
import DeliveryLayout from './layouts/DeliveryLayout';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useStore } from './context/StoreContext';

import React from 'react';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to their appropriate dashboard if they try to access an unauthorized route
    switch (currentUser.role) {
      case 'super_admin':
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'delivery_boy':
        return <Navigate to="/delivery" replace />;
      case 'customer':
      default:
        return <Navigate to="/customer" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Portal */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Customer Portal */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<CustomerDashboard />} />
          <Route path="my-orders" element={<CustomerOrders />} />
        </Route>

        {/* Delivery Portal */}
        <Route path="/delivery" element={
          <ProtectedRoute allowedRoles={['delivery_boy']}>
            <DeliveryLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DeliveryDashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
