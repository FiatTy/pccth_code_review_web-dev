import { AlertTriangle, CheckCircle2, Layers, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/ui/StatCard';

export interface RepositoryStats {
  total: number;
  active: number;
  scanning: number;
  error: number;
}

export function RepositoryStatsRow({ stats }: { stats: RepositoryStats }) {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        size="sm"
        icon={Layers}
        label={t('REPOSITORY.STATS_TOTAL')}
        value={stats.total}
        tone="bg-surface-2 text-fg"
      />
      <StatCard
        size="sm"
        icon={CheckCircle2}
        label={t('REPOSITORY.STATS_ACTIVE')}
        value={stats.active}
        tone="bg-success/12 text-success"
      />
      <StatCard
        size="sm"
        icon={Loader2}
        label={t('REPOSITORY.STATS_SCANNING')}
        value={stats.scanning}
        tone="bg-primary-subtle text-primary"
      />
      <StatCard
        size="sm"
        icon={AlertTriangle}
        label={t('REPOSITORY.STATS_ERROR')}
        value={stats.error}
        tone="bg-danger/12 text-danger"
      />
    </div>
  );
}
