import { Link, Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '@/components/common/BrandMark';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { MicrosoftLogo } from '@/features/auth/components/MicrosoftLogo';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/lib/toast/toast-context';

export function LoginPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleM365Login() {
    showToast({
      tone: 'info',
      title: t('LOGIN.M365_MOCK_TOAST', 'กำลังพัฒนาระบบเชื่อมต่อ Microsoft 365'),
      description: 'UI Mockup - Microsoft 365 OAuth flow',
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-100 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-900 overflow-hidden">
      {/* Subtle ambient lighting decorations */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 20%, transparent), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 15%, transparent), transparent 70%)',
        }}
      />

      {/* Minimalist Web UI Login Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-surface/95 p-7 shadow-xl shadow-teal-950/5 backdrop-blur-md sm:p-9 transition-all">
        {/* Top subtle brand accent line */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary/50 via-primary to-primary/50"
        />

        {/* Top Right: Language Switcher and Theme Toggle */}
        <div className="mb-6 flex items-center justify-end gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Centered Brand & Text Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center justify-center">
            <BrandMark size={36} />
          </div>
          <h1 className="text-base font-semibold leading-relaxed text-fg sm:text-lg">
            {t('LOGIN.M365_ORG_TITLE', 'เข้าสู่ระบบด้วยบัญชี Microsoft 365 ขององค์กร')}
          </h1>
        </div>

        {/* Primary Teal Microsoft 365 Login Button */}
        <button
          type="button"
          onClick={handleM365Login}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3.5 px-5 font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.99] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface cursor-pointer"
        >
          <MicrosoftLogo size={20} />
          <span className="text-[15px] font-medium tracking-normal text-white">
            {t('LOGIN.M365_BUTTON', 'เข้าสู่ระบบด้วย Microsoft 365')}
          </span>
        </button>

        {/* Bottom text link: Back to home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-fg"
          >
            {t('AUTH.BACK_HOME_ARROW', '← กลับหน้าแรก')}
          </Link>
        </div>
      </div>
    </div>
  );
}
