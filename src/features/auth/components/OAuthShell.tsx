import type { ReactNode } from 'react';
import logoUrl from '@/assets/logo.png';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface OAuthShellProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function OAuthShell({ eyebrow, title, subtitle, children, footer }: OAuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-fg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 42% at 50% -8%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 70%), radial-gradient(42% 34% at 88% 108%, color-mix(in srgb, var(--primary) 9%, transparent), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--fg) 1px, transparent 1px), linear-gradient(90deg, var(--fg) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(70% 55% at 50% 30%, #000 20%, transparent 78%)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between gap-4 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="" width={30} height={30} className="h-[30px] w-[30px] object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Code Review</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-faint">PCCTH</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-14 pt-4">
        <div className="w-full max-w-[424px]">
          {title ? (
            <div className="mb-7 text-center">
              {eyebrow ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_22%,transparent)]" />
                  {eyebrow}
                </span>
              ) : null}
              <h1 className="mt-4 text-[34px] font-semibold leading-[1.12] tracking-[-0.028em]">{title}</h1>
              {subtitle ? (
                <p className="mx-auto mt-2.5 max-w-[34ch] text-sm leading-relaxed text-muted">{subtitle}</p>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(14,22,32,0.04),0_12px_32px_-12px_rgba(14,22,32,0.16)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_16px_40px_-16px_rgba(0,0,0,0.7)] sm:p-7">
            {children}
          </div>

          {footer ? (
            <p className="mt-4 text-center text-[13px] leading-relaxed text-faint">{footer}</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
