import { useTranslation } from 'react-i18next';

/*
 * LanguageSwitcher — port of language-switcher.component.
 * Toggles between EN and TH; i18next persists the choice to localStorage.
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('th') ? 'th' : 'en';

  const setLang = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="lang-switcher">
      <button className={'lang-btn' + (current === 'en' ? ' active' : '')} onClick={() => setLang('en')}>EN</button>
      <button className={'lang-btn' + (current === 'th' ? ' active' : '')} onClick={() => setLang('th')}>TH</button>
    </div>
  );
}
