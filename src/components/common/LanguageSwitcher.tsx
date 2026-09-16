import { useTranslation } from 'react-i18next';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const rawLang = (i18n.resolvedLanguage ?? i18n.language ?? 'th').toLowerCase();
  const isThai = rawLang.startsWith('th');

  function setLanguage(lang: 'th' | 'en') {
    void i18n.changeLanguage(lang);
  }

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`inline-flex items-center gap-0.5 rounded-full border border-border bg-surface/70 p-0.5 shadow-2xs backdrop-blur transition-all ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('th')}
        title="ภาษาไทย"
        aria-pressed={isThai}
        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide transition-all ${
          isThai
            ? 'bg-primary text-primary-fg shadow-sm shadow-primary/30'
            : 'text-muted hover:text-fg hover:bg-surface-2/60'
        }`}
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        title="English"
        aria-pressed={!isThai}
        className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide transition-all ${
          !isThai
            ? 'bg-primary text-primary-fg shadow-sm shadow-primary/30'
            : 'text-muted hover:text-fg hover:bg-surface-2/60'
        }`}
      >
        EN
      </button>
    </div>
  );
}
