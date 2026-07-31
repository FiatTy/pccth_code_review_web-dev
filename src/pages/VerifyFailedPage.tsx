import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, XCircle } from 'lucide-react';
import { AuthStatus } from '@/features/auth/components/AuthStatus';

export function VerifyFailedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get('reason') === 'expired';

  return (
    <AuthStatus
      tone="error"
      icon={XCircle}
      title={expired ? t('VERIFY.EXPIRED_TITLE') : t('VERIFY.FAILED_TITLE')}
      description={expired ? t('VERIFY.EXPIRED_TEXT') : t('VERIFY.FAILED_TEXT')}
      action={
        <button
          type="button"
          onClick={() => navigate('/')}
          className="brand-gradient-bg group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/35 active:scale-[0.99]"
        >
          {t('VERIFY.GO_TO_WEBSITE')}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      }
    />
  );
}
