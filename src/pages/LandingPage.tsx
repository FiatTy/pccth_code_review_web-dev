import { Link, Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  LayoutDashboard,
  Search,
  Timer,
  XCircle,
} from 'lucide-react';
import { BrandMark } from '@/components/common/BrandMark';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { StableLabel, StableText } from '@/components/common/StableLabel';
import { Reveal } from '@/components/common/Reveal';
import { useAuth } from '@/lib/auth/auth-context';

const FEATURES = [
  {
    icon: Timer,
    titleKey: 'LANDING.SAVE_TIME',
    descKey: 'LANDING.SAVE_TIME_DESC',
    tint: 'bg-primary-subtle text-primary',
  },
  {
    icon: Search,
    titleKey: 'LANDING.ISSUE_DETECTION',
    descKey: 'LANDING.ISSUE_DETECTION_DESC',
    tint: 'bg-info/10 text-info',
  },
  {
    icon: LayoutDashboard,
    titleKey: 'LANDING.DASHBOARD',
    descKey: 'LANDING.DASHBOARD_DESC',
    tint: 'bg-major/10 text-major',
  },
];

const NOTIFICATION_LEVELS = [
  {
    key: 'COMMON.SUCCESS',
    descKey: 'LANDING.NOTIF_SUCCESS_DESC',
    icon: CheckCircle2,
    tile: 'bg-success/10 text-success',
    barColor: 'var(--success)',
  },
  {
    key: 'COMMON.INFO',
    descKey: 'LANDING.NOTIF_INFO_DESC',
    icon: Info,
    tile: 'bg-info/10 text-info',
    barColor: 'var(--info)',
  },
  {
    key: 'COMMON.WARNING',
    descKey: 'LANDING.NOTIF_WARNING_DESC',
    icon: AlertTriangle,
    tile: 'bg-warning/10 text-warning',
    barColor: 'var(--warning)',
  },
  {
    key: 'COMMON.ERROR',
    descKey: 'LANDING.NOTIF_ERROR_DESC',
    icon: XCircle,
    tile: 'bg-danger/10 text-danger',
    barColor: 'var(--danger)',
  },
];

export function LandingPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-3 sm:px-5">
          <BrandMark size={44} wordmarkClassName="hidden min-[575px]:flex" />
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <LanguageSwitcher />
            <div className="hidden min-[575px]:block">
              <ThemeToggle />
            </div>
            <Link
              to="/login"
              className="inline-flex rounded-full px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg sm:px-4 sm:py-2 sm:text-sm"
            >
              <StableLabel i18nKey="AUTH.LOGIN" />
            </Link>
            <Link
              to="/register"
              className="brand-gradient-bg group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-px hover:shadow-primary/40 active:scale-[0.98] sm:px-4 sm:py-2 sm:text-sm"
            >
              <StableLabel i18nKey="AUTH.REGISTER" />
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 sm:w-[15px] sm:h-[15px]" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="landing-hero-glow pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-[110vw] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(closest-side, color-mix(in oklab, var(--primary) 22%, transparent), transparent)',
            }}
          />
          <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center sm:py-36">
            <Reveal className="flex flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 py-1.5 pl-2 pr-3.5 text-[12px] font-medium text-muted shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Continuous Code Quality
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                <span className="text-fg">PCCTH </span>
                <span className="brand-text-gradient">Automate Code Review</span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                <StableText>
                  {(lang) => (
                    <>
                      {t('LANDING.HERO_SUBTITLE_1', { lng: lang })}{' '}
                      <span className="font-medium text-fg">
                        {t('LANDING.HERO_SUBTITLE_2', { lng: lang })}
                      </span>
                    </>
                  )}
                </StableText>
              </p>
            </Reveal>
            <Reveal delay={270}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="brand-gradient-bg group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 active:scale-[0.99]"
                >
                  <StableLabel i18nKey="LANDING.GET_STARTED" />
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-6 py-3 text-[15px] font-semibold text-fg shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md active:scale-[0.99]"
                >
                  <StableLabel i18nKey="LANDING.EXPLORE_FEATURES" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-24">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                {t('LANDING.WHY_CHOOSE_US_EYEBROW', 'Why choose us')}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
                {t('LANDING.WHY_CHOOSE_US')}
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.titleKey} delay={index * 120} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-black/[0.06]">
                    <span
                      aria-hidden
                      className="auth-card-accent absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ring-border/60 transition-transform duration-200 group-hover:scale-105 ${feature.tint}`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-fg">{t(feature.titleKey)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t(feature.descKey)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-border bg-surface-2/40 py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[720px] max-w-[110vw] -translate-x-1/2 opacity-50 blur-3xl"
            style={{
              background:
                'radial-gradient(closest-side, color-mix(in oklab, var(--primary) 14%, transparent), transparent)',
            }}
          />
          <div className="relative mx-auto w-full max-w-5xl px-5">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
                  {t('LANDING.NOTIFICATIONS_EYEBROW')}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg">
                  {t('LANDING.NOTIFICATIONS_4_LEVELS')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {t('LANDING.NOTIFICATIONS_SUBTITLE')}
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {NOTIFICATION_LEVELS.map((level, index) => {
                const Icon = level.icon;
                return (
                  <Reveal
                    key={level.key}
                    delay={index * 110}
                    duration={420}
                    easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
                    className="h-full"
                  >
                    <div
                      className="group flex h-full items-center gap-3.5 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.06]"
                      style={{ borderLeftWidth: 3, borderLeftColor: level.barColor }}
                    >
                      <span
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-border/50 transition-transform duration-200 group-hover:scale-105 ${level.tile}`}
                      >
                        <Icon size={21} />
                      </span>
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold text-fg">{t(level.key)}</p>
                        <p className="mt-0.5 text-xs leading-snug text-muted">{t(level.descKey)}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <Reveal className="landing-cta relative overflow-hidden rounded-2xl px-8 py-14 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {t('LANDING.CTA_TITLE')}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/85">
              {t('LANDING.CTA_DESC')}
            </p>
            <Link
              to="/register"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-primary shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99]"
            >
              {t('LANDING.GET_STARTED')}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 text-center sm:flex-row sm:text-left">
          <BrandMark size={24} />
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-faint">
            PCCTH Automate Code Review
          </p>
        </div>
      </footer>
    </div>
  );
}
