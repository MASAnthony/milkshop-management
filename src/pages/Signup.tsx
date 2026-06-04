import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserPlus, Image as ImageIcon, AlertCircle } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Signup() {
  const navigate = useNavigate();
  const { users, registerUser } = useStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) { // 2MB limit
        setError('Image must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists.');
      return;
    }
    
    registerUser({
      name,
      email,
      password,
      role: 'customer', // Default to customer
      profilePhoto
    });
    
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: '1rem', right: '2rem' }}>
        <LanguageSwitcher />
      </div>
      
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', textAlign: 'center' }}>
          Create an Account
        </h2>
        
        {error && (
          <div className="alert" style={{ marginBottom: '1.5rem', padding: '0.75rem' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Profile Photo Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              backgroundColor: 'rgba(156, 163, 175, 0.2)', 
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              overflow: 'hidden', border: '2px dashed var(--primary-color)',
              position: 'relative'
            }}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={32} color="var(--text-secondary)" />
              )}
            </div>
            
            <label style={{ cursor: 'pointer', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 500 }}>
              Upload Photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Full Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                color: 'var(--text-primary)', fontSize: '1rem'
              }}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                color: 'var(--text-primary)', fontSize: '1rem'
              }}
              placeholder="john@example.com"
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
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                color: 'var(--text-primary)', fontSize: '1rem'
              }}
              placeholder="Choose a password"
              required
            />
          </div>

          <button 
            type="submit"
            className="btn" 
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            <UserPlus size={18} />
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <button 
            onClick={() => navigate('/login')} 
            style={{ 
              background: 'none', border: 'none', color: 'var(--primary-color)', 
              fontWeight: 600, cursor: 'pointer', padding: 0 
            }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
