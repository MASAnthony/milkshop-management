import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingBag, Clock, Repeat, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../context/StoreContext';

export default function CustomerDashboard() {
  const { i18n } = useTranslation();
  const { products, placeOrder, addSubscription, currentUser, orders, subscriptions } = useStore();

  const [orderModal, setOrderModal] = useState<{ isOpen: boolean, product: Product | null, isSubscription: boolean }>({
    isOpen: false, product: null, isSubscription: false
  });
  
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState<'Daily' | 'Alternate Days' | 'Weekly'>('Daily');

  const getProductName = (product: Product | any) => {
    if (!product || !product.name) return 'Unknown';
    if (typeof product.name === 'string') return product.name;
    return i18n.language === 'ta' ? product.name.ta : product.name.en;
  };

  const myOrders = currentUser ? orders.filter(o => o.customerId === currentUser.id) : [];
  const pendingOrders = myOrders.filter(o => o.status === 'Pending' || o.status === 'Out for Delivery').length;
  const mySubscriptions = currentUser ? subscriptions.filter(s => s.customerId === currentUser.id && s.status === 'Active') : [];

  const handleOpenModal = (product: Product, isSub: boolean) => {
    setOrderModal({ isOpen: true, product, isSubscription: isSub });
    setQuantity(1);
    setFrequency('Daily');
  };

  const handleConfirm = () => {
    if (!currentUser || !orderModal.product) return;
    
    if (orderModal.isSubscription) {
      addSubscription({
        customerId: currentUser.id,
        productId: orderModal.product.id,
        quantity,
        frequency
      });
      alert('Subscription started successfully!');
    } else {
      placeOrder({
        productId: orderModal.product.id,
        customerId: currentUser.id,
        quantity,
        totalAmount: orderModal.product.price * quantity,
        deliveryAddress: currentUser.deliveryAddress || 'Address not provided',
        paymentMethod: 'Cash',
        paymentStatus: 'Pending',
      });
      alert('Order Placed Successfully!');
    }
    
    setOrderModal({ isOpen: false, product: null, isSubscription: false });
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Attractive Banner Image */}
      <div style={{ 
        width: '100%', height: '240px', borderRadius: 'var(--border-radius)', 
        overflow: 'hidden', marginBottom: '2.5rem', position: 'relative',
        boxShadow: 'var(--glass-shadow)'
      }}>
        <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80" alt="Fresh Milk" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', padding: '2rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.2rem' }}>Welcome, {currentUser?.name || 'Customer'}!</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>Fresh farm milk, delivered straight to your doorstep.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Repeat size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Active Subscriptions</p>
            <h3 style={metricValueStyle}>{mySubscriptions.length}</h3>
          </div>
          <Repeat size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
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
            <ShoppingBag size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Total Orders</p>
            <h3 style={metricValueStyle}>{myOrders.length}</h3>
          </div>
          <ShoppingBag size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Available Products</h3>
      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={typeof product.name === 'string' ? product.name : product.name?.en} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '160px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={48} color="var(--primary-color)" opacity={0.5} />
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{getProductName(product)}</h4>
                <span className={`badge badge-${product.stockStatus === 'In Stock' ? 'success' : 'danger'}`}>
                  {product.stockStatus}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description ? (typeof product.description === 'string' ? product.description : (i18n.language === 'ta' ? product.description.ta : product.description.en)) : 'No description'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 600, color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                ₹{product.price} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ {product.unit}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button className="btn btn-secondary" disabled={product.stockStatus === 'Out of Stock'} onClick={() => handleOpenModal(product, false)} style={{ padding: '0.6rem' }}>
                  <ShoppingBag size={18} /> Buy Once
                </button>
                <button className="btn" disabled={product.stockStatus === 'Out of Stock'} onClick={() => handleOpenModal(product, true)} style={{ padding: '0.6rem' }}>
                  <Repeat size={18} /> Subscribe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orderModal.isOpen && orderModal.product && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '1rem', position: 'relative' }}>
            <button onClick={() => setOrderModal({ isOpen: false, product: null, isSubscription: false })} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
              {orderModal.isSubscription ? 'Setup Subscription' : 'Place Order'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{getProductName(orderModal.product)}</p>
            
            <div className="form-group">
              <label className="form-label">Quantity ({orderModal.product.unit})</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.5rem 1rem' }}>-</button>
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{quantity}</span>
                <button className="btn btn-secondary" onClick={() => setQuantity(quantity + 1)} style={{ padding: '0.5rem 1rem' }}>+</button>
              </div>
            </div>

            {orderModal.isSubscription && (
              <div className="form-group">
                <label className="form-label">Delivery Frequency</label>
                <select className="form-select" value={frequency} onChange={(e) => setFrequency(e.target.value as any)}>
                  <option value="Daily">Daily</option>
                  <option value="Alternate Days">Alternate Days</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            )}

            <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--primary-color)' }}>Total Price</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>₹{orderModal.product.price * quantity}{orderModal.isSubscription ? ' / delivery' : ''}</span>
            </div>

            <button className="btn" onClick={handleConfirm} style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>
              Confirm {orderModal.isSubscription ? 'Subscription' : 'Order'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .metric-card {
          position: relative; overflow: hidden; padding: 1.5rem; border-radius: var(--border-radius); color: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .metric-card:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 20px 30px -5px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
}

const metricCardStyle = (background: string): React.CSSProperties => ({ background, display: 'flex', alignItems: 'center', gap: '1.2rem' });
const metricIconWrapperStyle = (bg: string): React.CSSProperties => ({ background: bg, padding: '1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' });
const metricContentStyle: React.CSSProperties = { zIndex: 1, position: 'relative', flex: 1, minWidth: 0 };
const metricLabelStyle: React.CSSProperties = { fontSize: '0.95rem', fontWeight: 500, opacity: 0.9, marginBottom: '0.2rem' };
const metricValueStyle: React.CSSProperties = { fontSize: '2rem', fontWeight: 700, margin: 0 };
const metricBgIconStyle: React.CSSProperties = { position: 'absolute', right: '-15px', bottom: '-15px', transform: 'scale(2.5)', opacity: 0.15, zIndex: 0 };
