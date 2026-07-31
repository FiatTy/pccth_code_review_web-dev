import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthStatus } from '@/features/auth/components/AuthStatus';

export function VerifySuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const already = searchParams.get('status') === 'already';

  return (
    <AuthStatus
      tone="success"
      icon={CheckCircle2}
      title={already ? t('VERIFY.ALREADY_TITLE') : t('VERIFY.SUCCESS_TITLE')}
      description={already ? t('VERIFY.ALREADY_TEXT') : t('VERIFY.SUCCESS_TEXT')}
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
