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
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-2/50 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-semibold text-fg">
          <Icon size={14} className="text-muted" />
          {title}
        </span>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            aria-label={copyLabel}
            title={copyLabel}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-fg"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        ) : null}
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words bg-surface px-4 py-3 font-mono text-xs leading-relaxed text-fg">
        {content}
      </pre>
    </div>
  );
}
