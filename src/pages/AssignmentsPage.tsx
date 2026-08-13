import { useAssignmentsTour } from '@/features/onboarding/hooks/useAssignmentsTour';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ClipboardList, Loader2, TriangleAlert } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuth } from '@/lib/auth/auth-context';
import { useIssues } from '@/features/issue/hooks/useIssues';
import { useAssignableUsers } from '@/features/user/hooks/useUsers';
import { AssignIssueModal } from '@/features/issue/components/AssignIssueModal';
import type { Issue } from '@/types/issue';

const SEVERITY_DOT: Record<string, string> = {
  BLOCKER: 'bg-blocker',
  CRITICAL: 'bg-critical',
  MAJOR: 'bg-major',
  MINOR: 'bg-minor',
  INFO: 'bg-info',
};

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-warning/12 text-warning',
  IN_PROGRESS: 'bg-primary-subtle text-primary',
  CLOSED: 'bg-surface-2 text-muted',
  DONE: 'bg-success/12 text-success',
  RESOLVED: 'bg-success/12 text-success',
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: 'ISSUE.OPEN',
  IN_PROGRESS: 'ISSUE.IN_PROGRESS',
  CLOSED: 'ISSUE.CLOSED',
  RESOLVED: 'ISSUE.RESOLVED',
  DONE: 'ISSUE.RESOLVED',
};

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
}

export function AssignmentsPage() {
  useAssignmentsTour();
  const { t } = useTranslation();
  const { user } = useAuth();
  const issuesQuery = useIssues();
  const assignableUsers = useAssignableUsers();
  const [statusTarget, setStatusTarget] = useState<Issue | null>(null);

  const assignments = useMemo(
    () =>
      (issuesQuery.data ?? []).filter((issue) => issue.assignedId && issue.assignedId === user?.id),
    [issuesQuery.data, user?.id],
  );

  const headCell =
    'px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted';

  return (
    <div id="tour-assignment-header">
      <PageHeader
        title={t('MY_ASSIGNMENTS.TITLE')}
        subtitle={t('MY_ASSIGNMENTS.SUBTITLE')}
        actions={
          <span className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-surface px-3 font-mono text-[11px] text-muted">
            <ClipboardList size={13} />
            {assignments.length}
          </span>
        }
      />

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        {issuesQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-muted">
            <Loader2 size={16} className="animate-spin" />
            {t('COMMON.LOADING')}
          </div>
        ) : issuesQuery.isError ? (
          <div className="flex items-start gap-2.5 px-5 py-10 text-sm text-danger">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            <p>{t('COMMON.ERROR')}</p>
          </div>
        ) : assignments.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-muted">
            {t('MY_ASSIGNMENTS.NO_ASSIGNMENTS')}
          </p>
        ) : (
          <>
            {/* Mobile Card List View (< md) */}
            <div className="space-y-3 p-3.5 md:hidden">
              {assignments.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-xl border border-border bg-surface p-4 shadow-2xs space-y-3 transition-colors hover:border-border-strong"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-fg leading-snug">{issue.message || '—'}</p>
                      <p className="truncate font-mono text-xs text-muted" title={issue.component}>
                        {issue.component || '—'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStatusTarget(issue)}
                      title={t('ISSUE_MODAL.CHANGE_STATUS')}
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 ${
                        STATUS_BADGE[issue.status] ?? 'bg-surface-2 text-muted'
                      }`}
                    >
                      {t(STATUS_LABEL[issue.status] ?? 'ISSUE.OPEN')}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-border/50 py-2.5">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-faint block mb-0.5">
                        {t('MY_ASSIGNMENTS.COL_SEVERITY')}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-muted font-medium">
                        <span
                          className={`h-2 w-2 rounded-full ${SEVERITY_DOT[issue.severity] ?? 'bg-faint'}`}
                        />
                        {issue.severity}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase text-faint block mb-0.5">
                        {t('ISSUE.COL_PROJECT')}
                      </span>
                      <span className="truncate text-muted font-medium block">
                        {issue.projectName || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-xs text-faint">
                      {formatDate(issue.createdAt)}
                    </span>
                    <Link
                      to={`/issuedetail/${issue.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary-subtle px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      <span>{t('ISSUE.COL_VIEW')}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <caption className="sr-only">{t('MY_ASSIGNMENTS.TABLE_CAPTION')}</caption>
                <thead>
                  <tr className="border-b border-border">
                    <th className={headCell}>{t('MY_ASSIGNMENTS.COL_ISSUE')}</th>
                    <th className={headCell}>{t('MY_ASSIGNMENTS.COL_SEVERITY')}</th>
                    <th className={headCell}>{t('ISSUE.COL_PROJECT')}</th>
                    <th className={headCell}>{t('MY_ASSIGNMENTS.COL_CREATE_DATE')}</th>
                    <th className={headCell}>{t('MY_ASSIGNMENTS.COL_STATUS')}</th>
                    <th className={`${headCell} text-center`}>{t('ISSUE.COL_VIEW')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignments.map((issue) => (
                    <tr key={issue.id} className="transition-colors hover:bg-surface-2/50">
                      <td className="max-w-md px-5 py-3">
                        <p className="truncate text-fg" title={issue.message}>
                          {issue.message || '—'}
                        </p>
                        <p className="truncate font-mono text-[11px] text-faint">{issue.component}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                          <span
                            className={`h-2 w-2 rounded-full ${SEVERITY_DOT[issue.severity] ?? 'bg-faint'}`}
                          />
                          {issue.severity}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-muted">
                        {issue.projectName || '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-muted">
                        {formatDate(issue.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => setStatusTarget(issue)}
                          title={t('ISSUE_MODAL.CHANGE_STATUS')}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-opacity hover:opacity-80 ${
                            STATUS_BADGE[issue.status] ?? 'bg-surface-2 text-muted'
                          }`}
                        >
                          {t(STATUS_LABEL[issue.status] ?? 'ISSUE.OPEN')}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Link
                          to={`/issuedetail/${issue.id}`}
                          aria-label={t('ISSUE.COL_VIEW')}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-subtle"
                        >
                          <ArrowRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {statusTarget ? (
        <AssignIssueModal
          issue={statusTarget}
          mode="status"
          onClose={() => setStatusTarget(null)}
          users={assignableUsers.data ?? []}
          usersPending={assignableUsers.isPending}
          usersError={assignableUsers.isError}
        />
      ) : null}
    </div>
  );
}
