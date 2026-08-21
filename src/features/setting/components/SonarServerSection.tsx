import type { Dispatch, SetStateAction } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/ui/SectionCard';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';
import type { SonarFormControl } from '@/features/setting/components/sonar-form-control';

export function SonarServerSection({
  control,
  showToken,
  setShowToken,
}: {
  control: SonarFormControl;
  showToken: boolean;
  setShowToken: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const { form, errors, touched, update, markTouched } = control;

  return (
    <SectionCard
      eyebrow="01"
      title={t('SONARQUBE_CONFIG.SERVER_CONFIG')}
      description={t('SONARQUBE_CONFIG.SERVER_CONFIG_HINT')}
    >
      <div className="space-y-4">
        <FormField
          id="serverUrl"
          label={t('SONARQUBE_CONFIG.SERVER_URL')}
          error={touched.serverUrl ? errors.serverUrl : ''}
        >
          <input
            id="serverUrl"
            type="url"
            className={FIELD_INPUT_CLASS}
            placeholder="https://sonarqube.example.com"
            value={form.serverUrl}
            onChange={(event) => update({ serverUrl: event.target.value })}
            onBlur={() => markTouched('serverUrl')}
          />
        </FormField>

        <FormField
          id="authToken"
          label={t('SONARQUBE_CONFIG.AUTH_TOKEN')}
          error={touched.authToken ? errors.authToken : ''}
        >
          <div className="relative">
            <input
              id="authToken"
              type={showToken ? 'text' : 'password'}
              className={`${FIELD_INPUT_CLASS} pr-11 font-mono`}
              value={form.authToken}
              onChange={(event) => update({ authToken: event.target.value })}
              onBlur={() => markTouched('authToken')}
            />
            <button
              type="button"
              aria-label={t(showToken ? 'SONARQUBE_CONFIG.HIDE' : 'SONARQUBE_CONFIG.SHOW')}
              onClick={() => setShowToken((current) => !current)}
              className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <FormField id="organization" label={t('SONARQUBE_CONFIG.DEFAULT_ORG')}>
          <input
            id="organization"
            type="text"
            maxLength={50}
            className={FIELD_INPUT_CLASS}
            placeholder="PCCTH"
            value={form.organization}
            onChange={(event) => update({ organization: event.target.value })}
            onBlur={() => markTouched('organization')}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
