import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-stretch gap-3.5">
        {/* Premium accent bar — teal→gold brand gradient anchoring the title */}
        <span
          aria-hidden
          className="w-1 shrink-0 rounded-full bg-gradient-to-b from-primary to-accent"
        />
        <div className="min-w-0 self-center">
          <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-fg">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
