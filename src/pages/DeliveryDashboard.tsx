import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { format } from 'date-fns';
import { Package, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function DeliveryDashboard() {
  const { t, i18n } = useTranslation();
  const { orders, products, users, currentUser, updateOrderStatus } = useStore();

  const assignedOrders = orders.filter(o => o.deliveryBoyId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? (i18n.language === 'ta' ? product.name.ta : product.name.en) : 'Unknown';
  };

  const getCustomerInfo = (customerId: string) => {
    const customer = users.find(u => u.id === customerId);
    return customer ? customer : null;
  };

  const pendingDeliveries = assignedOrders.filter(o => o.status === 'Pending').length;
  const completedDeliveries = assignedOrders.filter(o => o.status === 'Delivered').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Welcome, {currentUser?.name || 'Delivery Partner'}!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Here are your delivery assignments</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2.5rem' 
      }}>
        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #f59e0b 0%, #d97706 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Clock size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Pending Deliveries</p>
            <h3 style={metricValueStyle}>{pendingDeliveries}</h3>
          </div>
          <Clock size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #10b981 0%, #059669 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <CheckCircle size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Completed Today</p>
            <h3 style={metricValueStyle}>{completedDeliveries}</h3>
          </div>
          <CheckCircle size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Your Assignments</h3>
      
      {assignedOrders.length === 0 ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', padding: '4rem 2rem', background: 'var(--surface-color)', 
          borderRadius: '16px', border: '1px dashed rgba(156, 163, 175, 0.4)' 
        }}>
          <Package size={64} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No pending assignments</h3>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>You are all caught up! Wait for an admin to assign new deliveries.</p>
        </div>
      ) : (
        <div className="card-grid">
          {assignedOrders.map(order => {
            const customer = getCustomerInfo(order.customerId);
            return (
              <div key={order.id} className="card" style={{ 
                display: 'flex', flexDirection: 'column', gap: '1rem',
                borderTop: order.status === 'Pending' ? '4px solid #f59e0b' : '4px solid #10b981'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{getProductName(order.productId)}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Order #{order.id}</p>
                    </div>
                  </div>
                  
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: order.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: order.status === 'Pending' ? '#d97706' : '#10b981'
                  }}>
                    {order.status === 'Pending' ? <Clock size={14} /> : <CheckCircle size={14} />}
                    {order.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(156, 163, 175, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <MapPin size={16} />
                    <span>Customer: {customer?.name} ({customer?.email})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <Clock size={16} />
                    <span>Assigned: {format(new Date(order.date), 'dd MMM yyyy, hh:mm a')}</span>
                  </div>
                </div>

                {order.status === 'Pending' && (
                  <button 
                    className="btn" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }} 
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                  >
                    <CheckCircle size={18} />
                    Mark as Delivered
                  </button>
                )}
              </div>
            );
          })}
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
  position: 'relative',
  flex: 1,
  minWidth: 0
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
