import { useScanHistoryTour } from '@/features/onboarding/hooks/useScanHistoryTour';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  GitCompare,
  RefreshCw,
  ScanLine,
  ScrollText,
} from 'lucide-react';
import { ScanStatusChip } from '@/features/scan/components/ScanStatusChip';
import { QualityGateChip } from '@/features/scan/components/QualityGateChip';
import { formatDateTime } from '@/lib/format-date';
import { PageHeader } from '@/components/common/PageHeader';
import { DateField } from '@/components/common/DateField';
import { SelectField } from '@/components/common/SelectField';
import { SkeletonTable } from '@/components/common/Skeleton';
import { ScanCompareModal } from '@/features/scan/components/ScanCompareModal';
import { useScanHistory } from '@/features/scan/hooks/useScanHistory';
import type { Scan } from '@/features/scan/types';

const PAGE_SIZE = 8;
type StatusFilter = 'all' | 'SUCCESS' | 'FAILED' | 'PENDING';

function issuesCount(scan: Scan): number {
  const metrics = scan.metrics;
  if (!metrics) {
    return 0;
  }
  return (metrics.bugs ?? 0) + (metrics.vulnerabilities ?? 0) + (metrics.codeSmells ?? 0);
}

function withinDate(value: string, start: string, end: string): boolean {
  if (!start && !end) {
    return true;
  }
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) {
    return false;
  }
  if (start) {
    const startTime = new Date(`${start}T00:00:00`).getTime();
    if (time < startTime) {
      return false;
    }
  }
  if (end) {
    const endTime = new Date(`${end}T23:59:59.999`).getTime();
    if (time > endTime) {
      return false;
    }
  }
  return true;
}

export function ScanHistoryPage() {
  useScanHistoryTour();
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, isFetching } = useScanHistory();

  const [searchParams] = useSearchParams();
  const [project, setProject] = useState(() => searchParams.get('project') ?? searchParams.get('search') ?? searchParams.get('q') ?? 'all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const [lastSearchParams, setLastSearchParams] = useState(searchParams);
  if (searchParams !== lastSearchParams) {
    setLastSearchParams(searchParams);
    const param = searchParams.get('project') ?? searchParams.get('search') ?? searchParams.get('q');
    if (param !== null) {
      setProject(param);
    }
  }
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  function handleStartDateChange(next: string) {
    setStartDate(next);
    if (endDate && next && next > endDate) {
      setEndDate(next);
    }
    setPage(1);
  }

  function handleEndDateChange(next: string) {
    setEndDate(next);
    if (startDate && next && next < startDate) {
      setStartDate(next);
    }
    setPage(1);
  }

  const scans = useMemo(() => data ?? [], [data]);

  const projects = useMemo(
    () => Array.from(new Set(scans.map((scan) => scan.projectName).filter(Boolean))).sort(),
    [scans],
  );

  const filtered = useMemo(
    () =>
      scans.filter((scan) => {
        if (project !== 'all' && scan.projectName !== project) return false;
        if (status !== 'all' && scan.status !== status) return false;
        if (!withinDate(scan.startedAt, startDate, endDate)) return false;
        return true;
      }),
    [scans, project, status, startDate, endDate],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const selectedScans = useMemo(
    () => scans.filter((scan) => selectedIds.includes(scan.id)),
    [scans, selectedIds],
  );

  function resetFilters() {
    setProject('all');
    setStatus('all');
    setStartDate('');
    setEndDate('');
    setSelectedIds([]);
    setPage(1);
  }

  function toggleSelected(scanId: string) {
    setSelectedIds((current) =>
      current.includes(scanId)
        ? current.filter((id) => id !== scanId)
        : current.length >= 3
          ? current
          : [...current, scanId],
    );
  }

  const selectClass =
    'h-10 rounded-xl border border-border bg-surface px-3.5 text-sm text-fg shadow-sm outline-none transition hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15';

  return (
    <div id="tour-scan-header">
      <PageHeader title={t('SCAN.TITLE')} subtitle={t('SCAN.SUBTITLE')} />

      <div id="tour-scan-filters" className="mb-6 flex w-full flex-col gap-2.5 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:gap-3">
        {/* Row 1: Filter Controls Grid */}
        <div className="grid w-full grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          <label className="flex w-full flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
              {t('SCAN.PROJECT')}
            </span>
            <SelectField
              value={project}
              onChange={(next) => {
                setProject(next);
                setPage(1);
              }}
              searchable
              className={`${selectClass} w-full`}
              options={[
                { value: 'all', label: t('SCAN.ALL_PROJECTS') },
                ...projects.map((name) => ({ value: name, label: name })),
              ]}
            />
          </label>

          <label className="flex w-full flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
              {t('SCAN.SCAN_STATUS')}
            </span>
            <SelectField
              value={status}
              onChange={(next) => {
                setStatus(next as StatusFilter);
                setPage(1);
              }}
              className={`${selectClass} w-full`}
              options={[
                { value: 'all', label: t('SCAN.ALL') },
                { value: 'SUCCESS', label: t('SCAN.COMPLETED') },
                { value: 'FAILED', label: t('SCAN.FAILED') },
                { value: 'PENDING', label: t('SCAN.PENDING') },
              ]}
            />
          </label>

          <label className="flex w-full flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
              {t('SCAN.START_DATE')}
            </span>
            <DateField
              value={startDate}
              maxDate={endDate || undefined}
              onChange={handleStartDateChange}
              className={`${selectClass} w-full`}
            />
          </label>

          <label className="flex w-full flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
              {t('SCAN.END_DATE')}
            </span>
            <DateField
              value={endDate}
              minDate={startDate || undefined}
              onChange={handleEndDateChange}
              className={`${selectClass} w-full`}
              align="right"
            />
          </label>
        </div>

        {/* Row 2: Actions Bar */}
        <div className="flex w-full flex-col items-center gap-2.5 pt-2 md:flex-row md:justify-between">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-muted shadow-sm transition-all hover:border-border-strong hover:text-fg active:scale-[0.99] md:w-auto"
          >
            <RefreshCw size={14} />
            {t('SCAN.CLEAR_FILTER')}
          </button>

          <div className="flex w-full flex-col items-center gap-2.5 md:w-auto md:flex-row md:gap-3">
            <span className="text-xs text-muted text-center md:text-left">
              {selectedIds.length > 0
                ? t('SCAN.COMPARE_SELECTED', { count: selectedIds.length })
                : t('SCAN.COMPARE_HINT')}
            </span>
            <button
              id="tour-scan-compare-btn"
              type="button"
              onClick={() => setShowCompare(true)}
              disabled={selectedIds.length < 2}
              className="brand-gradient-bg inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 whitespace-nowrap md:w-auto"
            >
              <GitCompare size={14} className="shrink-0" />
              <span className="whitespace-nowrap">{t('SCAN.COMPARE_SCANS')}</span>
            </button>
          </div>
        </div>
      </div>

      {isPending ? (
        <SkeletonTable rows={6} columns={8} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-20 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger ring-1 ring-inset ring-danger/20">
            <AlertTriangle size={28} />
          </div>
          <p className="mt-5 text-sm text-muted">{t('COMMON.ERROR')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-fg shadow-sm transition-all hover:border-border-strong active:scale-[0.99]"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : undefined} />
            {t('COMMON.RESET')}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-20 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <ScanLine size={28} />
          </div>
          <h3 className="mt-5 text-base font-semibold text-fg">{t('SCAN.NO_SCANS_FOUND')}</h3>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
            {t('SCAN.NO_SCANS_FOUND_DESC')}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {/* Mobile Card List View (< md) */}
          <div className="space-y-3 p-3.5 md:hidden">
            {pageRows.map((scan, index) => (
              <div
                key={scan.id}
                className="rounded-xl border border-border bg-surface p-4 shadow-2xs space-y-3 transition-colors hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      id={index === 0 ? 'tour-scan-checkbox-mobile' : undefined}
                      type="checkbox"
                      aria-label={`${t('SCAN.COL_SELECT')} ${scan.projectName}`}
                      checked={selectedIds.includes(scan.id)}
                      disabled={!selectedIds.includes(scan.id) && selectedIds.length >= 3}
                      onChange={() => toggleSelected(scan.id)}
                      className="h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                    />
                    <span className="truncate text-sm font-semibold text-fg">
                      {scan.projectName || '—'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs border-t border-b border-border/50 py-2.5">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-faint block mb-0.5">
                      {t('SCAN.COL_SCAN_STATUS')}
                    </span>
                    <ScanStatusChip status={scan.status} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-faint block mb-0.5">
                      {t('SCAN.COL_QUALITY_GATE')}
                    </span>
                    <QualityGateChip scan={scan} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-faint block mb-0.5">
                      {t('SCAN.COL_DATE_TIME')}
                    </span>
                    <span className="text-muted font-medium">
                      {formatDateTime(scan.startedAt) ?? '—'}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-faint block mb-0.5">
                      {t('SCAN.COL_ISSUES')}
                    </span>
                    <span className="text-fg font-semibold">
                      {issuesCount(scan)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-0.5">
                  <Link
                    to={`/logviewer/${scan.id}`}
                    title={t('SCAN.VIEW_LOG_TOOLTIP')}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface-2/40 px-3 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    <ScrollText size={14} />
                    {t('SCAN.COL_LOG')}
                  </Link>
                  <Link
                    id={index === 0 ? 'tour-scan-result-btn-mobile' : undefined}
                    to={`/scanresult/${scan.id}`}
                    title={t('SCAN.VIEW_RESULT_TOOLTIP')}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary-subtle px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    <FileBarChart size={14} />
                    {t('SCAN.COL_RESULT')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/50 text-left">
                  <th className="w-10 px-4 py-3">
                    <span className="sr-only">{t('SCAN.COL_SELECT')}</span>
                  </th>
                  <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('SCAN.COL_DATE_TIME')}
                  </th>
                  <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('SCAN.COL_PROJECT')}
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('SCAN.COL_SCAN_STATUS')}
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('SCAN.COL_QUALITY_GATE')}
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('SCAN.COL_ISSUES')}
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('SCAN.COL_LOG')}
                  </th>
                  <th className="px-4 py-3 text-center font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                    {t('SCAN.COL_RESULT')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((scan, index) => (
                  <tr
                    key={scan.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-surface-2/40"
                  >
                    <td className="px-4 py-3">
                      <input
                        id={index === 0 ? 'tour-scan-checkbox' : undefined}
                        type="checkbox"
                        aria-label={`${t('SCAN.COL_SELECT')} ${scan.projectName}`}
                        checked={selectedIds.includes(scan.id)}
                        disabled={!selectedIds.includes(scan.id) && selectedIds.length >= 3}
                        onChange={() => toggleSelected(scan.id)}
                        className="h-4 w-4 cursor-pointer accent-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {formatDateTime(scan.startedAt) ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-fg">{scan.projectName || '—'}</td>
                    <td className="px-4 py-3">
                      <ScanStatusChip status={scan.status} />
                    </td>
                    <td className="px-4 py-3">
                      <QualityGateChip scan={scan} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-fg">
                      {issuesCount(scan)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/logviewer/${scan.id}`}
                        title={t('SCAN.VIEW_LOG_TOOLTIP')}
                        aria-label={t('SCAN.VIEW_LOG_TOOLTIP')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                      >
                        <ScrollText size={15} />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        id={index === 0 ? 'tour-scan-result-btn' : undefined}
                        to={`/scanresult/${scan.id}`}
                        title={t('SCAN.VIEW_RESULT_TOOLTIP')}
                        aria-label={t('SCAN.VIEW_RESULT_TOOLTIP')}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-subtle"
                      >
                        <FileBarChart size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted">
              {t('SCAN.PAGE_INFO', { current: currentPage, total: totalPages })}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage >= totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompare && selectedScans.length >= 2 ? (
        <ScanCompareModal scans={selectedScans} onClose={() => setShowCompare(false)} />
      ) : null}
    </div>
  );
}
