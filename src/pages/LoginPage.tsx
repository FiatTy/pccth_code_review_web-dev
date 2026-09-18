import { Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import logoUrl from '@/assets/logo.png';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { MicrosoftLogo } from '@/features/auth/components/MicrosoftLogo';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/lib/toast/toast-context';

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleM365Login() {
    showToast({
      tone: 'info',
      title: t('LOGIN.M365_MOCK_TOAST', 'กำลังพัฒนาระบบเชื่อมต่อ Microsoft 365'),
      description: 'UI Mockup - Microsoft 365 OAuth flow for PCC Organization',
    });
  }

  const isThai = (i18n.resolvedLanguage ?? i18n.language ?? 'th').toLowerCase().startsWith('th');

  const formTitle = (
    <div className="flex flex-col items-center text-center">
      {/* Top: Microsoft 4-color Logo */}
      <div className="mb-3 flex items-center justify-center">
        <MicrosoftLogo size={42} />
      </div>

      {/* Organization Badge indicating PCC */}
      <div className="mb-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/70 px-2.5 py-0.5 text-[11px] font-medium text-fg shadow-2xs backdrop-blur">
          <img src={logoUrl} alt="" width={14} height={14} className="object-contain" />
          <span className="font-semibold text-primary">PCC</span>
          <span className="text-muted">{isThai ? 'องค์กร' : 'Organization'}</span>
        </span>
      </div>

      {/* Under Logo: Microsoft 365 with Theme Green Highlight */}
      <div className="text-2xl sm:text-[26px] font-bold tracking-tight text-fg">
        Microsoft <span className="text-primary font-bold">365</span>
      </div>
    </div>
  );

  const formSubtitle = (
    <span className="block text-center text-sm sm:text-[15px] leading-relaxed text-muted max-w-[340px] mx-auto text-balance">
      {isThai ? (
        <>
          เข้าสู่ระบบด้วยบัญชี
          <br className="hidden sm:inline" /> Microsoft 365 ขององค์กร <span className="font-semibold text-fg">PCC</span>
        </>
      ) : (
        <>
          Sign in with your <span className="font-semibold text-fg">PCC</span> organization's
          <br className="hidden sm:inline" /> Microsoft 365 account
        </>
      )}
    </span>
  );

  return (
    <AuthShell
      asideEyebrow={t('AUTH.ASIDE_EYEBROW')}
      asideTitleHtml={t('LOGIN.WELCOME_TITLE')}
      asideText={t('AUTH.ASIDE_TAGLINE')}
      formTitle={formTitle}
      formSubtitle={formSubtitle}
    >
      <div className="space-y-6 pt-3">
        <button
          type="button"
          onClick={handleM365Login}
          className="auth-submit group inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl text-[15px] font-semibold text-primary-fg shadow-md shadow-primary/20 dark:shadow-black/50 transition-all hover:shadow-primary/30 dark:hover:shadow-primary/20 active:scale-[0.99] cursor-pointer"
        >
          <MicrosoftLogo size={20} />
          <span className="text-[15px] font-medium tracking-normal text-white">
            {t('LOGIN.M365_BUTTON', 'เข้าสู่ระบบด้วย Microsoft 365')}
          </span>
        </button>
      </div>
    </AuthShell>
  );
}
