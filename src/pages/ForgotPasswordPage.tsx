import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, MailCheck } from 'lucide-react';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { AuthField } from '@/features/auth/components/AuthField';
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton';
import { AuthAlert } from '@/features/auth/components/AuthAlert';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const trimmedEmail = email.trim();
  const emailErrorKey = !trimmedEmail
    ? 'FORGOT_PASSWORD.EMAIL_REQUIRED'
    : !EMAIL_PATTERN.test(trimmedEmail)
      ? 'FORGOT_PASSWORD.EMAIL_INVALID'
      : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (emailErrorKey) {
      return;
    }
    forgotPassword.mutate(trimmedEmail);
  }

  const backToLogin = (
    <div className="border-t border-border pt-6 text-sm">
      <Link to="/login" className="font-medium text-primary hover:underline">
        {t('AUTH.LOGIN')}
      </Link>
    </div>
  );

  return (
    <AuthShell
      asideEyebrow={t('AUTH.ASIDE_EYEBROW')}
      asideTitleHtml={t('FORGOT_PASSWORD.TITLE')}
      asideText={t('FORGOT_PASSWORD.DESC')}
      formTitle={t('FORGOT_PASSWORD.FORM_TITLE')}
      formSubtitle={forgotPassword.isSuccess ? undefined : t('FORGOT_PASSWORD.DESC')}
      footer={backToLogin}
    >
      {forgotPassword.isSuccess ? (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">
            <MailCheck size={22} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-fg">
            {t('FORGOT_PASSWORD.SENT_TITLE')}
          </h2>
          <p className="mt-1.5 text-sm text-muted">{t('FORGOT_PASSWORD.SNACK_LINK_SENT')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {forgotPassword.isError ? (
            <AuthAlert>{t('FORGOT_PASSWORD.SNACK_ERROR')}</AuthAlert>
          ) : null}

          <AuthField
            id="email"
            label={t('FORGOT_PASSWORD.EMAIL_LABEL')}
            icon={Mail}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (forgotPassword.isError) forgotPassword.reset();
            }}
            placeholder={t('FORGOT_PASSWORD.EMAIL_PLACEHOLDER')}
            error={submitted && emailErrorKey ? t(emailErrorKey) : null}
          />

          <AuthSubmitButton pending={forgotPassword.isPending}>
            {t('FORGOT_PASSWORD.SEND_RESET_LINK')}
          </AuthSubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
