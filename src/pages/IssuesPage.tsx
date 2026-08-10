import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowRight,
  Bug,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SelectField } from '@/components/common/SelectField';
import { SkeletonTable } from '@/components/common/Skeleton';
import { useIssues } from '@/features/issue/hooks/useIssues';
import { useAssignableUsers } from '@/features/user/hooks/useUsers';
import { AssignIssueModal } from '@/features/issue/components/AssignIssueModal';
import { BulkAssignModal } from '@/features/issue/components/BulkAssignModal';
import { IssueTypeCell } from '@/features/issue/components/IssueTypeCell';
import { IssueSeverityCell } from '@/features/issue/components/IssueSeverityCell';
import type { Issue } from '@/types/issue';

const PAGE_SIZE = 10;



function statusMeta(status: string): { labelKey: string; cls: string } {
  switch (status) {
    case 'IN_PROGRESS':
    case 'PENDING':
      return {
        labelKey: 'ISSUE.IN_PROGRESS',
        cls: 'bg-warning/12 text-warning',
      };
    case 'DONE':
    case 'RESOLVED':
      return { labelKey: 'ISSUE.RESOLVED', cls: 'bg-success/12 text-success' };
    case 'REJECT':
    case 'CLOSED':
      return { labelKey: 'ISSUE.CLOSED', cls: 'bg-danger/12 text-danger' };
    default:
      return { labelKey: 'ISSUE.OPEN', cls: 'bg-surface-2 text-muted' };
  }
}



export function IssuesPage() {
  const { t } = useTranslation();
  const { data, isPending, isError, refetch, isFetching } = useIssues();
  const assignableUsers = useAssignableUsers();

  const [searchParams] = useSearchParams();
  const [type, setType] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [project, setProject] = useState(() => searchParams.get('project') ?? 'all');
  const [search, setSearch] = useState(() => searchParams.get('search') ?? searchParams.get('q') ?? '');

  const [lastSearchParams, setLastSearchParams] = useState(searchParams);
  if (searchParams !== lastSearchParams) {
    setLastSearchParams(searchParams);
    const searchVal = searchParams.get('search') ?? searchParams.get('q');
    if (searchVal !== null) {
      setSearch(searchVal);
    }
    const projVal = searchParams.get('project');
    if (projVal !== null) {
      setProject(projVal);
    }
  }
  const [page, setPage] = useState(1);
  const [assignTarget, setAssignTarget] = useState<Issue | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkAssign, setShowBulkAssign] = useState(false);

  const issues = useMemo(() => data ?? [], [data]);
  const projects = useMemo(
    () => Array.from(new Set(issues.map((issue) => issue.projectName).filter(Boolean))).sort(),
    [issues],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return issues.filter((issue) => {
      if (type !== 'all' && issue.type !== type) return false;
      if (severity !== 'all' && issue.severity !== severity) return false;
      if (status !== 'all' && statusMeta(issue.status).labelKey !== statusMeta(status).labelKey)
        return false;
      if (project !== 'all' && issue.projectName !== project) return false;
      if (query && !`${issue.component} ${issue.message}`.toLowerCase().includes(query))
        return false;
      return true;
    });
  }, [issues, type, severity, status, project, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const selectedIssues = useMemo(
    () => issues.filter((issue) => selectedIds.includes(issue.id)),
    [issues, selectedIds],
  );
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((issue) => selectedIds.includes(issue.id));

  function resetFilters() {
    setType('all');
    setSeverity('all');
    setStatus('all');
    setProject('all');
    setSearch('');
    setSelectedIds([]);
    setPage(1);
  }

  function toggleSelected(issueId: string) {
    setSelectedIds((current) =>
      current.includes(issueId) ? current.filter((id) => id !== issueId) : [...current, issueId],
    );
  }

  function toggleSelectPage() {
    const pageIds = pageRows.map((issue) => issue.id);
    setSelectedIds((current) =>
      allPageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...current, ...pageIds])),
    );
  }

  const selectClass =
    'h-10 rounded-lg border border-border bg-surface px-3 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25';

  const headCell =
    'px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-muted';

  return (
    <div>
      <PageHeader title={t('ISSUE.TITLE_MGT')} subtitle={t('ISSUE.TABLE_CAPTION')} />

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <SelectField
          value={type}
          onChange={(next) => {
            setType(next);
            setPage(1);
          }}
          className={`${selectClass} w-full sm:w-auto sm:min-w-40`}
          options={[
            { value: 'all', label: t('ISSUE.ALL_TYPES') },
            { value: 'BUG', label: t('ISSUE.BUG') },
            { value: 'VULNERABILITY', label: t('ISSUE.SECURITY') },
            { value: 'CODE_SMELL', label: t('ISSUE.CODE_SMELL') },
          ]}
        />
        <SelectField
          value={severity}
          onChange={(next) => {
            setSeverity(next);
            setPage(1);
          }}
          className={`${selectClass} w-full sm:w-auto sm:min-w-40`}
          options={[
            { value: 'all', label: t('ISSUE.ALL_SEVERITY') },
            { value: 'BLOCKER', label: t('ISSUE.BLOCKER') },
            { value: 'CRITICAL', label: t('ISSUE.CRITICAL') },
            { value: 'MAJOR', label: t('ISSUE.MAJOR') },
            { value: 'MINOR', label: t('ISSUE.MINOR') },
            { value: 'INFO', label: t('ISSUE.INFO') },
          ]}
        />
        <SelectField
          value={status}
          onChange={(next) => {
            setStatus(next);
            setPage(1);
          }}
          className={`${selectClass} w-full sm:w-auto sm:min-w-40`}
          options={[
            { value: 'all', label: t('ISSUE.ALL_STATUS') },
            { value: 'OPEN', label: t('ISSUE.OPEN') },
            { value: 'IN_PROGRESS', label: t('ISSUE.IN_PROGRESS') },
            { value: 'DONE', label: t('ISSUE.RESOLVED') },
            { value: 'REJECT', label: t('ISSUE.CLOSED') },
          ]}
        />
        <SelectField
          value={project}
          onChange={(next) => {
            setProject(next);
            setPage(1);
          }}
          searchable
          className={`${selectClass} w-full sm:w-auto sm:min-w-44`}
          options={[
            { value: 'all', label: t('ISSUE.ALL_PROJECTS') },
            ...projects.map((name) => ({ value: name, label: name })),
          ]}
        />

        <div className="relative w-full sm:ml-auto sm:w-56">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={t('ISSUE.SEARCH_PLACEHOLDER')}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <RefreshCw size={14} />
          {t('ISSUE.CLEAR')}
        </button>
      </div>

      {isPending ? (
        <SkeletonTable rows={8} columns={6} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16 text-center">
          <AlertTriangle size={28} className="text-danger" />
          <p className="mt-3 text-sm text-muted">{t('COMMON.ERROR')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : undefined} />
            {t('COMMON.RESET')}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 text-center">
          <Bug size={30} className="text-faint" />
          <h3 className="mt-4 text-sm font-semibold text-fg">{t('ISSUE.NO_ISSUES_FOUND')}</h3>
          <p className="mt-1 max-w-sm text-sm text-muted">{t('ISSUE.NO_ISSUES_FOUND_DESC')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {/* Mobile Card List View (< md) */}
          <div className="space-y-3 p-3.5 md:hidden">
            {pageRows.map((issue) => {
              const badge = statusMeta(issue.status);
              return (
                <div
                  key={issue.id}
                  className="rounded-xl border border-border bg-surface p-4 shadow-2xs space-y-3 transition-colors hover:border-border-strong"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        aria-label={`${t('ISSUE.SELECT_ALL')} ${issue.issueKey}`}
                        checked={selectedIds.includes(issue.id)}
                        onChange={() => toggleSelected(issue.id)}
                        className="h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-primary)]"
                      />
                      <div className="min-w-0 flex-1 truncate">
                        <IssueTypeCell issue={issue} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <IssueSeverityCell severity={issue.severity} />
                      <span
                        className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge.cls}`}
                      >
                        {t(badge.labelKey)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-fg leading-snug">{issue.message || '—'}</p>
                    <p className="truncate font-mono text-xs text-muted" title={issue.component}>
                      {issue.component || '—'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-2.5 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-[10px] uppercase text-faint shrink-0">
                        {t('ISSUE.COL_PROJECT')}:
                      </span>
                      <span className="truncate text-muted font-medium">{issue.projectName || '—'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAssignTarget(issue)}
                      title={t('ISSUE_MODAL.ASSIGN_ISSUE')}
                      className="shrink-0 rounded-md px-2 py-1 text-xs transition-colors hover:bg-surface-2"
                    >
                      {issue.assignedName ? (
                        <span className="font-medium text-fg">{issue.assignedName}</span>
                      ) : (
                        <span className="text-faint">{t('ISSUE.UNASSIGNED')}</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <Link
                      to={`/issuedetail/${issue.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary-subtle px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      <span>{t('ISSUE.COL_VIEW')}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/50 text-left">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={t('ISSUE.SELECT_ALL')}
                      checked={allPageSelected}
                      onChange={toggleSelectPage}
                      className="h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
                    />
                  </th>
                  <th className={headCell}>{t('ISSUE.COL_TYPE')}</th>
                  <th className={headCell}>{t('ISSUE.COL_SEVERITY')}</th>
                  <th className={headCell}>{t('ISSUE.COL_PROJECT')}</th>
                  <th className={headCell}>{t('ISSUE.COL_ISSUE')}</th>
                  <th className={headCell}>{t('ISSUE.COL_COMPONENT')}</th>
                  <th className={headCell}>{t('ISSUE.COL_ASSIGNED')}</th>
                  <th className={headCell}>{t('ISSUE.COL_STATUS')}</th>
                  <th className={`${headCell} text-center`}>{t('ISSUE.COL_VIEW')}</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((issue) => {
                  const badge = statusMeta(issue.status);
                  return (
                    <tr
                      key={issue.id}
                      className="border-b border-border last:border-0 transition-colors hover:bg-surface-2/40"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`${t('ISSUE.SELECT_ALL')} ${issue.issueKey}`}
                          checked={selectedIds.includes(issue.id)}
                          onChange={() => toggleSelected(issue.id)}
                          className="h-4 w-4 cursor-pointer accent-[var(--color-primary)]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <IssueTypeCell issue={issue} />
                      </td>
                      <td className="px-4 py-3">
                        <IssueSeverityCell severity={issue.severity} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">
                        {issue.projectName || '—'}
                      </td>
                      <td className="max-w-[280px] px-4 py-3">
                        <p className="truncate text-fg" title={issue.message}>
                          {issue.message || '—'}
                        </p>
                      </td>
                      <td className="max-w-[200px] px-4 py-3">
                        <p
                          className="truncate font-mono text-xs text-muted"
                          title={issue.component}
                        >
                          {issue.component || '—'}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setAssignTarget(issue)}
                          title={t('ISSUE_MODAL.ASSIGN_ISSUE')}
                          className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-surface-2"
                        >
                          {issue.assignedName ? (
                            <span className="text-fg">{issue.assignedName}</span>
                          ) : (
                            <span className="text-faint">{t('ISSUE.UNASSIGNED')}</span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.cls}`}
                        >
                          {t(badge.labelKey)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/issuedetail/${issue.id}`}
                          aria-label={t('ISSUE.COL_VIEW')}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-subtle"
                        >
                          <ArrowRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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

      {selectedIds.length > 0 ? (
        <div className="sticky bottom-4 z-30 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg shadow-black/10">
          <span className="text-sm text-fg">
            {t('ISSUE.SELECTED_ISSUES_LABEL', { count: selectedIds.length })}
          </span>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-xs font-medium text-muted transition-colors hover:text-fg"
          >
            {t('ISSUE.CLEAR_SELECTION')}
          </button>
          <button
            type="button"
            onClick={() => setShowBulkAssign(true)}
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.99]"
          >
            <UserPlus size={15} />
            {t('ISSUE.ASSIGN_SELECTED')}
          </button>
        </div>
      ) : null}

      {assignTarget ? (
        <AssignIssueModal
          issue={assignTarget}
          mode="assign"
          onClose={() => setAssignTarget(null)}
          users={assignableUsers.data ?? []}
          usersPending={assignableUsers.isPending}
          usersError={assignableUsers.isError}
        />
      ) : null}

      {showBulkAssign && selectedIssues.length > 0 ? (
        <BulkAssignModal
          issues={selectedIssues}
          onClose={() => setShowBulkAssign(false)}
          onDone={() => setSelectedIds([])}
          users={assignableUsers.data ?? []}
          usersPending={assignableUsers.isPending}
          usersError={assignableUsers.isError}
        />
      ) : null}
    </div>
  );
}
