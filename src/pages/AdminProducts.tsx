import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import type { Product } from '../context/StoreContext';
import { Plus, X, Package, Star } from 'lucide-react';

export default function AdminProducts() {
  const { t, i18n } = useTranslation();
  const { products, orders, addProduct, updateProduct } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameTa, setNameTa] = useState('');

  const openModal = (product?: Product) => {
    if (product) {
      setIsEditing(product.id);
      setNameEn(product.name.en);
      setNameTa(product.name.ta);
    } else {
      setIsEditing(null);
      setNameEn('');
      setNameTa('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(null);
    setNameEn('');
    setNameTa('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct(isEditing, nameEn, nameTa);
    } else {
      addProduct(nameEn, nameTa);
    }
    closeModal();
  };

  // Calculate top product
  const productOrderCounts = products.map(p => ({
    id: p.id,
    name: i18n.language === 'ta' ? p.name.ta : p.name.en,
    count: orders.filter(o => o.productId === p.id).length
  })).sort((a, b) => b.count - a.count);

  const topProduct = productOrderCounts.length > 0 && productOrderCounts[0].count > 0 
    ? productOrderCounts[0].name 
    : 'None yet';

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{t('nav.products')} Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage your catalog and offerings</p>
        </div>
        <button className="btn" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #10b981 0%, #059669 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Package size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Total Products</p>
            <h3 style={metricValueStyle}>{products.length}</h3>
          </div>
          <Package size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Star size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Most Popular</p>
            <h3 style={{ ...metricValueStyle, fontSize: '1.2rem', marginTop: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topProduct}</h3>
          </div>
          <Star size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>

      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>
              {i18n.language === 'ta' ? product.name.ta : product.name.en}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              ID: {product.id}
            </p>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              onClick={() => openModal(product)}
            >
              {t('actions.edit')}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '1rem', position: 'relative' }}>
            <button 
              onClick={closeModal}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name (English)</label>
                <input 
                  type="text" 
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.6rem', borderRadius: '6px',
                    border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name (Tamil)</label>
                <input 
                  type="text" 
                  value={nameTa}
                  onChange={(e) => setNameTa(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.6rem', borderRadius: '6px',
                    border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal} style={{ padding: '0.6rem 1rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>
                  {isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
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
