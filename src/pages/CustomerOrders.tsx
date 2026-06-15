import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { format } from 'date-fns';
import { PackageOpen, Clock, Calendar, Hash, ShoppingBag, CheckCircle, Repeat, PauseCircle } from 'lucide-react';

export default function CustomerOrders() {
  const { i18n } = useTranslation();
  const { orders, subscriptions, products, currentUser, updateSubscriptionStatus } = useStore();

  const myOrders = orders.filter(o => o.customerId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const mySubscriptions = subscriptions.filter(s => s.customerId === currentUser?.id).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.name) return 'Unknown';
    if (typeof product.name === 'string') return product.name;
    return i18n.language === 'ta' ? product.name.ta : product.name.en;
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem', fontWeight: 700 }}>My Orders & Subscriptions</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Track your purchases and manage active subscriptions</p>
        </div>
      </div>
      
      {/* Subscriptions Section */}
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Active Subscriptions</h3>
      {mySubscriptions.length === 0 ? (
         <div style={{ 
          padding: '2rem', background: 'var(--surface-color)', borderRadius: '16px', 
          border: '1px dashed rgba(156, 163, 175, 0.4)', marginBottom: '3rem', color: 'var(--text-secondary)'
        }}>
          You don't have any active subscriptions. Subscribe to a product for daily delivery!
        </div>
      ) : (
        <div className="card-grid" style={{ marginBottom: '3rem' }}>
          {mySubscriptions.map(sub => (
            <div key={sub.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: sub.status === 'Active' ? '4px solid #6366f1' : '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Repeat size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{getProductName(sub.productId)}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {sub.quantity} | {sub.frequency}</span>
                  </div>
                </div>
                
                <span className={`badge badge-${sub.status === 'Active' ? 'primary' : sub.status === 'Paused' ? 'warning' : 'danger'}`}>
                  {sub.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {sub.status === 'Active' ? (
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => updateSubscriptionStatus(sub.id, 'Paused')}>
                    <PauseCircle size={16} /> Pause
                  </button>
                ) : sub.status === 'Paused' ? (
                  <button className="btn" style={{ flex: 1, padding: '0.5rem' }} onClick={() => updateSubscriptionStatus(sub.id, 'Active')}>
                    <Repeat size={16} /> Resume
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Section */}
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Order History</h3>
      {myOrders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', background: 'var(--surface-color)', borderRadius: '16px', border: '1px dashed rgba(156, 163, 175, 0.4)' }}>
          <PackageOpen size={64} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Looks like you haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {myOrders.map(order => (
            <div key={order.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: order.status === 'Pending' ? '4px solid #f59e0b' : order.status === 'Delivered' ? '4px solid #10b981' : '4px solid #6366f1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{getProductName(order.productId)}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty: {order.quantity} | ₹{order.totalAmount}</span>
                  </div>
                </div>
                
                <span className={`badge badge-${order.status === 'Pending' ? 'warning' : order.status === 'Delivered' ? 'success' : 'primary'}`}>
                  {order.status === 'Pending' ? <Clock size={12} style={{marginRight: '4px'}}/> : order.status === 'Delivered' ? <CheckCircle size={12} style={{marginRight: '4px'}}/> : null}
                  {order.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(156, 163, 175, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Hash size={16} />
                  <span style={{ fontFamily: 'monospace' }}>{order.id.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Calendar size={16} />
                  <span>{format(new Date(order.date), 'dd MMM yyyy, hh:mm a')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
