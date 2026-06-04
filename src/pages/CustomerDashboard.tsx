import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

const products = [
  {
    id: "1",
    name: {
      en: "Native Cow Milk",
      ta: "நாட்டு மாட்டு பால்"
    }
  },
  {
    id: "2",
    name: {
      en: "Jersey Cow Milk",
      ta: "ஜெர்சி பசு பால்"
    }
  }
];

export default function CustomerDashboard() {
  const { t, i18n } = useTranslation();

  const getProductName = (product: any) => {
    return i18n.language === 'ta' ? product.name.ta : product.name.en;
  };

  return (
    <>
      <div className="alert">
        <AlertCircle size={20} />
        <span>{t('validation.orderPlacementTimeEnded')}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('nav.dashboard')}</h2>
      </div>

      <div className="card-grid">
        {/* Dynamic Products Card */}
        <div className="card">
          <h3 className="card-title">{t('nav.products')}</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {products.map(product => (
              <li key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{getProductName(product)}</span>
                <button className="btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => alert(t('validation.orderPlacementTimeEnded'))}>
                  {t('actions.placeOrder')}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Settings / Actions Card */}
        <div className="card">
          <h3 className="card-title">My Settings</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and subscription here.</p>
          <div className="alert" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.9rem' }}>{t('validation.orderCancellationNotAllowed')}</span>
          </div>
        </div>
      </div>
    </>
  );
}
