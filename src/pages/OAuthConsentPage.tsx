import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppWindow, Loader2, ShieldCheck } from 'lucide-react';
import logoUrl from '@/assets/logo.png';
import { OAuthShell } from '@/features/auth/components/OAuthShell';
import { AuthAlert } from '@/features/auth/components/AuthAlert';
import { ConsentScopeList } from '@/features/auth/components/ConsentScopeList';
import { useConsentInfo } from '@/features/auth/hooks/useConsentInfo';
import { OAUTH_AUTHORIZE_URL, oauthLogout } from '@/features/auth/api/oauth.api';
import { readConsentParams } from '@/features/auth/lib/oauth-consent';

export function OAuthConsentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = readConsentParams(searchParams);
  const consent = useConsentInfo(params?.clientId ?? '', params?.scope ?? '');

  async function switchAccount() {
    await oauthLogout().catch(() => undefined);
    navigate('/oauth/login');
  }

  if (!params) {
    return (
      <OAuthShell>
        <AuthAlert>{t('OAUTH.INVALID_REQUEST')}</AuthAlert>
      </OAuthShell>
    );
  }

  if (consent.isPending) {
    return (
      <OAuthShell>
        <div className="flex items-center justify-center py-10 text-faint">
          <Loader2 size={22} className="animate-spin" />
        </div>
      </OAuthShell>
    );
  }

  if (consent.isError) {
    return (
      <OAuthShell>
        <AuthAlert>{t('OAUTH.LOAD_ERROR')}</AuthAlert>
      </OAuthShell>
    );
  }

  const { clientName, principalName, scopesToApprove, previouslyApprovedScopes } = consent.data;

  return (
    <OAuthShell
      footer={
        <>
          {t('OAUTH.SIGNED_IN_AS')} <span className="font-medium text-muted">{principalName}</span>
          {' · '}
          <button type="button" onClick={switchAccount} className="text-primary hover:underline">
            {t('OAUTH.SWITCH_ACCOUNT')}
          </button>
        </>
      }
    >
      <div className="mb-6 flex flex-col items-center gap-3.5 text-center">
        <div aria-hidden className="flex items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-border bg-surface-2 text-primary">
            <AppWindow size={21} />
          </span>
          <span
            className="h-px w-8"
            style={{
              background: 'repeating-linear-gradient(90deg, var(--border-strong) 0 4px, transparent 4px 8px)',
            }}
          />
          <span className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-border bg-surface-2">
            <img src={logoUrl} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
          </span>
        </div>
        <h2 className="text-lg font-semibold leading-snug tracking-tight">
          <span className="text-primary">{clientName}</span> {t('OAUTH.CONSENT_TITLE')}
        </h2>
        <p className="text-[13px] leading-relaxed text-muted">{t('OAUTH.CONSENT_SUBTITLE')}</p>
      </div>

      <form method="post" action={OAUTH_AUTHORIZE_URL}>
        <input type="hidden" name="client_id" value={params.clientId} />
        <input type="hidden" name="state" value={params.state} />
        {scopesToApprove.map((scope) => (
          <input key={scope} type="hidden" name="scope" value={scope} />
        ))}

        {scopesToApprove.length > 0 ? (
          <>
            <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
              {t('OAUTH.WILL_BE_ABLE_TO')}
            </p>
            <ConsentScopeList scopes={scopesToApprove} />
          </>
        ) : null}

        {previouslyApprovedScopes.length > 0 ? (
          <>
            <p className="mb-2 mt-5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
              {t('OAUTH.ALREADY_ALLOWED')}
            </p>
            <ConsentScopeList scopes={previouslyApprovedScopes} granted />
          </>
        ) : null}

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
          <span>{t('OAUTH.CONSENT_NOTE')}</span>
        </div>

        <button
          type="submit"
          className="auth-submit mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-primary/35 active:scale-[0.99]"
        >
          {t('OAUTH.AUTHORIZE')}
        </button>
      </form>

      <form method="post" action={OAUTH_AUTHORIZE_URL} className="mt-2.5">
        <input type="hidden" name="client_id" value={params.clientId} />
        <input type="hidden" name="state" value={params.state} />
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-muted transition-colors hover:border-border-strong hover:bg-surface-2 hover:text-fg"
        >
          {t('OAUTH.DECLINE')}
        </button>
      </form>
    </OAuthShell>
  );
}
