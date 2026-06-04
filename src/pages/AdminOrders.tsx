import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { format } from 'date-fns';
import { ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
  const { t, i18n } = useTranslation();
  const { orders, products, users, updateOrderStatus, assignOrder } = useStore();

  const deliveryBoys = users.filter(u => u.role === 'delivery_boy');

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? (i18n.language === 'ta' ? product.name.ta : product.name.en) : 'Unknown';
  };

  const getCustomerName = (customerId: string) => {
    const customer = users.find(u => u.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{t('nav.orders')} Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>View and update customer orders</p>
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
          <ShoppingCart size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #f59e0b 0%, #d97706 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <AlertCircle size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Pending Deliveries</p>
            <h3 style={metricValueStyle}>{pendingOrders}</h3>
          </div>
          <AlertCircle size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
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
      </div>
      
      {sortedOrders.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No orders have been placed yet.</p>
      ) : (
        <div style={{ background: 'var(--surface-color)', borderRadius: '12px', padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <th style={{ padding: '1rem 0' }}>Order ID</th>
                <th style={{ padding: '1rem 0' }}>Customer</th>
                <th style={{ padding: '1rem 0' }}>Product</th>
                <th style={{ padding: '1rem 0' }}>Date</th>
                <th style={{ padding: '1rem 0' }}>Delivery Boy</th>
                <th style={{ padding: '1rem 0' }}>Status</th>
                <th style={{ padding: '1rem 0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>{order.id}</td>
                  <td style={{ padding: '1rem 0' }}>{getCustomerName(order.customerId)}</td>
                  <td style={{ padding: '1rem 0' }}>{getProductName(order.productId)}</td>
                  <td style={{ padding: '1rem 0' }}>{format(new Date(order.date), 'dd MMM yyyy')}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <select 
                      value={order.deliveryBoyId || ''} 
                      onChange={(e) => assignOrder(order.id, e.target.value)}
                      disabled={order.status === 'Delivered'}
                      style={{
                        padding: '0.4rem', borderRadius: '4px',
                        border: '1px solid rgba(156, 163, 175, 0.4)',
                        background: 'transparent', color: 'var(--text-primary)',
                        opacity: order.status === 'Delivered' ? 0.6 : 1
                      }}
                    >
                      <option value="">Unassigned</option>
                      {deliveryBoys.map(db => (
                        <option key={db.id} value={db.id}>{db.name}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      backgroundColor: order.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: order.status === 'Pending' ? '#d97706' : '#10b981'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                    {order.status === 'Pending' ? (
                      <button 
                        className="btn" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => updateOrderStatus(order.id, 'Pending')}
                      >
                        Revert to Pending
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

// Inline Styles for metrics
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
