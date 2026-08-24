import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Plug,
  PlugZap,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';
import { Switch } from '@/components/common/Switch';
import type { SonarFormControl } from '@/features/setting/components/sonar-form-control';
import {
  useConnectGitProvider,
  useGitIdentity,
} from '@/features/setting/hooks/useGitIdentity';
import type { GitProvider } from '@/features/setting/types';

type LinkState = 'loading' | 'linked' | 'unlinked' | 'unconfigured' | 'error';

const LINK_META: Record<LinkState, { icon: LucideIcon; badge: string; labelKey: string }> = {
  loading: {
    icon: Loader2,
    badge: 'bg-surface-2 text-muted',
    labelKey: 'SONARQUBE_CONFIG.CHECKING',
  },
  linked: {
    icon: PlugZap,
    badge: 'bg-success/12 text-success',
    labelKey: 'SONARQUBE_CONFIG.GIT_CONNECTED',
  },
  unlinked: {
    icon: Plug,
    badge: 'bg-surface-2 text-muted',
    labelKey: 'SONARQUBE_CONFIG.GIT_NOT_CONNECTED',
  },
  unconfigured: {
    icon: Plug,
    badge: 'bg-surface-2 text-faint',
    labelKey: 'SONARQUBE_CONFIG.GIT_NOT_SET_UP',
  },
  error: {
    icon: TriangleAlert,
    badge: 'bg-warning/12 text-warning',
    labelKey: 'SONARQUBE_CONFIG.GIT_STATUS_ERROR',
  },
};

const PROVIDERS: { key: GitProvider; labelKey: string }[] = [
  { key: 'gitlab', labelKey: 'SONARQUBE_CONFIG.GIT_PROVIDER_GITLAB' },
  { key: 'github', labelKey: 'SONARQUBE_CONFIG.GIT_PROVIDER_GITHUB' },
];

function GitProviderRow({ provider, labelKey }: { provider: GitProvider; labelKey: string }) {
  const { t } = useTranslation();
  const identity = useGitIdentity(provider);
  const connect = useConnectGitProvider(provider);

  const state: LinkState = identity.isLoading
    ? 'loading'
    : identity.isError
      ? 'error'
      : !identity.data?.configured
        ? 'unconfigured'
        : identity.data.connected
          ? 'linked'
          : 'unlinked';
  const meta = LINK_META[state];
  const StateIcon = meta.icon;
  const isLinked = state === 'linked';
  const canConnect = state === 'linked' || state === 'unlinked';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 px-4 py-3.5">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.badge}`}
        >
          <StateIcon size={18} className={state === 'loading' ? 'animate-spin' : undefined} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">{t(labelKey)}</p>
          <p className="truncate text-xs text-muted">
            {isLinked && identity.data?.username
              ? `${t(meta.labelKey)} · ${identity.data.username}`
              : t(meta.labelKey)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => connect.mutate()}
          disabled={!canConnect || connect.isPending}
          className={
            isLinked
              ? 'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-fg transition hover:bg-surface-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
              : 'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'
          }
        >
          {connect.isPending ? <Loader2 size={15} className="animate-spin" /> : null}
          {t(
            connect.isPending
              ? 'SONARQUBE_CONFIG.GIT_CONNECTING'
              : isLinked
                ? 'SONARQUBE_CONFIG.GIT_RECONNECT'
                : 'SONARQUBE_CONFIG.GIT_CONNECT',
          )}
        </button>
      </div>

      {connect.isError ? (
        <p role="alert" className="flex items-center gap-1.5 px-1 text-xs text-danger">
          <TriangleAlert size={13} className="shrink-0" />
          {t('SONARQUBE_CONFIG.GIT_STATUS_ERROR')}
        </p>
      ) : null}
    </div>
  );
}

export function GitConnectionSection({ control }: { control: SonarFormControl }) {
  const { t } = useTranslation();
  const { form, errors, touched, update, markTouched } = control;
  const [showGitToken, setShowGitToken] = useState(false);

  return (
    <SectionCard
      eyebrow="02"
      title={t('SONARQUBE_CONFIG.GIT_CONNECTION')}
      description={t('SONARQUBE_CONFIG.GIT_CONNECTION_HINT')}
    >
      <div className="space-y-4">
        {PROVIDERS.map((entry) => (
          <GitProviderRow key={entry.key} provider={entry.key} labelKey={entry.labelKey} />
        ))}

        <details className="group rounded-xl border border-border">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
            <ChevronRight
              size={14}
              className="shrink-0 transition-transform duration-150 group-open:rotate-90"
            />
            {t('SONARQUBE_CONFIG.GIT_MANUAL_TOKEN')}
            {form.gitTokenEnabled ? (
              <span className="ml-auto rounded-full bg-primary/12 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {t('SONARQUBE_CONFIG.GIT_TOKEN_IN_USE')}
              </span>
            ) : null}
          </summary>
          <div className="space-y-4 border-t border-border px-4 py-4">
            <Switch
              id="gitTokenEnabled"
              align="between"
              checked={form.gitTokenEnabled}
              onChange={(checked) => {
                update({ gitTokenEnabled: checked });
                markTouched('gitAccessToken');
              }}
              label={t('SONARQUBE_CONFIG.GIT_TOKEN_ENABLED')}
              description={t('SONARQUBE_CONFIG.GIT_TOKEN_ENABLED_HINT')}
            />
            <FormField
              id="gitAccessToken"
              label={t('SONARQUBE_CONFIG.GIT_TOKEN')}
              hint={t('SONARQUBE_CONFIG.GIT_MANUAL_TOKEN_HINT')}
              error={touched.gitAccessToken ? errors.gitAccessToken : ''}
            >
              <div className="relative">
                <input
                  id="gitAccessToken"
                  type={showGitToken ? 'text' : 'password'}
                  maxLength={255}
                  disabled={!form.gitTokenEnabled}
                  className={`${FIELD_INPUT_CLASS} font-mono ${form.gitTokenEnabled ? 'pr-11' : ''}`}
                  value={form.gitAccessToken}
                  onChange={(event) => update({ gitAccessToken: event.target.value })}
                  onBlur={() => markTouched('gitAccessToken')}
                />
                {form.gitTokenEnabled ? (
                  <button
                    type="button"
                    aria-label={t(showGitToken ? 'SONARQUBE_CONFIG.HIDE' : 'SONARQUBE_CONFIG.SHOW')}
                    onClick={() => setShowGitToken((current) => !current)}
                    className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-fg"
                  >
                    {showGitToken ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                ) : null}
              </div>
            </FormField>
          </div>
        </details>
      </div>
    </SectionCard>
  );
}
