import { useMemo } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Bug,
  CheckCircle2,
  ExternalLink,
  FolderGit2,
  Gauge,
  Loader2,
  Play,
  RotateCw,
  ScanLine,
  Settings2,
  ShieldAlert,
  Trash2,
  XCircle,
} from 'lucide-react';
import { formatDateTime } from '@/lib/format-date';
import { parseGitUrl } from '@/lib/git-utils';
import type { RepoStatus, Repository } from '@/features/repository/types';

const STATUS_BADGE: Record<RepoStatus, string> = {
  Active: 'bg-success/12 text-success',
  Scanning: 'bg-primary-subtle text-primary',
  Error: 'bg-danger/12 text-danger',
};

function formatMetric(value?: number): string {
  return value == null ? '—' : String(value);
}

function Metric({
  icon: Icon,
  value,
  tone,
}: {
  icon: typeof Bug;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} className={tone} />
      <span className="text-sm font-medium text-fg">{value}</span>
    </div>
  );
}

export function RepositoryCard({
  repo,
  onDelete,
  onScan,
  isScanPending,
}: {
  repo: Repository;
  onDelete: (repo: Repository) => void;
  onScan: (repo: Repository) => void;
  isScanPending: boolean;
}) {
  const { t } = useTranslation();
  const lastScan = formatDateTime(repo.lastScan);
  const coverage = repo.metrics?.coverage;
  const qualityPassed = repo.qualityGate === 'Passed';
  const isScanning = repo.status === 'Scanning';
  const parsedGit = useMemo(() => parseGitUrl(repo.repositoryUrl), [repo.repositoryUrl]);

  return (
    <div
      className={`hover-lift group flex flex-col rounded-2xl border bg-surface p-5 shadow-sm ${
        isScanning ? 'scan-card border-primary/40' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-fg">{repo.name}</h3>
          <a
            href={repo.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-muted hover:text-primary"
          >
            <span className="truncate">{repo.repositoryUrl}</span>
            <ExternalLink size={11} className="shrink-0" />
          </a>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_BADGE[repo.status]}`}
        >
          {isScanning ? <Loader2 size={11} className="animate-spin" /> : null}
          {isScanning
            ? t('REPOSITORY.ANALYZING')
            : t(`REPOSITORY.STATUS_${repo.status.toUpperCase()}`)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-primary-subtle/80 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
          <FolderGit2 size={11} />
          {parsedGit.folder}
        </span>
        {repo.projectTypeLabel ? (
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
            {repo.projectTypeLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 text-xs text-faint">
        {lastScan ? `${t('REPOSITORY.LAST_SCAN')}: ${lastScan}` : t('REPOSITORY.NEVER_SCANNED')}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
        <Metric icon={Bug} value={formatMetric(repo.metrics?.bugs)} tone="text-blocker" />
        <Metric
          icon={ShieldAlert}
          value={formatMetric(repo.metrics?.vulnerabilities)}
          tone="text-major"
        />
        <Metric icon={Gauge} value={coverage != null ? `${coverage}%` : '—'} tone="text-primary" />
        <div className="ml-auto flex items-center gap-1.5">
          {repo.qualityGate ? (
            qualityPassed ? (
              <CheckCircle2 size={14} className="text-success" />
            ) : (
              <XCircle size={14} className="text-danger" />
            )
          ) : null}
          <span
            className={`text-xs font-medium ${
              repo.qualityGate ? (qualityPassed ? 'text-success' : 'text-danger') : 'text-faint'
            }`}
          >
            {repo.qualityGate ? t(`REPOSITORY.${qualityPassed ? 'PASSED' : 'FAILED'}`) : '—'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1">
        {repo.status === 'Active' ? (
          <button
            type="button"
            onClick={() => onScan(repo)}
            disabled={isScanPending}
            title={t('REPOSITORY.TOOLTIP_RUN')}
            aria-label={t('REPOSITORY.TOOLTIP_RUN')}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary-subtle px-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-fg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isScanPending ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {t('REPOSITORY.START_SCAN')}
          </button>
        ) : null}
        {repo.status === 'Error' ? (
          <button
            type="button"
            onClick={() => onScan(repo)}
            disabled={isScanPending}
            title={t('REPOSITORY.TOOLTIP_RETRY')}
            aria-label={t('REPOSITORY.TOOLTIP_RETRY')}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-warning/12 px-2.5 text-xs font-medium text-warning transition-colors hover:bg-warning/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isScanPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RotateCw size={14} />
            )}
            {t('REPOSITORY.TOOLTIP_RETRY')}
          </button>
        ) : null}

        {isScanning ? (
          <span className="mr-auto inline-flex items-center gap-2 text-xs text-primary">
            <ScanLine size={14} className="shrink-0" />
            {t('REPOSITORY.SCAN_IN_PROGRESS')}
          </span>
        ) : (
          <>
            <Link
              to={`/detailrepo/${repo.projectId}`}
              title={t('REPOSITORY.TOOLTIP_VIEW')}
              aria-label={t('REPOSITORY.TOOLTIP_VIEW')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <ExternalLink size={15} />
            </Link>
            <Link
              to={`/settingrepo/${repo.projectId}`}
              title={t('REPOSITORY.TOOLTIP_SETTINGS')}
              aria-label={t('REPOSITORY.TOOLTIP_SETTINGS')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <Settings2 size={15} />
            </Link>
            <button
              type="button"
              onClick={() => onDelete(repo)}
              title={t('REPOSITORY.TOOLTIP_DELETE')}
              aria-label={t('REPOSITORY.TOOLTIP_DELETE')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
