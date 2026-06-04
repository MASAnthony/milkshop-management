import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ta } from 'date-fns/locale';


export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [currentDate] = useState(new Date('2026-06-03T10:30:00'));
  const currentLocale = i18n.language === 'ta' ? ta : enUS;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{t('nav.dashboard')}</h2>
        <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
          {format(currentDate, 'dd MMMM yyyy', { locale: currentLocale })}
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 className="card-title">{t('common.deliverySchedule')}</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('common.morningShift')}</span>
              <span style={{ color: 'var(--text-secondary)' }}>06:00 AM</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('common.eveningShift')}</span>
              <span style={{ color: 'var(--text-secondary)' }}>04:00 PM</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">{t('nav.orders')} Management</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Review all incoming orders and update delivery status.</p>
          <button className="btn">View All Orders</button>
        </div>
      </div>
    </>
  );
}
