import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isQualityGatePassed } from '@/features/scan/lib/scan-rating';
import type { Scan } from '@/features/scan/types';

const SIZES = {
  sm: 'rounded-full px-2 py-0.5 text-[11px] font-medium',
  md: 'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium',
} as const;

export function ScanGradeChip({
  scan,
  size = 'sm',
  spinner = false,
  labels,
}: {
  scan: Scan;
  size?: keyof typeof SIZES;
  spinner?: boolean;
  labels?: { passed: string; failed: string };
}) {
  const { t } = useTranslation();
  const base = SIZES[size];

  if (scan.status === 'PENDING') {
    return (
      <span className={`${base}${spinner ? ' gap-1' : ''} bg-primary-subtle text-primary`}>
        {spinner ? <Loader2 size={11} className="animate-spin" /> : null}
        {t('SCAN.SCANNING')}
      </span>
    );
  }

  const passed = isQualityGatePassed(scan);
  return (
    <span
      className={`${base} ${passed ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'}`}
    >
      {passed
        ? (labels?.passed ?? t('SCAN.STATUS_PASS'))
        : (labels?.failed ?? t('SCAN.STATUS_FAILED'))}
    </span>
  );
}
