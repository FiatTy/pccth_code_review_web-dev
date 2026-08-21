import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/ui/SectionCard';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';
import { Switch } from '@/components/common/Switch';
import { readNumber, type GateKey } from '@/features/setting/lib/sonar-form';
import type { SonarFormControl } from '@/features/setting/components/sonar-form-control';

export function SonarQualityGateSection({
  control,
  updateGate,
  gateFields,
}: {
  control: SonarFormControl;
  updateGate: (key: GateKey, value: number) => void;
  gateFields: { key: GateKey; labelKey: string; max?: number }[];
}) {
  const { t } = useTranslation();
  const { form, update } = control;

  return (
    <SectionCard
      eyebrow="04"
      title={t('SONARQUBE_CONFIG.QUALITY_GATES')}
      description={t('SONARQUBE_CONFIG.QUALITY_GATES_HINT')}
    >
      <div className="rounded-lg border border-border bg-surface-2/40 px-4 py-3.5">
        <Switch
          id="qgFailOnError"
          checked={form.qgFailOnError}
          onChange={(checked) => update({ qgFailOnError: checked })}
          label={t('SONARQUBE_CONFIG.FAIL_ON_ERROR')}
          description={form.qgFailOnError ? undefined : t('SONARQUBE_CONFIG.GATE_HINT')}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {gateFields.map((field) => (
          <FormField key={field.key} id={field.key} label={t(field.labelKey)}>
            <input
              id={field.key}
              type="number"
              min={0}
              max={field.max}
              className={FIELD_INPUT_CLASS}
              value={form[field.key]}
              onFocus={(event) => event.target.select()}
              onChange={(event) =>
                updateGate(field.key, readNumber(event.target.value, field.max))
              }
            />
          </FormField>
        ))}
      </div>
    </SectionCard>
  );
}
