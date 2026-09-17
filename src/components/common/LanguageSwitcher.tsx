import { useTranslation } from 'react-i18next';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const rawLang = (i18n.resolvedLanguage ?? i18n.language ?? 'th').toLowerCase();
  const isThai = rawLang.startsWith('th');

  function toggleLanguage() {
    const next = isThai ? 'en' : 'th';
    void i18n.changeLanguage(next);
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={isThai ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
      aria-label={isThai ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
      className={`group inline-flex items-center gap-0.5 rounded-full border border-border bg-surface/70 p-0.5 shadow-2xs backdrop-blur transition-all duration-200 hover:border-border-strong active:scale-95 cursor-pointer ${className}`}
    >
      <span
        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide transition-all ${
          isThai
            ? 'bg-primary text-primary-fg shadow-sm shadow-primary/30'
            : 'text-muted group-hover:text-fg'
        }`}
      >
        TH
      </span>
      <span
        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide transition-all ${
          !isThai
            ? 'bg-primary text-primary-fg shadow-sm shadow-primary/30'
            : 'text-muted group-hover:text-fg'
        }`}
      >
        EN
      </span>
    </button>
  );
}
