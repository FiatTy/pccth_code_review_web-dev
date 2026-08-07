import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/i18n';

interface StableTextProps {
  children: (lang: SupportedLanguage) => ReactNode;
  className?: string;
  itemClassName?: string;
}

/**
 * Renders `children` once per supported language, stacks every result in a
 * single grid cell and paints only the active one. The cell therefore reserves
 * the width *and* height of the largest translation, so switching language
 * never reflows anything around it.
 *
 * Inactive variants use `invisible` (visibility: hidden): they keep their
 * layout box but are skipped by assistive tech and pointer events.
 */
export function StableText({ children, className, itemClassName }: StableTextProps) {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <span className={`grid ${className ?? ''}`}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <span
          key={lang}
          aria-hidden={lang !== current}
          className={`col-start-1 row-start-1 ${lang === current ? '' : 'invisible'} ${
            itemClassName ?? ''
          }`}
        >
          {children(lang)}
        </span>
      ))}
    </span>
  );
}

interface StableLabelProps {
  i18nKey: string;
  className?: string;
}

/**
 * Single-line translated label that occupies the same box in every language —
 * the common case of {@link StableText}. Used for header and hero controls that
 * would otherwise slide sideways when the language changes, because TH labels
 * are wider than their EN counterparts.
 */
export function StableLabel({ i18nKey, className }: StableLabelProps) {
  const { t } = useTranslation();

  return (
    <StableText
      className={`justify-items-center ${className ?? ''}`}
      itemClassName="whitespace-nowrap"
    >
      {(lang) => t(i18nKey, { lng: lang })}
    </StableText>
  );
}
