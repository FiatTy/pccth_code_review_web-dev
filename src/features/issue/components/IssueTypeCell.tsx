import { Bug, ShieldAlert, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Issue } from '@/types/issue';

const TYPE_META: Record<string, { labelKey: string; icon: typeof Bug; tone: string }> = {
  BUG: { labelKey: 'ISSUE.BUG', icon: Bug, tone: 'text-blocker' },
  VULNERABILITY: {
    labelKey: 'ISSUE.SECURITY',
    icon: ShieldAlert,
    tone: 'text-major',
  },
  CODE_SMELL: {
    labelKey: 'ISSUE.CODE_SMELL',
    icon: Waves,
    tone: 'text-primary',
  },
};

export function IssueTypeCell({ issue }: { issue: Issue }) {
  const { t } = useTranslation();
  const meta = TYPE_META[issue.type] ?? {
    labelKey: 'ISSUE.TITLE',
    icon: Bug,
    tone: 'text-muted',
  };
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Icon size={15} className={`shrink-0 ${meta.tone}`} />
      <span className="truncate text-sm font-medium text-fg" title={t(meta.labelKey)}>{t(meta.labelKey)}</span>
    </div>
  );
}
