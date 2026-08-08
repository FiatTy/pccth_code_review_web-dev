import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Issue } from '@/types/issue';

const PAGE_SIZE = 5;

export function IssueTable({
  title,
  issues,
  tone,
}: {
  title: string;
  issues: Issue[];
  tone: string;
}) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(issues.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = issues.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2 card-header border-b border-border px-5 py-4">
        <span className={`h-2 w-2 rounded-full ${tone}`} />
        <h2 className="text-sm font-semibold text-fg">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted">{t('COMMON.NO_DATA')}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    'LOG_VIEWER.COL_HASH',
                    'LOG_VIEWER.COL_MESSAGE',
                    'LOG_VIEWER.COL_COMPONENT',
                    'LOG_VIEWER.COL_LINE',
                  ].map((key) => (
                    <th
                      key={key}
                      className="px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted"
                    >
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((issue, index) => (
                  <tr key={issue.id} className="transition-colors hover:bg-surface-2/50">
                    <td className="px-5 py-3 font-mono text-xs text-faint">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="max-w-[16rem] px-5 py-3">
                      <span className="block truncate text-fg" title={issue.message}>
                        {issue.message}
                      </span>
                    </td>
                    <td className="max-w-[10rem] px-5 py-3">
                      <span
                        className="block truncate font-mono text-xs text-muted"
                        title={issue.component}
                      >
                        {issue.component}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">{issue.line ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="font-mono text-[11px] text-faint">
              {currentPage} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage <= 1}
                className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('LOG_VIEWER.PREV')}
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={currentPage >= totalPages}
                className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('LOG_VIEWER.NEXT')}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
