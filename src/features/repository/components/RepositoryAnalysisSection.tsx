import { useTranslation } from 'react-i18next';
import { GitBranch, Hash, Server } from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';

const SCAN_BRANCH = 'dev';

export function RepositoryAnalysisSection({
  projectKey,
  serverUrl,
}: {
  projectKey: string;
  serverUrl: string;
}) {
  const { t } = useTranslation();

  return (
    <SectionCard eyebrow="02" title={t('REPOSITORY.ANALYSIS_CONFIG')}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="sonarServerUrl"
          label={t('REPOSITORY.SONAR_SERVER')}
          hint={t('REPOSITORY.FROM_SETTINGS')}
        >
          <div className="relative">
            <Server
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              id="sonarServerUrl"
              type="text"
              readOnly
              className={`${FIELD_INPUT_CLASS} pl-9 font-mono text-xs text-muted`}
              value={serverUrl}
            />
          </div>
        </FormField>

        <FormField
          id="sonarProjectKey"
          label={t('REPOSITORY.PROJECT_KEY')}
          hint={t('REPOSITORY.PROJECT_KEY_HINT')}
        >
          <div className="relative">
            <Hash
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              id="sonarProjectKey"
              type="text"
              readOnly
              className={`${FIELD_INPUT_CLASS} pl-9 font-mono text-xs text-muted`}
              value={projectKey}
            />
          </div>
        </FormField>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-surface-2/50 px-4 py-3 text-xs leading-relaxed text-muted">
        <GitBranch size={15} className="mt-0.5 shrink-0 text-primary" />
        <p>{t('REPOSITORY.SCAN_ON_SAVE_HINT', { branch: SCAN_BRANCH })}</p>
      </div>
    </SectionCard>
  );
}
