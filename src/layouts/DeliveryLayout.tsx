import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, LogOut } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useStore } from '../context/StoreContext';

export default function DeliveryLayout() {
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
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {currentUser?.profilePhoto ? (
            <img 
              src={currentUser.profilePhoto} 
              alt="Profile" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <Truck size={24} />
          )}
          <span>{currentUser?.name || 'Delivery'} (Delivery Boy)</span>
        </div>
        
        <nav className="nav-menu">
          <NavLink to="/delivery" end className="nav-link">{t('nav.dashboard')}</NavLink>
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
