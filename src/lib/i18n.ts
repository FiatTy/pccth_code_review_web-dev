import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import th from '@/locales/th.json';

export const SUPPORTED_LANGUAGES = ['en', 'th'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const LANGUAGE_STORAGE_KEY = 'app_lang';

/**
 * Keeps <html lang> in sync with the active language so locale-dependent
 * browser UI — native date pickers, `<input type="date">` formatting, spell
 * check — follows the app language (e.g. Thai calendar when switched to TH).
 */
function syncDocumentLang(lng?: string): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng ?? i18n.resolvedLanguage ?? 'en';
  }
}

i18n.on('languageChanged', syncDocumentLang);

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
    },
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => syncDocumentLang());

export default i18n;
