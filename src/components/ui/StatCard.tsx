import type { LucideIcon } from 'lucide-react';

export type StatCardSize = 'sm' | 'md' | 'lg';

const SIZES: Record<
  StatCardSize,
  { card: string; badge: string; icon: number; value: string }
> = {
  sm: {
    card: 'hover-lift rounded-xl p-4 shadow-sm',
    badge: 'h-7 w-7 rounded-md',
    icon: 15,
    value: 'mt-2 text-2xl',
  },
  md: {
    card: 'rounded-xl p-5',
    badge: 'h-8 w-8 rounded-lg',
    icon: 16,
    value: 'mt-3 text-2xl',
  },
  lg: {
    card: 'hover-lift rounded-2xl p-5 shadow-sm',
    badge: 'h-8 w-8 rounded-lg',
    icon: 16,
    value: 'mt-3 text-3xl',
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  size = 'md',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone: string;
  size?: StatCardSize;
}) {
  const variant = SIZES[size];
  return (
    <div className={`border border-border bg-surface ${variant.card}`}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">
          {label}
        </span>
        <span className={`flex items-center justify-center ${variant.badge} ${tone}`}>
          <Icon size={variant.icon} />
        </span>
      </div>
      <p className={`font-semibold tracking-tight text-fg ${variant.value}`}>{value}</p>
    </div>
  );
}
