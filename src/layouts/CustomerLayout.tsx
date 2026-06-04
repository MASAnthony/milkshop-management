import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LogOut } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useStore } from '../context/StoreContext';

export default function CustomerLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="brand" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {currentUser?.profilePhoto ? (
            <img 
              src={currentUser.profilePhoto} 
              alt="Profile" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <User size={24} />
          )}
          <span>{currentUser?.name || 'Customer'}</span>
        </div>
        
        <nav className="nav-menu">
          <NavLink to="/customer" end className="nav-link">{t('nav.dashboard')}</NavLink>
          <NavLink to="/customer/my-orders" className="nav-link">{t('nav.orders')}</NavLink>
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
