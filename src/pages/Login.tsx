import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, User } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '2rem' }}>
        <LanguageSwitcher />
      </div>
      
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{t('nav.login')}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn" 
            onClick={() => navigate('/admin')}
            style={{ padding: '1rem' }}
          >
            <ShieldAlert size={20} />
            Login as Admin
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate('/customer')}
            style={{ padding: '1rem', border: '1px solid #10b981', color: '#10b981' }}
          >
            <User size={20} />
            Login as Customer
          </button>
        </div>
      </div>
    </div>
  );
}
