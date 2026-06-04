import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Add more admin routes here later */}
          <Route path="customers" element={<div>Customers Placeholder</div>} />
          <Route path="orders" element={<div>Orders Placeholder</div>} />
          <Route path="products" element={<div>Products Placeholder</div>} />
        </Route>

        {/* Customer Portal */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          {/* Add more customer routes here later */}
          <Route path="my-orders" element={<div>My Orders Placeholder</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
