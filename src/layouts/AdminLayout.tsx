import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, LogOut } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic mock logout
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="brand">
          <LayoutDashboard size={24} />
          {t('header.title')} (Admin)
        </div>
        
        <nav className="nav-menu">
          <Link to="/admin" className="nav-link">{t('nav.dashboard')}</Link>
          <Link to="/admin/customers" className="nav-link">{t('nav.customers')}</Link>
          <Link to="/admin/orders" className="nav-link">{t('nav.orders')}</Link>
          <Link to="/admin/products" className="nav-link">{t('nav.products')}</Link>
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
