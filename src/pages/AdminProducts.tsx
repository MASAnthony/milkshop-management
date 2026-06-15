import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import type { Product } from '../context/StoreContext';
import { Plus, X, Package, Star, Edit } from 'lucide-react';

export default function AdminProducts() {
  const { t, i18n } = useTranslation();
  const { products, orders, addProduct, updateProduct } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameTa: '',
    price: '',
    descEn: '',
    descTa: '',
    unit: '500ml',
    stockStatus: 'In Stock' as 'In Stock' | 'Out of Stock',
    imageUrl: ''
  });

  const openModal = (product?: Product) => {
    if (product) {
      setIsEditing(product.id);
      setFormData({
        nameEn: typeof product.name === 'string' ? product.name : (product.name?.en || ''),
        nameTa: typeof product.name === 'string' ? product.name : (product.name?.ta || ''),
        price: product.price ? product.price.toString() : '0',
        descEn: typeof product.description === 'string' ? product.description : (product.description?.en || ''),
        descTa: typeof product.description === 'string' ? product.description : (product.description?.ta || ''),
        unit: product.unit,
        stockStatus: product.stockStatus,
        imageUrl: product.imageUrl || ''
      });
    } else {
      setIsEditing(null);
      setFormData({
        nameEn: '', nameTa: '', price: '', descEn: '', descTa: '', unit: '500ml', stockStatus: 'In Stock', imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: { en: formData.nameEn, ta: formData.nameTa },
      price: parseFloat(formData.price) || 0,
      description: { en: formData.descEn, ta: formData.descTa },
      unit: formData.unit,
      stockStatus: formData.stockStatus,
      imageUrl: formData.imageUrl
    };

    if (isEditing) {
      updateProduct(isEditing, productData);
    } else {
      addProduct(productData);
    }
    closeModal();
  };

  // Calculate top product
  const productOrderCounts = products.map(p => ({
    id: p.id,
    name: typeof p.name === 'string' ? p.name : (i18n.language === 'ta' ? p.name?.ta : p.name?.en) || 'Unknown',
    count: orders.filter(o => o.productId === p.id).length
  })).sort((a, b) => b.count - a.count);

  const topProduct = productOrderCounts.length > 0 && productOrderCounts[0].count > 0 
    ? productOrderCounts[0].name 
    : 'None yet';

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem', fontWeight: 700 }}>{t('nav.products')} Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage your catalog, pricing, and stock</p>
        </div>
        <button className="btn" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
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
            <h3 style={{ ...metricValueStyle, fontSize: '1.4rem', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topProduct}</h3>
          </div>
          <Star size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>

      <div className="card-grid">
        {products.map(product => (
          <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name.en} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '180px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={48} color="var(--primary-color)" opacity={0.5} />
              </div>
            )}
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  {typeof product.name === 'string' ? product.name : (i18n.language === 'ta' ? product.name?.ta : product.name?.en)}
                </h3>
                <span className={`badge badge-${product.stockStatus === 'In Stock' ? 'success' : 'danger'}`}>
                  {product.stockStatus}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '1.1rem' }}>₹{product.price}</span>
                <span>•</span>
                <span>{product.unit}</span>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description ? (typeof product.description === 'string' ? product.description : (i18n.language === 'ta' ? product.description.ta : product.description.en)) : 'No description'}
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => openModal(product)}>
                  <Edit size={16} /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '1rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Image URL</label>
                <input type="url" className="form-input" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              
              <div className="form-group">
                <label className="form-label">Name (English)</label>
                <input type="text" className="form-input" value={formData.nameEn} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Name (Tamil)</label>
                <input type="text" className="form-input" value={formData.nameTa} onChange={(e) => setFormData({...formData, nameTa: e.target.value})} required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" className="form-input" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Size</label>
                <input type="text" className="form-input" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} placeholder="e.g. 500ml, 1L" required />
              </div>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Stock Status</label>
                <select className="form-select" value={formData.stockStatus} onChange={(e) => setFormData({...formData, stockStatus: e.target.value as any})}>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description (English)</label>
                <textarea className="form-input" rows={2} value={formData.descEn} onChange={(e) => setFormData({...formData, descEn: e.target.value})} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description (Tamil)</label>
                <textarea className="form-input" rows={2} value={formData.descTa} onChange={(e) => setFormData({...formData, descTa: e.target.value})} required />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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
  position: 'relative',
  flex: 1,
  minWidth: 0
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
