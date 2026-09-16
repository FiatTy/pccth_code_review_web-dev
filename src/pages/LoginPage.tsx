import { Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
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
      description: 'UI Mockup - Microsoft 365 OAuth flow',
    });
  }

  const isThai = (i18n.resolvedLanguage ?? i18n.language ?? 'th').toLowerCase().startsWith('th');

  const formTitle = (
    <div className="flex flex-col items-center text-center">
      {/* Top: Microsoft 4-color Logo */}
      <div className="mb-3.5 flex items-center justify-center">
        <MicrosoftLogo size={42} />
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
          <br className="hidden sm:inline" /> Microsoft 365 ขององค์กร
        </>
      ) : (
        <>
          Sign in with your organization's
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
          className="auth-submit group inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl text-[15px] font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-primary/35 active:scale-[0.99] cursor-pointer"
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
