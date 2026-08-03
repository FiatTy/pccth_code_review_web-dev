import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FileBarChart,
  Folder,
  GitCompare,
  Loader2,
  RefreshCw,
  ScanLine,
  ScrollText,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DateField } from '@/components/common/DateField';
import { SelectField } from '@/components/common/SelectField';
import { SkeletonTable } from '@/components/common/Skeleton';
import { ScanCompareModal } from '@/features/scan/components/ScanCompareModal';
import { useScanHistory } from '@/features/scan/hooks/useScanHistory';
import { useRepositories } from '@/features/repository/hooks/useRepositories';
import { parseGitUrl } from '@/lib/git-utils';
import type { Scan } from '@/features/scan/types';

type StatusFilter = 'all' | 'SUCCESS' | 'FAILED' | 'PENDING';

function formatDateTime(value?: string): string {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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

function GradeChip({ scan }: { scan: Scan }) {
  const { t } = useTranslation();
  if (scan.status === 'PENDING') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-medium text-primary">
        <Loader2 size={11} className="animate-spin" />
        {t('SCAN.SCANNING')}
      </span>
    );
  }
  const passed =
    String(scan.qualityGate ?? '')
      .trim()
      .toUpperCase() === 'OK';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
        passed ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'
      }`}
    >
      {passed ? t('SCAN.STATUS_PASS') : t('SCAN.STATUS_FAILED')}
    </span>
  );
}

export function ScanHistoryPage() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, isFetching } = useScanHistory();
  const { data: repositories } = useRepositories();

  const [project, setProject] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  function toggleFolder(folderName: string) {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  }

  function handleStartDateChange(next: string) {
    setStartDate(next);
    if (endDate && next && next > endDate) {
      setEndDate(next);
    }
  }

  function handleEndDateChange(next: string) {
    setEndDate(next);
    if (startDate && next && next < startDate) {
      setStartDate(next);
    }
  }

  const repoFolderMap = useMemo(() => {
    const map = new Map<string, string>();
    (repositories ?? []).forEach((repo) => {
      const { folder } = parseGitUrl(repo.repositoryUrl);
      if (repo.projectId) map.set(repo.projectId, folder);
      if (repo.name) map.set(repo.name, folder);
    });
    return map;
  }, [repositories]);

  const getFolderForScan = (scan: Scan): string => {
    if (scan.repositoryUrl) {
      const { folder } = parseGitUrl(scan.repositoryUrl);
      if (folder && folder !== 'General') return folder;
    }
    if (scan.projectId && repoFolderMap.has(scan.projectId)) {
      return repoFolderMap.get(scan.projectId)!;
    }
    if (scan.projectName && repoFolderMap.has(scan.projectName)) {
      return repoFolderMap.get(scan.projectName)!;
    }
    if (scan.projectName && repoFolderMap.has(scan.projectName.toLowerCase())) {
      return repoFolderMap.get(scan.projectName.toLowerCase())!;
    }
    const parsed = parseGitUrl(scan.projectName);
    if (parsed.folder && parsed.folder !== 'General') {
      return parsed.folder;
    }
    return 'General';
  };

  const scans = useMemo(() => data ?? [], [data]);

  const projects = useMemo(
    () => Array.from(new Set(scans.map((scan) => scan.projectName).filter(Boolean))).sort(),
    [scans],
  );

  const availableFolders = useMemo(() => {
    const set = new Set<string>();
    scans.forEach((scan) => {
      const folder = getFolderForScan(scan);
      if (folder) set.add(folder);
    });
    return Array.from(set).sort();
  }, [scans, repoFolderMap]);

  const filtered = useMemo(
    () =>
      scans.filter((scan) => {
        if (project !== 'all' && scan.projectName !== project) return false;
        if (folderFilter !== 'all' && getFolderForScan(scan) !== folderFilter) return false;
        if (status !== 'all' && scan.status !== status) return false;
        if (!withinDate(scan.startedAt, startDate, endDate)) return false;
        return true;
      }),
    [scans, project, folderFilter, status, startDate, endDate, repoFolderMap],
  );

  const groupedByFolder = useMemo(() => {
    const groups = new Map<string, Scan[]>();
    filtered.forEach((scan) => {
      const folder = getFolderForScan(scan);
      const existing = groups.get(folder) ?? [];
      existing.push(scan);
      groups.set(folder, existing);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, repoFolderMap]);

  const selectedScans = useMemo(
    () => scans.filter((scan) => selectedIds.includes(scan.id)),
    [scans, selectedIds],
  );

  function resetFilters() {
    setProject('all');
    setFolderFilter('all');
    setStatus('all');
    setStartDate('');
    setEndDate('');
    setSelectedIds([]);
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
    'h-11 rounded-xl border border-border bg-surface px-3.5 text-sm text-fg shadow-sm outline-none transition hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15';

  return (
    <div>
      <PageHeader title={t('SCAN.TITLE')} subtitle={t('SCAN.SUBTITLE')} />

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        {availableFolders.length > 0 ? (
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
              {t('SCAN.FOLDER')}
            </span>
            <SelectField
              value={folderFilter}
              onChange={(next) => setFolderFilter(next)}
              className={`${selectClass} min-w-40`}
              options={[
                { value: 'all', label: `📁 ${t('SCAN.ALL_FOLDERS')}` },
                ...availableFolders.map((f) => ({ value: f, label: `📁 ${f}` })),
              ]}
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
            {t('SCAN.PROJECT')}
          </span>
          <SelectField
            value={project}
            onChange={(next) => setProject(next)}
            className={`${selectClass} min-w-44`}
            options={[
              { value: 'all', label: t('SCAN.ALL_PROJECTS') },
              ...projects.map((name) => ({ value: name, label: name })),
            ]}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
            {t('SCAN.SCAN_STATUS')}
          </span>
          <SelectField
            value={status}
            onChange={(next) => setStatus(next as StatusFilter)}
            className={`${selectClass} min-w-40`}
            options={[
              { value: 'all', label: t('SCAN.ALL') },
              { value: 'SUCCESS', label: t('SCAN.COMPLETED') },
              { value: 'FAILED', label: t('SCAN.FAILED') },
              { value: 'PENDING', label: t('SCAN.PENDING') },
            ]}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
            {t('SCAN.START_DATE')}
          </span>
          <DateField
            value={startDate}
            maxDate={endDate || undefined}
            onChange={handleStartDateChange}
            className={selectClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-faint">
            {t('SCAN.END_DATE')}
          </span>
          <DateField
            value={endDate}
            minDate={startDate || undefined}
            onChange={handleEndDateChange}
            className={selectClass}
          />
        </label>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-medium text-muted shadow-sm transition-all hover:border-border-strong hover:text-fg active:scale-[0.99]"
        >
          <RefreshCw size={14} />
          {t('SCAN.CLEAR_FILTER')}
        </button>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-faint">
            {selectedIds.length > 0
              ? t('SCAN.COMPARE_SELECTED', { count: selectedIds.length })
              : t('SCAN.COMPARE_HINT')}
          </span>
          <button
            type="button"
            onClick={() => setShowCompare(true)}
            disabled={selectedIds.length < 2}
            className="brand-gradient-bg inline-flex h-11 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
          >
            <GitCompare size={14} />
            {t('SCAN.COMPARE_SCANS')}
          </button>
        </div>
      </div>

      {isPending ? (
        <SkeletonTable rows={6} columns={6} />
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
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-muted">
              {t('REPOSITORY.GROUP_BY_FOLDER')} ({groupedByFolder.length} {t('REPOSITORY.FOLDER')})
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCollapsedFolders({})}
                className="text-xs font-medium text-muted hover:text-primary transition-colors"
              >
                {t('REPOSITORY.EXPAND_ALL')}
              </button>
              <span className="text-faint">•</span>
              <button
                type="button"
                onClick={() => {
                  const next: Record<string, boolean> = {};
                  availableFolders.forEach((f) => {
                    next[f] = true;
                  });
                  setCollapsedFolders(next);
                }}
                className="text-xs font-medium text-muted hover:text-primary transition-colors"
              >
                {t('REPOSITORY.COLLAPSE_ALL')}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm divide-y divide-border/60">
            {groupedByFolder.map(([folderName, folderScans]) => {
              const isCollapsed = Boolean(collapsedFolders[folderName]);
              const passedCount = folderScans.filter(
                (s) => String(s.qualityGate ?? '').trim().toUpperCase() === 'OK',
              ).length;
              const failedCount = folderScans.length - passedCount;

              return (
                <div key={folderName} className="transition-colors">
                  <div
                    onClick={() => toggleFolder(folderName)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleFolder(folderName);
                      }
                    }}
                    className={`flex cursor-pointer items-center justify-between select-none px-4 py-3.5 transition-colors ${
                      !isCollapsed ? 'bg-surface-2/40' : 'hover:bg-surface-2/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-muted shrink-0 transition-transform">
                        {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                      </span>
                      <Folder size={17} className="text-muted shrink-0" />
                      <span className="truncate text-sm font-semibold text-fg">{folderName}</span>
                      <span className="text-xs text-muted font-normal shrink-0">
                        {folderScans.length} {folderScans.length === 1 ? 'scan' : 'scans'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      {passedCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-success">
                          <span className="h-2 w-2 rounded-full bg-success" />
                          {passedCount} passed
                        </span>
                      )}
                      {failedCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-danger">
                          <span className="h-2 w-2 rounded-full bg-danger" />
                          {failedCount} failed
                        </span>
                      )}
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="border-t border-border/40 bg-surface-2/20">
                      <div className="overflow-x-auto max-h-[225px] overflow-y-auto">
                        <table className="w-full min-w-[720px] text-sm">
                          <thead className="sticky top-0 z-10 bg-surface-2/95 backdrop-blur-xs shadow-xs">
                            <tr className="border-b border-border/40 text-left">
                              <th className="px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                {t('SCAN.COL_DATE_TIME')}
                              </th>
                              <th className="px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                {t('SCAN.COL_PROJECT')}
                              </th>
                              <th className="px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                {t('SCAN.COL_GRADE')}
                              </th>
                              <th className="px-4 py-2.5 text-right font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                {t('SCAN.COL_ISSUES')}
                              </th>
                              <th className="px-4 py-2.5 text-center font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                {t('SCAN.COL_LOG')}
                              </th>
                              <th className="px-4 py-2.5 text-center font-mono text-xs font-semibold uppercase tracking-wide text-muted">
                                {t('SCAN.COL_RESULT')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/30">
                            {folderScans.map((scan) => {
                              const isSelected = selectedIds.includes(scan.id);
                              const isDisabledSelect = !isSelected && selectedIds.length >= 3;

                              return (
                                <tr
                                  key={scan.id}
                                  onClick={() => {
                                    if (!isDisabledSelect) {
                                      toggleSelected(scan.id);
                                    }
                                  }}
                                  className={`cursor-pointer select-none transition-colors ${
                                    isSelected
                                      ? 'bg-primary/12 border-l-4 border-l-primary font-medium hover:bg-primary/18'
                                      : isDisabledSelect
                                        ? 'opacity-60 cursor-not-allowed'
                                        : 'hover:bg-surface-2/60'
                                  }`}
                                >
                                  <td className="whitespace-nowrap px-4 py-2.5 text-muted">
                                    {formatDateTime(scan.startedAt)}
                                  </td>
                                  <td className="px-4 py-2.5 font-semibold text-fg">
                                    {scan.projectName || '—'}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <GradeChip scan={scan} />
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-medium text-fg">
                                    {issuesCount(scan)}
                                  </td>
                                  <td className="px-4 py-2.5 text-center">
                                    <Link
                                      to={`/logviewer/${scan.id}`}
                                      onClick={(e) => e.stopPropagation()}
                                      title={t('SCAN.VIEW_LOG_TOOLTIP')}
                                      aria-label={t('SCAN.VIEW_LOG_TOOLTIP')}
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                                    >
                                      <ScrollText size={14} />
                                    </Link>
                                  </td>
                                  <td className="px-4 py-2.5 text-center">
                                    <Link
                                      to={`/scanresult/${scan.id}`}
                                      onClick={(e) => e.stopPropagation()}
                                      title={t('SCAN.VIEW_RESULT_TOOLTIP')}
                                      aria-label={t('SCAN.VIEW_RESULT_TOOLTIP')}
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-subtle"
                                    >
                                      <FileBarChart size={14} />
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCompare && selectedScans.length >= 2 ? (
        <ScanCompareModal scans={selectedScans} onClose={() => setShowCompare(false)} />
      ) : null}
    </div>
  );
}
