import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import logoUrl from '@/assets/logo.png';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { ScanLogPanel } from '@/features/auth/components/ScanLogPanel';

interface AuthShellProps {
  asideEyebrow: string;
  asideTitleHtml: string;
  asideText: string;
  formTitle: ReactNode;
  formSubtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({
  asideEyebrow,
  asideTitleHtml,
  asideText,
  formTitle,
  formSubtitle,
  children,
  footer,
}: AuthShellProps) {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-[40%_60%]">
      <aside
        className="relative hidden overflow-hidden px-8 py-10 lg:flex lg:flex-col lg:justify-between xl:px-12 2xl:px-16"
        style={{
          background: 'linear-gradient(155deg, #082e2a 0%, #0c4a44 48%, #0d9488 130%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 85% -10%, rgba(45,212,191,0.28), transparent 60%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3.5">
          <img
            src={logoUrl}
            alt="PCCTH Logo"
            width={52}
            height={52}
            className="shrink-0 object-contain drop-shadow-sm"
            style={{ width: 52, height: 52 }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-tight text-white">Code Review</span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-white/70">
              PCCTH
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-white/60">
            {asideEyebrow}
          </p>
          <h2
            className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white"
            dangerouslySetInnerHTML={{ __html: asideTitleHtml }}
          />
          <p className="mt-4 min-h-[46px] text-[15px] leading-relaxed text-white/70">{asideText}</p>

          <div className="mt-9">
            <ScanLogPanel branch="main" />
          </div>
        </div>

        <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          © {new Date().getFullYear()} PCCTH · Automate Code Review
        </div>
      </aside>

      <div className="auth-panel relative flex min-h-screen flex-col">
        <div className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 py-1.5 pl-1.5 pr-4 text-sm font-medium text-muted shadow-sm backdrop-blur transition-all duration-200 hover:border-border-strong hover:text-fg hover:shadow-md"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-faint transition-all duration-200 group-hover:-translate-x-0.5 group-hover:bg-primary group-hover:text-primary-fg group-hover:shadow-sm group-hover:shadow-primary/40">
              <ChevronLeft size={15} strokeWidth={2.5} />
            </span>
            {t('AUTH.BACK_HOME', 'Back to home')}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-12 lg:px-10">
          <div className="w-full sm:w-[430px] max-w-[430px]">
            <div className="mb-7 flex items-center justify-center gap-3 lg:hidden">
              <img
                src={logoUrl}
                alt="PCCTH Logo"
                width={42}
                height={42}
                className="shrink-0 object-contain"
                style={{ width: 42, height: 42 }}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-tight text-fg">Code Review</span>
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-faint">
                  PCCTH
                </span>
              </div>
            </div>

            <div className="auth-card relative overflow-hidden rounded-2xl border border-border bg-surface p-7 sm:p-9 transition-all duration-200">
              <span aria-hidden className="auth-card-accent absolute inset-x-0 top-0 h-[3px]" />

              <div className="mb-8">
                <div className="text-[25px] font-semibold leading-snug tracking-tight text-fg">
                  {formTitle}
                </div>
                {formSubtitle ? (
                  <div className="mt-2.5 min-h-[48px] flex items-center justify-center text-sm leading-relaxed text-muted text-center">
                    {formSubtitle}
                  </div>
                ) : null}
              </div>

              {children}

              {footer ? <div className="mt-8">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
