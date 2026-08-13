export type StatusTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

const TONE_CLASS: Record<StatusTone, string> = {
  success: 'bg-success/12 text-success',
  danger: 'bg-danger/12 text-danger',
  warning: 'bg-warning/12 text-warning',
  info: 'bg-primary-subtle text-primary',
  neutral: 'bg-surface-2 text-muted',
};

const DOT_CLASS: Record<StatusTone, string> = {
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-primary',
  neutral: 'bg-faint',
};

export function StatusChip({
  tone,
  label,
  dot = false,
  pulse = false,
  className = '',
}: {
  tone: StatusTone;
  label: string;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      title={label}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${TONE_CLASS[tone]} ${className}`}
    >
      {dot ? (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASS[tone]} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      ) : null}
      <span className="min-w-0 truncate">{label}</span>
    </span>
  );
}
