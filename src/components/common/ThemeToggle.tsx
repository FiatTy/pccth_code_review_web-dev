import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import { getStoredTheme, setTheme, type Theme } from '@/lib/theme';

export function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
  const isDark = theme === 'dark';
  const label = isDark ? t('COMMON.SWITCH_LIGHT') : t('COMMON.SWITCH_DARK');

  function toggle() {
    const next: Theme = isDark ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/60 text-muted shadow-sm backdrop-blur transition-all duration-200 hover:border-border-strong hover:text-primary active:scale-95"
    >
      {isDark ? (
        <Sun size={16} className="transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon size={16} className="transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
