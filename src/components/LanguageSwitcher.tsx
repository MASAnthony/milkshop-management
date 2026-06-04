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
      <Globe size={16} color="var(--text-secondary)" />
      <button 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
      <span style={{ color: 'var(--text-secondary)' }}>|</span>
      <button 
        className={`lang-btn ${i18n.language === 'ta' ? 'active' : ''}`}
        onClick={() => changeLanguage('ta')}
      >
        தமிழ்
      </button>
    </div>
  );
}
