import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { format } from 'date-fns';
import { PackageOpen, Clock, Calendar, Hash, ShoppingBag, CheckCircle } from 'lucide-react';

export default function CustomerOrders() {
  const { t, i18n } = useTranslation();
  const { orders, products, currentUser } = useStore();

  const myOrders = orders.filter(o => o.customerId === currentUser?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 'Unknown';
    return i18n.language === 'ta' ? product.name.ta : product.name.en;
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>My Orders</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Track your recent purchases and delivery status</p>
        </div>
      </div>
      
      {myOrders.length === 0 ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', padding: '4rem 2rem', background: 'var(--surface-color)', 
          borderRadius: '16px', border: '1px dashed rgba(156, 163, 175, 0.4)' 
        }}>
          <PackageOpen size={64} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Looks like you haven't placed any orders yet.<br />Go to the Dashboard to place your first order!</p>
        </div>
      ) : (
        <div className="card-grid">
          {myOrders.map(order => (
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
                    <ShoppingBag size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{getProductName(order.productId)}</h4>
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
                  <Hash size={16} />
                  <span style={{ fontFamily: 'monospace' }}>{order.id}</span>
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
