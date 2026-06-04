import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import type { User } from '../context/StoreContext';
import { User as UserIcon, Trash2, Plus, X, Pencil, Users, Shield, UserCheck } from 'lucide-react';

export default function AdminCustomers() {
  const { t } = useTranslation();
  const { users, updateUserRole, deleteUser, registerUser, updateUser, currentUser } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('customer');
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const openModal = (user?: User) => {
    if (user) {
      setIsEditing(user.id);
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password || '');
      setRole(user.role);
      setProfilePhoto(user.profilePhoto);
    } else {
      setIsEditing(null);
      setName('');
      setEmail('');
      setPassword('');
      setRole('customer');
      setProfilePhoto(undefined);
    }
    setError('');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
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

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check email uniqueness, ignoring the current user if editing
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== isEditing)) {
      setError('An account with this email already exists.');
      return;
    }

    if (role === 'super_admin' && currentUser?.role !== 'super_admin') {
      setError('Only Super Admins can create other Super Admins.');
      return;
    }
    
    if (isEditing) {
      updateUser(isEditing, { name, email, password, role, profilePhoto });
    } else {
      registerUser({ name, email, password, role, profilePhoto });
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    if (user.role === 'super_admin') {
      const superAdminCount = users.filter(u => u.role === 'super_admin').length;
      if (superAdminCount <= 1) {
        alert('Cannot delete the last Super Admin.');
        return;
      }
    }
    deleteUser(user.id);
  };

  const superAdminCount = users.filter(u => u.role === 'super_admin').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const customerCount = users.filter(u => u.role === 'customer').length;
  const deliveryBoyCount = users.filter(u => u.role === 'delivery_boy').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>User Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Manage system administrators and customers</p>
        </div>
        <button className="btn" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Users size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Total Users</p>
            <h3 style={metricValueStyle}>{users.length}</h3>
          </div>
          <Users size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #f59e0b 0%, #d97706 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <Shield size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Administrators</p>
            <h3 style={metricValueStyle}>{adminCount}</h3>
          </div>
          <Shield size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #10b981 0%, #059669 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <UserCheck size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Customers</p>
            <h3 style={metricValueStyle}>{customerCount}</h3>
          </div>
          <UserCheck size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>

      
      <div style={{ background: 'var(--surface-color)', borderRadius: '12px', padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <th style={{ padding: '1rem 0' }}>Profile</th>
              <th style={{ padding: '1rem 0' }}>Name</th>
              <th style={{ padding: '1rem 0' }}>Email</th>
              <th style={{ padding: '1rem 0' }}>Role</th>
              <th style={{ padding: '1rem 0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '1rem 0' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    backgroundColor: 'rgba(156, 163, 175, 0.2)', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    overflow: 'hidden'
                  }}>
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon size={20} color="var(--text-secondary)" />
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                  {user.name}
                  {user.id === currentUser?.id && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--primary-color)' }}>(You)</span>}
                </td>
                <td style={{ padding: '1rem 0' }}>{user.email}</td>
                <td style={{ padding: '1rem 0' }}>
                  <select 
                    value={user.role} 
                    onChange={(e) => updateUserRole(user.id, e.target.value as User['role'])}
                    disabled={user.id === currentUser?.id || (user.role === 'super_admin' && currentUser?.role !== 'super_admin')}
                    style={{
                      padding: '0.4rem', borderRadius: '4px',
                      border: '1px solid rgba(156, 163, 175, 0.4)',
                      background: 'transparent', color: 'var(--text-primary)'
                    }}
                  >
                    <option value="customer">Customer</option>
                    <option value="delivery_boy">Delivery Boy</option>
                    <option value="admin">Admin</option>
                    {(currentUser?.role === 'super_admin' || user.role === 'super_admin') && (
                      <option value="super_admin">Super Admin</option>
                    )}
                  </select>
                </td>
                <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openModal(user)}
                    disabled={user.role === 'super_admin' && currentUser?.role !== 'super_admin'}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem', color: 'var(--text-secondary)', background: 'transparent', opacity: (user.role === 'super_admin' && currentUser?.role !== 'super_admin') ? 0.3 : 1 }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user)}
                    disabled={user.id === currentUser?.id || (user.role === 'super_admin' && currentUser?.role !== 'super_admin')}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem', color: 'var(--error-color)', borderColor: 'var(--error-color)', background: 'transparent', opacity: (user.id === currentUser?.id || (user.role === 'super_admin' && currentUser?.role !== 'super_admin')) ? 0.3 : 1 }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '1rem', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
              {isEditing ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Profile Photo Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  width: '60px', height: '60px', borderRadius: '50%', 
                  backgroundColor: 'rgba(156, 163, 175, 0.2)', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  overflow: 'hidden', border: '1px dashed var(--primary-color)'
                }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={24} color="var(--text-secondary)" />
                  )}
                </div>
                
                <label style={{ cursor: 'pointer', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 500 }}>
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
                {error && <span style={{ color: 'var(--error-color)', fontSize: '0.8rem' }}>{error}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.6rem', borderRadius: '6px',
                    border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.6rem', borderRadius: '6px',
                    border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.6rem', borderRadius: '6px',
                    border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as User['role'])}
                  disabled={isEditing === currentUser?.id || (isEditing && role === 'super_admin' && currentUser?.role !== 'super_admin')}
                  style={{
                    width: '100%', padding: '0.6rem', borderRadius: '6px',
                    border: '1px solid rgba(156, 163, 175, 0.4)', background: 'transparent',
                    color: 'var(--text-primary)',
                    opacity: (isEditing === currentUser?.id || (isEditing && role === 'super_admin' && currentUser?.role !== 'super_admin')) ? 0.6 : 1
                  }}
                >
                  <option value="customer">Customer</option>
                  <option value="delivery_boy">Delivery Boy</option>
                  <option value="admin">Admin</option>
                  {(currentUser?.role === 'super_admin' || role === 'super_admin') && (
                    <option value="super_admin">Super Admin</option>
                  )}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn" style={{ padding: '0.6rem 1rem' }}>
                  {isEditing ? 'Save Changes' : 'Create User'}
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
