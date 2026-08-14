import { useTranslation } from 'react-i18next';
import { StatusChip } from '@/components/ui/StatusChip';
import type { ScanStatus } from '@/features/scan/types';

export function ScanStatusChip({ status }: { status: ScanStatus }) {
  const { t } = useTranslation();

  if (status === 'PENDING') {
    return <StatusChip tone="info" dot pulse label={t('SCAN.RUN_RUNNING')} />;
  }

  if (status === 'FAILED') {
    return <StatusChip tone="danger" dot label={t('SCAN.RUN_FAILED')} />;
  }

  return <StatusChip tone="success" dot label={t('SCAN.RUN_SUCCESS')} />;
}
