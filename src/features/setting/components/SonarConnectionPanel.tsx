import type { LucideIcon } from 'lucide-react';
import { Loader2, PlugZap, RotateCcw, Save, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SonarConnectionPanel({
  connectionMeta,
  ConnectionIcon,
  isTesting,
  handleTestConnection,
  form,
  isSaving,
  isValid,
  isDirty,
  handleReset,
  handleSave,
}: {
  connectionMeta: { chip: string; badge: string; labelKey: string };
  ConnectionIcon: LucideIcon;
  isTesting: boolean;
  handleTestConnection: () => void;
  form: { serverUrl: string };
  isSaving: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleReset: () => void;
  handleSave: () => void;
}) {
  const { t } = useTranslation();

  return (
  <aside className="space-y-4 lg:sticky lg:top-20">
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-faint">
        {t('SONARQUBE_CONFIG.CONNECTION_STATUS')}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${connectionMeta.badge}`}
        >
          {isTesting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ConnectionIcon size={18} />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fg">
            {isTesting ? t('SONARQUBE_CONFIG.TESTING') : t(connectionMeta.labelKey)}
          </p>
          <p className="truncate text-xs text-faint">
            {form.serverUrl || t('SONARQUBE_CONFIG.NO_SERVER_URL')}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={!isValid || isSaving || isTesting}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {t('SONARQUBE_CONFIG.SAVE_SETTINGS')}
        </button>
        <button
          type="button"
          onClick={() => void handleTestConnection()}
          disabled={isTesting || isSaving}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isTesting ? <Loader2 size={15} className="animate-spin" /> : <PlugZap size={15} />}
          {t(isTesting ? 'SONARQUBE_CONFIG.TESTING' : 'SONARQUBE_CONFIG.TEST_CONNECTION')}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving || isTesting}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw size={15} />
          {t('SONARQUBE_CONFIG.RESET')}
        </button>
      </div>

      {isDirty ? (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-warning">
          <TriangleAlert size={13} />
          {t('SONARQUBE_CONFIG.UNSAVED_CHANGES')}
        </p>
      ) : null}
    </div>

    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <ShieldCheck size={15} className="text-primary" />
        <h3 className="text-sm font-semibold text-fg">
          {t('SONARQUBE_CONFIG.HOW_TO_GET_GIT_TOKEN')}
        </h3>
      </div>
      <ol className="mt-3 space-y-2.5">
        {['STEP_1', 'STEP_2', 'STEP_3', 'STEP_4'].map((step, index) => (
          <li key={step} className="flex gap-2.5 text-xs leading-relaxed text-muted">
            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-semibold text-faint">
              {index + 1}
            </span>
            {t(`SONARQUBE_CONFIG.${step}`)}
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-lg bg-primary-subtle px-3 py-2 text-xs leading-relaxed text-primary">
        {t('SONARQUBE_CONFIG.TOOLTIP_NOTE')}
      </p>
    </div>
  </aside>
  );
}
