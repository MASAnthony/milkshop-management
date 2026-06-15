import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('appLanguage', lng);
  };

  return (
    <div className="language-switcher">
      <Globe size={18} style={{ color: 'var(--text-secondary)', marginLeft: '0.25rem' }} />
      <button 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
      <span style={{ color: 'var(--text-secondary)', margin: '0 0.25rem', opacity: 0.6 }}>|</span>
      <button 
        className={`lang-btn ${i18n.language === 'ta' ? 'active' : ''}`}
        onClick={() => changeLanguage('ta')}
      >
        தமிழ்
      </button>
    </div>
  );
}
