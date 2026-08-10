import { Check, Copy, type LucideIcon } from 'lucide-react';

export function CodeBlock({
  title,
  icon: Icon,
  content,
  onCopy,
  copied,
  copyLabel,
}: {
  title: string;
  icon: LucideIcon;
  content: string;
  onCopy?: () => void;
  copied?: boolean;
  copyLabel?: string;
}) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-2/50 px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-fg">
          <Icon size={14} className="shrink-0 text-muted" />
          <span className="truncate">{title}</span>
        </span>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            aria-label={copyLabel}
            title={copyLabel}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-fg"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        ) : null}
      </div>
      <div className="w-full max-w-full min-w-0 overflow-x-auto bg-surface overscroll-contain">
        <pre className="max-h-96 w-full max-w-full min-w-0 whitespace-pre px-4 py-3 font-mono text-xs leading-relaxed text-fg">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
}
