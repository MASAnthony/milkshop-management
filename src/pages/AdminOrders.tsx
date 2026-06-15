import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { format } from 'date-fns';
import { ShoppingCart, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminOrders() {
  const { t, i18n } = useTranslation();
  const { orders, subscriptions, products, users, updateOrderStatus, assignOrder } = useStore();

  const deliveryBoys = users.filter(u => u.role === 'delivery_boy');
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.name) return 'Unknown';
    if (typeof product.name === 'string') return product.name;
    return i18n.language === 'ta' ? product.name.ta : product.name.en;
  };

  const getCustomerName = (customerId: string) => {
    const customer = users.find(u => u.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const activeSubs = subscriptions.filter(s => s.status === 'Active').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem', fontWeight: 700 }}>{t('nav.orders')} Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>View orders and daily subscriptions</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
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

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #ec4899 0%, #db2777 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <RefreshCw size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Active Subscriptions</p>
            <h3 style={metricValueStyle}>{activeSubs}</h3>
          </div>
          <RefreshCw size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', fontSize: '1.25rem', fontWeight: 600 }}>All Orders</h3>
        {sortedOrders.length === 0 ? (
          <p style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>No orders have been placed yet.</p>
        ) : (
          <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem 1.5rem' }}>Order ID</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Customer & Address</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Product Info</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Payment</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Delivery Boy</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                      #{order.id.toUpperCase()}
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 400, marginTop: '0.2rem' }}>
                        {format(new Date(order.date), 'dd MMM, HH:mm')}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 500 }}>{getCustomerName(order.customerId)}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{order.deliveryAddress}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 500 }}>{getProductName(order.productId)}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Qty: {order.quantity} | ₹{order.totalAmount}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge badge-${order.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>{order.paymentStatus}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <select 
                        className="form-select"
                        value={order.deliveryBoyId || ''} 
                        onChange={(e) => assignOrder(order.id, e.target.value)}
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      >
                        <option value="">Unassigned</option>
                        {deliveryBoys.map(db => (
                          <option key={db.id} value={db.id}>{db.name} {db.assignedRoute ? `(${db.assignedRoute})` : ''}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge badge-${order.status === 'Pending' ? 'warning' : order.status === 'Delivered' ? 'success' : order.status === 'Failed' || order.status === 'Cancelled' ? 'danger' : 'primary'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                      {order.status === 'Pending' ? (
                        <button className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}>
                          Ship
                        </button>
                      ) : order.status === 'Out for Delivery' ? (
                        <button className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => updateOrderStatus(order.id, 'Delivered')}>
                          Complete
                        </button>
                      ) : (
                        <button className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => updateOrderStatus(order.id, 'Pending')} disabled={order.status === 'Cancelled'}>
                          Reset
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
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

// Inline Styles for metrics
const metricCardStyle = (background: string): React.CSSProperties => ({
  background, display: 'flex', alignItems: 'center', gap: '1.2rem',
});

const metricIconWrapperStyle = (bg: string): React.CSSProperties => ({
  background: bg, padding: '1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
});

const metricContentStyle: React.CSSProperties = {
  zIndex: 1, position: 'relative', flex: 1, minWidth: 0
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.95rem', fontWeight: 500, opacity: 0.9, marginBottom: '0.2rem'
};

const metricValueStyle: React.CSSProperties = {
  fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em'
};

const metricBgIconStyle: React.CSSProperties = {
  position: 'absolute', right: '-15px', bottom: '-15px', transform: 'scale(2.5)', opacity: 0.15, zIndex: 0
};
