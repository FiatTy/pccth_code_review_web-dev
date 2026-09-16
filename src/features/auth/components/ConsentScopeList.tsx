import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { scopeLabelKey } from '@/features/auth/lib/oauth-consent';

interface ConsentScopeListProps {
  scopes: string[];
  granted?: boolean;
}

export function ConsentScopeList({ scopes, granted = false }: ConsentScopeListProps) {
  const { t } = useTranslation();

  return (
    <ul className="overflow-hidden rounded-xl border border-border bg-bg">
      {scopes.map((scope) => (
        <li key={scope} className="flex items-start gap-3 border-t border-border px-4 py-3.5 first:border-t-0">
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              granted ? 'bg-surface-2 text-faint' : 'bg-primary-subtle text-primary'
            }`}
          >
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-semibold leading-snug">{t(scopeLabelKey(scope))}</span>
            <span className="mt-0.5 block font-mono text-[11px] text-faint">{scope}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
