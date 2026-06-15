import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ta } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Users, Package, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { orders, users, products, subscriptions } = useStore();
  const [currentDate] = useState(new Date());
  const currentLocale = i18n.language === 'ta' ? ta : enUS;

  // Compute Metrics
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;
  
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 'Unknown';
    return i18n.language === 'ta' ? product.name.ta : product.name.en;
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem', fontWeight: 700 }}>{t('nav.dashboard')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Overview of your milk shop's performance</p>
        </div>
        <div style={{ 
          background: 'var(--surface-color)', 
          padding: '0.75rem 1.25rem', 
          borderRadius: '12px', 
          boxShadow: 'var(--glass-shadow)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--surface-border)',
          color: 'var(--primary-color)', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Clock size={20} />
          {format(currentDate, 'dd MMMM yyyy', { locale: currentLocale })}
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2.5rem' 
      }}>
        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <RefreshCw size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Active Subs</p>
            <h3 style={metricValueStyle}>{activeSubscriptions}</h3>
          </div>
          <RefreshCw size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #f59e0b 0%, #d97706 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <AlertCircle size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Pending Deliveries</p>
            <h3 style={metricValueStyle}>{pendingOrders}</h3>
          </div>
          <Clock size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #10b981 0%, #059669 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <CheckCircle size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Delivered Today</p>
            <h3 style={metricValueStyle}>{deliveredOrders}</h3>
          </div>
          <CheckCircle size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #ec4899 0%, #db2777 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Users size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Total Customers</p>
            <h3 style={metricValueStyle}>{totalCustomers}</h3>
          </div>
          <Users size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        {/* Recent Orders Table */}
        <div className="card" style={{ padding: '1.5rem 0', display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Recent Orders</h3>
            <button 
              onClick={() => navigate('/admin/orders')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
            >
              View All
            </button>
          </div>
          
          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '0 1.5rem' }}>No orders placed yet.</p>
          ) : (
            <div className="table-container" style={{ margin: '0 1.5rem', border: 'none', boxShadow: 'none', background: 'transparent' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order ID</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customer</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Amount</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id} style={{ borderBottom: idx === recentOrders.length - 1 ? 'none' : '1px solid var(--surface-border)' }}>
                      <td style={{ padding: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>#{order.id.toUpperCase()}</td>
                      <td style={{ padding: '1rem', fontSize: '0.95rem' }}>{getUserName(order.customerId)}</td>
                      <td style={{ padding: '1rem', fontSize: '0.95rem' }}>{getProductName(order.productId)} (x{order.quantity})</td>
                      <td style={{ padding: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>₹{order.totalAmount}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${order.status === 'Pending' ? 'warning' : order.status === 'Delivered' ? 'success' : order.status === 'Failed' ? 'danger' : 'primary'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', fontWeight: 600 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn" onClick={() => navigate('/admin/products')} style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
                <Package size={20} />
                Manage Products
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/customers')} style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
                <Users size={20} />
                Manage Users
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/orders')} style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
                <ShoppingCart size={20} />
                View All Orders
              </button>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>System Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981', animation: 'pulse 2s infinite' }}></div>
              <span style={{ color: '#059669', fontWeight: 600, fontSize: '1rem' }}>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .metric-card {
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          color: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        }
        .metric-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 30px -5px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}

// Inline Styles
const metricCardStyle = (background: string): React.CSSProperties => ({
  background,
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
});

const metricIconWrapperStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  padding: '1rem',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)'
});

const metricContentStyle: React.CSSProperties = {
  zIndex: 1,
  position: 'relative'
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 500,
  opacity: 0.9,
  marginBottom: '0.2rem'
};

const metricValueStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  margin: 0,
  letterSpacing: '-0.02em'
};

const metricBgIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '-15px',
  bottom: '-15px',
  transform: 'scale(2.5)',
  opacity: 0.15,
  zIndex: 0
};
