import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ta } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Users, Package, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { orders, users, products } = useStore();
  const [currentDate] = useState(new Date());
  const currentLocale = i18n.language === 'ta' ? ta : enUS;

  // Compute Metrics
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{t('nav.dashboard')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Overview of your milk shop's performance</p>
        </div>
        <div style={{ 
          background: 'var(--surface-color)', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px', 
          boxShadow: 'var(--box-shadow)',
          color: 'var(--primary-color)', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Clock size={18} />
          {format(currentDate, 'dd MMMM yyyy', { locale: currentLocale })}
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <ShoppingCart size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Total Orders</p>
            <h3 style={metricValueStyle}>{orders.length}</h3>
          </div>
          <TrendingUp size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
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
            <p style={metricLabelStyle}>Delivered</p>
            <h3 style={metricValueStyle}>{deliveredOrders}</h3>
          </div>
          <CheckCircle size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)')}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Recent Orders Table */}
        <div className="card" style={{ padding: '1.5rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Recent Orders</h3>
            <button 
              onClick={() => navigate('/admin/orders')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
            >
              View All
            </button>
          </div>
          
          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '0 1.5rem' }}>No orders placed yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(156, 163, 175, 0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Order ID</th>
                    <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Product</th>
                    <th style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id} style={{ borderBottom: idx === recentOrders.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>#{order.id.toUpperCase()}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{getUserName(order.customerId)}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{getProductName(order.productId)}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: order.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: order.status === 'Pending' ? '#d97706' : '#10b981'
                        }}>
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
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button className="btn" onClick={() => navigate('/admin/products')} style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
                <Package size={18} />
                Manage Products
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/customers')} style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: '1rem', background: 'transparent' }}>
                <Users size={18} />
                Manage Users
              </button>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>System Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
              <span style={{ color: '#059669', fontWeight: 500, fontSize: '0.95rem' }}>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .metric-card {
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
          border-radius: 16px;
          color: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  );
}

// Inline Styles for metrics to keep JSX clean
const metricCardStyle = (background: string): React.CSSProperties => ({
  background,
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
});

const metricIconWrapperStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  padding: '1rem',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const metricContentStyle: React.CSSProperties = {
  zIndex: 1,
  position: 'relative'
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 500,
  opacity: 0.9,
  marginBottom: '0.2rem'
};

const metricValueStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 700,
  margin: 0
};

const metricBgIconStyle: React.CSSProperties = {
  position: 'absolute',
  right: '-10px',
  bottom: '-10px',
  transform: 'scale(2.5)',
  opacity: 0.2,
  zIndex: 0
};
