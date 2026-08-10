import { useTranslation } from 'react-i18next';

const SEVERITY_META: Record<string, { labelKey: string; text: string; dot: string }> = {
  BLOCKER: {
    labelKey: 'ISSUE.BLOCKER',
    text: 'text-blocker',
    dot: 'bg-blocker',
  },
  CRITICAL: {
    labelKey: 'ISSUE.CRITICAL',
    text: 'text-critical',
    dot: 'bg-critical',
  },
  MAJOR: { labelKey: 'ISSUE.MAJOR', text: 'text-major', dot: 'bg-major' },
  MINOR: { labelKey: 'ISSUE.MINOR', text: 'text-minor', dot: 'bg-minor' },
  INFO: { labelKey: 'ISSUE.INFO', text: 'text-faint', dot: 'bg-faint' },
};

export function IssueSeverityCell({ severity }: { severity: string }) {
  const { t } = useTranslation();
  const meta = SEVERITY_META[severity] ?? SEVERITY_META.INFO;
  return (
    <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
      <span className={`h-2 w-2 rounded-full shrink-0 ${meta.dot}`} />
      <span className={`text-xs sm:text-sm font-medium ${meta.text}`}>{t(meta.labelKey)}</span>
    </div>
  );
}
