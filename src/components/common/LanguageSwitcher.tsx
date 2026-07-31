import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-surface/60 p-0.5 backdrop-blur">
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = current === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => void i18n.changeLanguage(lang)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide transition-all ${
              active
                ? 'bg-primary text-primary-fg shadow-sm shadow-primary/30'
                : 'text-muted hover:text-fg'
            }`}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}
