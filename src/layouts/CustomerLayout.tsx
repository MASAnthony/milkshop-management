import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LogOut } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function CustomerLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic mock logout
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="brand" style={{ color: '#10b981' }}>
          <User size={24} />
          {t('header.title')} (Customer)
        </div>
        
        <nav className="nav-menu">
          <Link to="/customer" className="nav-link">{t('nav.dashboard')}</Link>
          <Link to="/customer/my-orders" className="nav-link">{t('nav.orders')}</Link>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', marginLeft: '1rem' }}>
            <LogOut size={16} />
            {t('nav.logout')}
          </button>
        </nav>

        <LanguageSwitcher />
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
