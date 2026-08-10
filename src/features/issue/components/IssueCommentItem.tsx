import { CornerDownRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/lib/format-date';
import type { IssueComment } from '@/features/issue/types';

export function IssueCommentItem({
  comment,
  replies,
  onReply,
}: {
  comment: IssueComment;
  replies: IssueComment[];
  onReply: (comment: IssueComment) => void;
}) {
  const { t } = useTranslation();
  const initial = comment.username?.charAt(0).toUpperCase() || '?';
  return (
    <li className="px-5 py-4">
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold text-primary">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-medium text-fg">{comment.username || '—'}</span>
            <span className="font-mono text-[11px] text-faint">
              {formatDateTime(comment.createdAt) ?? '—'}
            </span>
            <button
              type="button"
              onClick={() => onReply(comment)}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-primary transition-opacity hover:underline"
            >
              <CornerDownRight size={11} />
              {t('ISSUE_DETAIL.REPLY')}
            </button>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm text-muted">
            {comment.comment}
          </p>
        </div>
      </div>
      {replies.length > 0 ? (
        <ul className="mt-3 space-y-3 border-l border-border pl-4 sm:ml-11">
          {replies.map((reply) => (
            <li key={reply.id} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-semibold text-muted">
                {reply.username?.charAt(0).toUpperCase() || '?'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-medium text-fg">{reply.username || '—'}</span>
                  <span className="font-mono text-[11px] text-faint">
                    {formatDateTime(reply.createdAt) ?? '—'}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm text-muted">
                  {reply.comment}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
