import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function SectionCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  const heading = (
    <>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-faint">
        {eyebrow}
      </p>
      <h2 className={`text-sm font-semibold text-fg${Icon ? '' : ' mt-1'}`}>{title}</h2>
      {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
    </>
  );

  return (
    <section className="rounded-xl border border-border bg-surface">
      {Icon ? (
        <div className="flex items-center gap-2.5 card-header border-b border-border px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-muted">
            <Icon size={15} />
          </span>
          <div>{heading}</div>
        </div>
      ) : (
        <div className="card-header border-b border-border px-5 py-4">{heading}</div>
      )}
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}
