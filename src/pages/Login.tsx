import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, AlertCircle } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

import { useStore } from '../context/StoreContext';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { users, login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Dynamic Authentication Logic
    const user = users.find(u => 
      u.name.toLowerCase() === username.toLowerCase() || 
      u.email.toLowerCase() === username.toLowerCase()
    );

    if (user && user.password === password) {
      login(user);
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin');
      } else if (user.role === 'delivery_boy') {
        navigate('/delivery');
      } else {
        navigate('/customer');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '2rem' }}>
        <LanguageSwitcher />
      </div>
      
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', textAlign: 'center' }}>
          {t('nav.login')}
        </h2>
        
        {error && (
          <div className="alert" style={{ marginBottom: '1.5rem', padding: '0.75rem' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(156, 163, 175, 0.4)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
              placeholder="Enter Admin or User"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(156, 163, 175, 0.4)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
              placeholder="Test@123"
              required
            />
          </div>

          <button 
            type="submit"
            className="btn" 
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            <LogIn size={18} />
            Login
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <button 
            onClick={() => navigate('/signup')} 
            style={{ 
              background: 'none', border: 'none', color: 'var(--primary-color)', 
              fontWeight: 600, cursor: 'pointer', padding: 0 
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
