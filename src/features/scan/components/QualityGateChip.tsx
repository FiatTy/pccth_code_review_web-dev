import { useTranslation } from 'react-i18next';
import { StatusChip } from '@/components/ui/StatusChip';
import { isQualityGatePassed } from '@/features/scan/lib/scan-rating';
import type { Scan } from '@/features/scan/types';

export function QualityGateChip({
  scan,
  labels,
}: {
  scan: Pick<Scan, 'status' | 'qualityGate'>;
  labels?: { passed: string; failed: string };
}) {
  const { t } = useTranslation();

  if (scan.status === 'PENDING') {
    return <StatusChip tone="neutral" label={t('SCAN.GATE_WAITING')} />;
  }

  if (!String(scan.qualityGate ?? '').trim()) {
    return <StatusChip tone="neutral" label={t('SCAN.GATE_NONE')} />;
  }

  return isQualityGatePassed(scan) ? (
    <StatusChip tone="success" label={labels?.passed ?? t('SCAN.GATE_PASSED')} />
  ) : (
    <StatusChip tone="danger" label={labels?.failed ?? t('SCAN.GATE_FAILED')} />
  );
}
