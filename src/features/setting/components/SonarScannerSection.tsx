import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/ui/SectionCard';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';
import { SelectField } from '@/components/common/SelectField';
import { Switch } from '@/components/common/Switch';
import { BUILD_TOOLS, DEFAULT_EXCLUSIONS, JDK_VERSIONS } from '@/features/setting/lib/sonar-form';
import type { SonarFormControl } from '@/features/setting/components/sonar-form-control';

export function SonarScannerSection({
  control,
}: {
  control: SonarFormControl;
}) {
  const { t } = useTranslation();
  const { form, update, markTouched } = control;

  return (
    <SectionCard
      eyebrow="03"
      title={t('SONARQUBE_CONFIG.SCANNER_SETTINGS')}
      description={t('SONARQUBE_CONFIG.SCANNER_SETTINGS_HINT')}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface-2/40 p-4">
          <h3 className="text-sm font-semibold text-fg">
            {t('SONARQUBE_CONFIG.ANGULAR_PROJECTS')}
          </h3>
          <div className="mt-4 space-y-3">
            <Switch
              id="angularRunNpm"
              checked={form.angularRunNpm}
              onChange={(checked) => update({ angularRunNpm: checked })}
              label={t('SONARQUBE_CONFIG.RUN_NPM')}
            />
            <Switch
              id="angularCoverage"
              checked={form.angularCoverage}
              onChange={(checked) => update({ angularCoverage: checked })}
              label={t('SONARQUBE_CONFIG.GENERATE_COVERAGE')}
            />
            <Switch
              id="angularTsFiles"
              checked={form.angularTsFiles}
              onChange={(checked) => update({ angularTsFiles: checked })}
              label={t('SONARQUBE_CONFIG.INCLUDE_TS')}
            />
          </div>
          <div className="mt-4">
            <FormField
              id="angularExclusions"
              label={t('SONARQUBE_CONFIG.EXCLUSIONS')}
              hint={t('SONARQUBE_CONFIG.COMMA_SEPARATED')}
            >
              <input
                id="angularExclusions"
                type="text"
                className={`${FIELD_INPUT_CLASS} font-mono text-xs`}
                placeholder={DEFAULT_EXCLUSIONS}
                value={form.angularExclusions}
                onChange={(event) => update({ angularExclusions: event.target.value })}
                onBlur={() => markTouched('angularExclusions')}
              />
            </FormField>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface-2/40 p-4">
          <h3 className="text-sm font-semibold text-fg">
            {t('SONARQUBE_CONFIG.SPRING_PROJECTS')}
          </h3>
          <div className="mt-4 space-y-3">
            <Switch
              id="springRunTests"
              checked={form.springRunTests}
              onChange={(checked) => update({ springRunTests: checked })}
              label={t('SONARQUBE_CONFIG.RUN_TESTS')}
            />
            <Switch
              id="springJacoco"
              checked={form.springJacoco}
              onChange={(checked) => update({ springJacoco: checked })}
              label={t('SONARQUBE_CONFIG.INCLUDE_JACOCO')}
            />
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                {t('SONARQUBE_CONFIG.BUILD_TOOL')}
              </p>
              <div className="mt-1.5 inline-flex rounded-lg border border-border bg-surface p-0.5">
                {BUILD_TOOLS.map((tool) => {
                  const active = form.springBuildTool === tool.value;
                  return (
                    <button
                      key={tool.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => update({ springBuildTool: tool.value })}
                      className={`h-8 rounded-md px-5 text-xs font-medium transition ${
                        active ? 'bg-primary-subtle text-primary' : 'text-muted hover:text-fg'
                      }`}
                    >
                      {t(tool.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            <FormField id="springJdkVersion" label={t('SONARQUBE_CONFIG.JDK_VERSION')}>
              <SelectField
                id="springJdkVersion"
                className={FIELD_INPUT_CLASS}
                value={String(form.springJdkVersion)}
                onChange={(next) => update({ springJdkVersion: Number(next) })}
                options={JDK_VERSIONS.map((version) => ({
                  value: String(version),
                  label: String(version),
                }))}
              />
            </FormField>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
