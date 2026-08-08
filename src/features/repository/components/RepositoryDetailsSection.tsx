import { useTranslation } from 'react-i18next';
import { FolderGit2, Link2, Tag, Wallet } from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';
import { SelectField } from '@/components/common/SelectField';
import type { ParsedGitUrl } from '@/lib/git-utils';
import type { ProjectType } from '@/features/repository/types';

export interface RepositoryFormValues {
  name: string;
  repositoryUrl: string;
  projectType: ProjectType | '';
  costPerDay: number;
}

export function RepositoryDetailsSection({
  form,
  errors,
  touched,
  update,
  markTouched,
  handleUrlChange,
  parsedGit,
  isEditMode,
  PROJECT_TYPES,
  MIN_COST_PER_DAY,
}: {
  form: RepositoryFormValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  update: (patch: Partial<RepositoryFormValues>) => void;
  markTouched: (field: string) => void;
  handleUrlChange: (url: string) => void;
  parsedGit: ParsedGitUrl;
  isEditMode: boolean;
  PROJECT_TYPES: { value: ProjectType; label: string }[];
  MIN_COST_PER_DAY: number;
}) {
  const { t } = useTranslation();

  return (
    <SectionCard eyebrow="01" title={t('REPOSITORY.PROJECT_DETAILS')}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="name"
          label={t('REPOSITORY.REPOSITORY_NAME')}
          error={touched.name ? errors.name : ''}
        >
          <div className="relative">
            <Tag
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              id="name"
              type="text"
              className={`${FIELD_INPUT_CLASS} pl-9`}
              placeholder="my-service"
              value={form.name}
              onChange={(event) => update({ name: event.target.value })}
              onBlur={() => markTouched('name')}
            />
          </div>
        </FormField>

        <FormField
          id="projectType"
          label={t('REPOSITORY.PROJECT_TYPE')}
          error={touched.projectType ? errors.projectType : ''}
        >
          <SelectField
            id="projectType"
            className={FIELD_INPUT_CLASS}
            disabled={isEditMode}
            value={form.projectType}
            onChange={(next) => {
              update({ projectType: next as ProjectType });
              markTouched('projectType');
            }}
            placeholder={t('REPOSITORY.SELECT_FRAMEWORK')}
            options={PROJECT_TYPES.map((type) => ({
              value: type.value,
              label: type.label,
            }))}
          />
        </FormField>

        <FormField
          id="costPerDay"
          label={t('REPOSITORY.COST_PER_DAY')}
          error={touched.costPerDay ? errors.costPerDay : ''}
          hint={t('REPOSITORY.COST_MIN')}
        >
          <div className="relative">
            <Wallet
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              id="costPerDay"
              type="number"
              min={MIN_COST_PER_DAY}
              className={`${FIELD_INPUT_CLASS} pl-9`}
              value={form.costPerDay}
              onFocus={(event) => event.target.select()}
              onChange={(event) => update({ costPerDay: Number(event.target.value) || 0 })}
              onBlur={() => markTouched('costPerDay')}
            />
          </div>
        </FormField>

        <div className="sm:col-span-2">
          <FormField
            id="repositoryUrl"
            label={t('REPOSITORY.GIT_URL')}
            error={touched.repositoryUrl ? errors.repositoryUrl : ''}
          >
            <div className="relative">
              <Link2
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
              />
              <input
                id="repositoryUrl"
                type="url"
                className={`${FIELD_INPUT_CLASS} pl-9 font-mono text-xs`}
                placeholder="https://gitlab.com/team/project.git"
                disabled={isEditMode}
                value={form.repositoryUrl}
                onChange={(event) => handleUrlChange(event.target.value)}
                onBlur={() => markTouched('repositoryUrl')}
              />
            </div>
            {form.repositoryUrl && parsedGit.projectName ? (
              <div className="mt-3.5 rounded-lg border border-primary/20 bg-primary-subtle/40 p-3 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-primary">
                  <FolderGit2 size={14} />
                  <span>{t('REPOSITORY.EXTRACTED_INFO')}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-fg">
                  <div>
                    <span className="text-muted">{t('REPOSITORY.EXTRACTED_FOLDER')} </span>
                    <span className="font-mono font-medium text-primary">{parsedGit.folder}</span>
                  </div>
                  <div>
                    <span className="text-muted">{t('REPOSITORY.EXTRACTED_PROJECT')} </span>
                    <span className="font-mono font-medium text-fg">{parsedGit.projectName}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </FormField>
        </div>
      </div>
    </SectionCard>
  );
}
