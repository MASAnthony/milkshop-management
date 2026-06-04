import { useTranslation } from 'react-i18next';
import { Package, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

import { useStore } from '../context/StoreContext';

export default function CustomerDashboard() {
  const { t, i18n } = useTranslation();
  const { products, placeOrder, currentUser } = useStore();

  const handlePlaceOrder = (productId: string) => {
    if (!currentUser) return;
    placeOrder(productId, currentUser.id);
    alert('Order Placed Successfully!');
  };

  const getProductName = (product: any) => {
    return i18n.language === 'ta' ? product.name.ta : product.name.en;
  };

  const myOrders = currentUser ? useStore().orders.filter(o => o.customerId === currentUser.id) : [];
  const pendingOrders = myOrders.filter(o => o.status === 'Pending').length;
  const deliveredOrders = myOrders.filter(o => o.status === 'Delivered').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Attractive Banner Image */}
      <div style={{ 
        width: '100%', 
        height: '240px', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        marginBottom: '2rem',
        position: 'relative',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <img 
          src="/images/banner.png" 
          alt="Fresh Milk Delivery" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', 
          padding: '2rem' 
        }}>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Welcome, {currentUser?.name || 'Customer'}!</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Fresh farm milk, delivered straight to your doorstep.</p>
        </div>
      </div>

      {/* Header and Welcome Text are now integrated into the banner, so removing the old header */}
      
      {/* Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2.5rem' 
      }}>
        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <ShoppingBag size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>My Total Orders</p>
            <h3 style={metricValueStyle}>{myOrders.length}</h3>
          </div>
          <ShoppingBag size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #f59e0b 0%, #d97706 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Clock size={24} color="#fff" />
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
            <p style={metricLabelStyle}>Successfully Delivered</p>
            <h3 style={metricValueStyle}>{deliveredOrders}</h3>
          </div>
          <CheckCircle size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{t('nav.products')} Available</h3>
      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <Package size={24} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{getProductName(product)}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Fresh & Healthy</p>
              </div>
            </div>
            
            <button 
              className="btn" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }} 
              onClick={() => handlePlaceOrder(product.id)}
            >
              <ShoppingBag size={18} />
              {t('actions.placeOrder')}
            </button>
          </div>
        ))}
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
