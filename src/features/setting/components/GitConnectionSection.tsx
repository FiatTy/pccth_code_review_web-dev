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
import type { SonarFormControl } from '@/features/setting/components/sonar-form-control';
import {
  useConnectGitProvider,
  useGitIdentity,
} from '@/features/setting/hooks/useGitIdentity';

type LinkState = 'loading' | 'linked' | 'unlinked' | 'error';

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
  error: {
    icon: TriangleAlert,
    badge: 'bg-warning/12 text-warning',
    labelKey: 'SONARQUBE_CONFIG.GIT_STATUS_ERROR',
  },
};

export function GitConnectionSection({ control }: { control: SonarFormControl }) {
  const { t } = useTranslation();
  const { form, errors, touched, update, markTouched } = control;
  const [showGitToken, setShowGitToken] = useState(false);
  const identity = useGitIdentity('gitlab');
  const connect = useConnectGitProvider('gitlab');

  const state: LinkState = identity.isLoading
    ? 'loading'
    : identity.isError
      ? 'error'
      : identity.data?.connected
        ? 'linked'
        : 'unlinked';
  const meta = LINK_META[state];
  const StateIcon = meta.icon;
  const isLinked = state === 'linked';

  return (
    <SectionCard
      eyebrow="02"
      title={t('SONARQUBE_CONFIG.GIT_CONNECTION')}
      description={t('SONARQUBE_CONFIG.GIT_CONNECTION_HINT')}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/40 px-4 py-3.5">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.badge}`}
          >
            <StateIcon size={18} className={state === 'loading' ? 'animate-spin' : undefined} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-fg">
              {t('SONARQUBE_CONFIG.GIT_PROVIDER_GITLAB')}
            </p>
            <p className="truncate text-xs text-muted">
              {isLinked && identity.data?.username
                ? `${t(meta.labelKey)} · ${identity.data.username}`
                : t(meta.labelKey)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => connect.mutate()}
            disabled={identity.isLoading || connect.isPending}
            className={
              isLinked
                ? 'inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60'
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
          <p role="alert" className="flex items-center gap-1.5 text-xs text-danger">
            <TriangleAlert size={13} className="shrink-0" />
            {t('SONARQUBE_CONFIG.GIT_STATUS_ERROR')}
          </p>
        ) : null}

        <details className="group rounded-xl border border-border">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
            <ChevronRight
              size={14}
              className="shrink-0 transition-transform duration-150 group-open:rotate-90"
            />
            {t('SONARQUBE_CONFIG.GIT_MANUAL_TOKEN')}
          </summary>
          <div className="border-t border-border px-4 py-4">
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
                  className={`${FIELD_INPUT_CLASS} pr-11 font-mono`}
                  value={form.gitAccessToken}
                  onChange={(event) => update({ gitAccessToken: event.target.value })}
                  onBlur={() => markTouched('gitAccessToken')}
                />
                <button
                  type="button"
                  aria-label={t(showGitToken ? 'SONARQUBE_CONFIG.HIDE' : 'SONARQUBE_CONFIG.SHOW')}
                  onClick={() => setShowGitToken((current) => !current)}
                  className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  {showGitToken ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>
          </div>
        </details>
      </div>
    </SectionCard>
  );
}
