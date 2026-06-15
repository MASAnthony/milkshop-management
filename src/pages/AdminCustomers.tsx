import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { User } from '../context/StoreContext';
import { User as UserIcon, Trash2, Plus, X, Pencil, Users, Shield, UserCheck, MapPin } from 'lucide-react';

export default function AdminCustomers() {
  const { users, deleteUser, registerUser, updateUser, currentUser } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' as User['role'],
    phoneNumber: '',
    deliveryAddress: '',
    assignedRoute: '',
    profilePhoto: undefined as string | undefined
  });
  
  const [error, setError] = useState('');

  const openModal = (user?: User) => {
    if (user) {
      setIsEditing(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password || '',
        role: user.role,
        phoneNumber: user.phoneNumber || '',
        deliveryAddress: user.deliveryAddress || '',
        assignedRoute: user.assignedRoute || '',
        profilePhoto: user.profilePhoto
      });
    } else {
      setIsEditing(null);
      setFormData({
        name: '', email: '', password: '', role: 'customer', phoneNumber: '', deliveryAddress: '', assignedRoute: '', profilePhoto: undefined
      });
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
        setFormData({ ...formData, profilePhoto: reader.result as string });
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check email uniqueness
    if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== isEditing)) {
      setError('An account with this email already exists.');
      return;
    }

    if (formData.role === 'super_admin' && currentUser?.role !== 'super_admin') {
      setError('Only Super Admins can create other Super Admins.');
      return;
    }
    
    if (isEditing) {
      updateUser(isEditing, formData);
    } else {
      registerUser(formData);
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

  const adminCount = users.filter(u => u.role === 'admin').length;
  const customerCount = users.filter(u => u.role === 'customer').length;
  const deliveryBoyCount = users.filter(u => u.role === 'delivery_boy').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.2rem', fontWeight: 700 }}>User Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage administrators, customers, and delivery boys</p>
        </div>
        <button className="btn" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
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

        <div className="metric-card" style={metricCardStyle('linear-gradient(135deg, #ec4899 0%, #db2777 100%)')}>
          <div style={metricIconWrapperStyle('rgba(255,255,255,0.2)')}>
            <MapPin size={24} color="#fff" />
          </div>
          <div style={metricContentStyle}>
            <p style={metricLabelStyle}>Delivery Partners</p>
            <h3 style={metricValueStyle}>{deliveryBoyCount}</h3>
          </div>
          <MapPin size={40} color="rgba(255,255,255,0.1)" style={metricBgIconStyle} />
        </div>
      </div>
      
      <div className="table-container">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem 1.5rem' }}>User Info</th>
              <th style={{ padding: '1rem 1.5rem' }}>Contact</th>
              <th style={{ padding: '1rem 1.5rem' }}>Role & Details</th>
              <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(156, 163, 175, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon size={24} color="var(--text-secondary)" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {user.name}
                      {user.id === currentUser?.id && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--primary-color)' }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{user.email}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.phoneNumber || '—'}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ marginBottom: '0.4rem' }}>
                    <span className={`badge badge-${user.role === 'customer' ? 'success' : user.role === 'delivery_boy' ? 'warning' : 'primary'}`}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {user.role === 'delivery_boy' && user.assignedRoute && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Route: {user.assignedRoute}</div>
                  )}
                  {user.role === 'customer' && user.deliveryAddress && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Addr: {user.deliveryAddress}</div>
                  )}
                </td>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => openModal(user)}
                    disabled={user.role === 'super_admin' && currentUser?.role !== 'super_admin'}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', opacity: (user.role === 'super_admin' && currentUser?.role !== 'super_admin') ? 0.3 : 1 }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user)}
                    disabled={user.id === currentUser?.id || (user.role === 'super_admin' && currentUser?.role !== 'super_admin')}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', color: 'var(--danger-color)', borderColor: 'var(--surface-border)', opacity: (user.id === currentUser?.id || (user.role === 'super_admin' && currentUser?.role !== 'super_admin')) ? 0.3 : 1 }}
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
          backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '1rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              {isEditing ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSaveUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Profile Photo */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '2px dashed var(--primary-color)' }}>
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={32} color="var(--primary-color)" />
                  )}
                </div>
                <div>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', marginBottom: '0.5rem' }}>
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                  {error && <div style={{ color: 'var(--danger-color)', fontSize: '0.85rem' }}>{error}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Role</label>
                <select 
                  className="form-select"
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value as User['role']})}
                  disabled={isEditing === (currentUser?.id ?? '') || (!!isEditing && formData.role === 'super_admin' && currentUser?.role !== 'super_admin')}
                >
                  <option value="customer">Customer</option>
                  <option value="delivery_boy">Delivery Partner</option>
                  <option value="admin">Administrator</option>
                  {(currentUser?.role === 'super_admin' || formData.role === 'super_admin') && (
                    <option value="super_admin">Super Admin</option>
                  )}
                </select>
              </div>

              {formData.role === 'delivery_boy' && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Assigned Route (Zone)</label>
                  <input type="text" className="form-input" value={formData.assignedRoute} onChange={(e) => setFormData({...formData, assignedRoute: e.target.value})} placeholder="e.g. North Zone, Sector 4" />
                </div>
              )}

              {formData.role === 'customer' && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Delivery Address</label>
                  <textarea className="form-input" rows={2} value={formData.deliveryAddress} onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})} />
                </div>
              )}

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Create User'}</button>
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
  background, display: 'flex', alignItems: 'center', gap: '1.2rem',
});

const metricIconWrapperStyle = (bg: string): React.CSSProperties => ({
  background: bg, padding: '1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
});

const metricContentStyle: React.CSSProperties = {
  zIndex: 1, position: 'relative', flex: 1, minWidth: 0
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.95rem', fontWeight: 500, opacity: 0.9, marginBottom: '0.2rem'
};

const metricValueStyle: React.CSSProperties = {
  fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em'
};

const metricBgIconStyle: React.CSSProperties = {
  position: 'absolute', right: '-15px', bottom: '-15px', transform: 'scale(2.5)', opacity: 0.15, zIndex: 0
};
