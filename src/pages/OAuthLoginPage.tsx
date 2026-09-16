import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { OAuthShell } from '@/features/auth/components/OAuthShell';
import { AuthField } from '@/features/auth/components/AuthField';
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton';
import { AuthAlert } from '@/features/auth/components/AuthAlert';
import { useOAuthLogin } from '@/features/auth/hooks/useOAuthLogin';
import { BASE_URL } from '@/config/env';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/;

export function OAuthLoginPage() {
  const { t } = useTranslation();
  const login = useOAuthLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const trimmedEmail = email.trim();
  const emailError = !trimmedEmail
    ? 'LOGIN.EMAIL_REQUIRED'
    : !EMAIL_PATTERN.test(trimmedEmail)
      ? 'LOGIN.EMAIL_PATTERN'
      : null;
  const passwordError = !password ? 'LOGIN.PASSWORD_REQUIRED' : null;

  function clearServerError() {
    if (login.isError) {
      login.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (emailError || passwordError) {
      return;
    }
    login.mutate(
      { email: trimmedEmail, password },
      { onSuccess: ({ redirectTo }) => window.location.assign(redirectTo || BASE_URL) },
    );
  }

  return (
    <OAuthShell
      eyebrow={t('OAUTH.LOGIN_EYEBROW')}
      title={t('OAUTH.LOGIN_TITLE')}
      subtitle={t('OAUTH.LOGIN_SUBTITLE')}
      footer={t('OAUTH.LOGIN_FOOTER')}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {login.isError ? <AuthAlert>{t('OAUTH.LOGIN_ERROR')}</AuthAlert> : null}

        <AuthField
          id="email"
          label={t('AUTH.EMAIL')}
          icon={Mail}
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(value) => {
            setEmail(value);
            clearServerError();
          }}
          placeholder={t('LOGIN.EMAIL_PLACEHOLDER')}
          error={submitted && emailError ? t(emailError) : null}
        />

        <AuthField
          id="password"
          label={t('AUTH.PASSWORD')}
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            clearServerError();
          }}
          placeholder={t('LOGIN.PASSWORD_PLACEHOLDER')}
          error={submitted && passwordError ? t(passwordError) : null}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? t('SONARQUBE_CONFIG.HIDE') : t('SONARQUBE_CONFIG.SHOW')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-faint transition-colors hover:text-fg"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <AuthSubmitButton pending={login.isPending}>{t('OAUTH.CONTINUE')}</AuthSubmitButton>
      </form>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
        <span>{t('OAUTH.LOGIN_NOTE')}</span>
      </div>
    </OAuthShell>
  );
}
