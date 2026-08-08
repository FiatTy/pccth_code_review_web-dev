import { useTranslation } from 'react-i18next';
import { AlertTriangle, SlidersHorizontal } from 'lucide-react';

export type MissingScanConfigReason = 'SONAR' | 'GIT';

export function MissingScanConfigDialog({
  reason,
  onClose,
  onGoToConfig,
}: {
  reason: MissingScanConfigReason;
  onClose: () => void;
  onGoToConfig: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('REPOSITORY.CANCEL')}
        className="absolute inset-0 bg-black/50"
        onClick={() => onClose()}
      />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warning/12 text-warning">
          <AlertTriangle size={20} />
        </div>
        <h2 className="mt-4 text-base font-semibold text-fg">
          {t(
            reason === 'GIT'
              ? 'REPOSITORY.MISSING_GIT_TOKEN_TITLE'
              : 'REPOSITORY.MISSING_SONAR_TITLE',
          )}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {t(
            reason === 'GIT'
              ? 'REPOSITORY.MISSING_GIT_TOKEN_TEXT'
              : 'REPOSITORY.MISSING_SONAR_TEXT',
          )}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onClose()}
            className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
          >
            {t('REPOSITORY.CANCEL')}
          </button>
          <button
            type="button"
            onClick={() => onGoToConfig()}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover active:scale-[0.99]"
          >
            <SlidersHorizontal size={15} />
            {t('REPOSITORY.GO_TO_SETTINGS')}
          </button>
        </div>
      </div>
    </div>
  );
}
