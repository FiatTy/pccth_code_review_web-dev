export function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-2.5 last:border-0 min-w-0 w-full">
      <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
        {label}
      </span>
      <span
        className={`min-w-0 truncate text-right text-sm text-fg ${mono ? 'font-mono text-xs' : ''}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
