import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { RepositorySummaryRow } from '@/features/repository/components/RepositorySummaryRow';
import { RepositoryDetailsSection } from '@/features/repository/components/RepositoryDetailsSection';
import { RepositoryAnalysisSection } from '@/features/repository/components/RepositoryAnalysisSection';
import { MissingScanConfigDialog } from '@/features/repository/components/MissingScanConfigDialog';
import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/lib/toast/toast-context';
import { useRepositories, useDeleteRepository } from '@/features/repository/hooks/useRepositories';
import {
  useRepository,
  useSaveRepository,
  useStartScan,
} from '@/features/repository/hooks/useRepository';
import { useSonarQubeConfig } from '@/features/setting/hooks/useSonarQubeConfig';
import type { ProjectType } from '@/features/repository/types';
import { parseGitUrl } from '@/lib/git-utils';
import { useRepositoryFormTour } from '@/features/onboarding/hooks/useRepositoryFormTour';

const MIN_COST_PER_DAY = 1000;
const SCAN_BRANCH = 'dev';

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'ANGULAR', label: 'Angular' },
  { value: 'SPRING_BOOT', label: 'Spring Boot' },
];

interface RepositoryFormState {
  name: string;
  repositoryUrl: string;
  projectType: ProjectType | '';
  costPerDay: number;
}

const DEFAULT_FORM: RepositoryFormState = {
  name: '',
  repositoryUrl: '',
  projectType: '',
  costPerDay: MIN_COST_PER_DAY,
};

function readErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; detail?: string } | string | undefined;
    if (typeof data === 'string' && data) {
      return data;
    }
    if (data && typeof data === 'object') {
      return data.message || data.detail || error.message || fallback;
    }
    return error.message || fallback;
  }
  return fallback;
}

export function RepositoryFormPage() {
  useRepositoryFormTour();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { showToast } = useToast();

  const isEditMode = Boolean(projectId);
  const repositoryQuery = useRepository(projectId);
  const repositoriesQuery = useRepositories();
  const configQuery = useSonarQubeConfig();
  const saveRepository = useSaveRepository();
  const startScan = useStartScan();
  const deleteRepository = useDeleteRepository();

  const [form, setForm] = useState<RepositoryFormState>(DEFAULT_FORM);
  const [savedProjectKey, setSavedProjectKey] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showMissingConfig, setShowMissingConfig] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || !repositoryQuery.data) {
      return;
    }
    hydrated.current = true;
    const repo = repositoryQuery.data;
    setForm({
      name: repo.name || '',
      repositoryUrl: repo.repositoryUrl || '',
      projectType: repo.projectType ?? '',
      costPerDay: repo.costPerDay ?? MIN_COST_PER_DAY,
    });
    setSavedProjectKey(repo.sonarProjectKey || '');
  }, [repositoryQuery.data]);

  const config = configQuery.data;
  const serverUrl = config?.serverUrl ?? '';
  const parsedGit = useMemo(() => parseGitUrl(form.repositoryUrl), [form.repositoryUrl]);
  const projectKey = isEditMode ? savedProjectKey : form.name;

  function handleUrlChange(url: string) {
    const parsed = parseGitUrl(url);
    const patch: Partial<RepositoryFormState> = { repositoryUrl: url };
    if (!isEditMode && parsed.projectName) {
      const currentParsedName = parseGitUrl(form.repositoryUrl).projectName;
      if (!form.name || form.name === currentParsedName) {
        patch.name = parsed.projectName;
      }
    }
    update(patch);
  }

  const duplicateName = useMemo(() => {
    const name = form.name.trim().toLowerCase();
    if (!name) {
      return false;
    }
    return (repositoriesQuery.data ?? []).some(
      (repo) => repo.name.trim().toLowerCase() === name && repo.projectId !== projectId,
    );
  }, [form.name, repositoriesQuery.data, projectId]);

  const errors = {
    name: !form.name.trim()
      ? t('REPOSITORY.NAME_REQUIRED')
      : duplicateName
        ? t('REPOSITORY.DUPLICATE_NAME')
        : '',
    projectType: !form.projectType ? t('REPOSITORY.TYPE_REQUIRED') : '',
    costPerDay: form.costPerDay < MIN_COST_PER_DAY ? t('REPOSITORY.COST_MIN') : '',
    repositoryUrl: !form.repositoryUrl.trim() ? t('REPOSITORY.URL_REQUIRED') : '',
  };

  const isValid =
    !errors.name && !errors.projectType && !errors.costPerDay && !errors.repositoryUrl;
  const isSubmitting = saveRepository.isPending || startScan.isPending;

  function update(patch: Partial<RepositoryFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function markTouched(field: string) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleClear() {
    if (isEditMode) {
      update({ name: '', costPerDay: MIN_COST_PER_DAY });
      return;
    }
    setForm(DEFAULT_FORM);
    setTouched({});
  }

  async function handleSubmit() {
    setTouched({
      name: true,
      projectType: true,
      costPerDay: true,
      repositoryUrl: true,
    });
    if (!isValid) {
      return;
    }

    if (!config?.authToken?.trim() || !config?.serverUrl?.trim()) {
      setShowMissingConfig(true);
      return;
    }

    const payload = {
      name: form.name.trim(),
      url: form.repositoryUrl.trim(),
      type: form.projectType as ProjectType,
      costPerDay: form.costPerDay || MIN_COST_PER_DAY,
    };

    let savedId: string;
    try {
      const saved = await saveRepository.mutateAsync({ projectId, payload });
      savedId = projectId ?? saved.projectId;
      showToast({
        tone: 'success',
        title: t(isEditMode ? 'REPOSITORY.SAVED_UPDATED' : 'REPOSITORY.SAVED_ADDED'),
      });
    } catch (error) {
      showToast({
        tone: 'error',
        title: t('REPOSITORY.SAVE_FAILED'),
        description: readErrorMessage(error, t('COMMON.ERROR')),
      });
      return;
    }

    if (!savedId) {
      navigate(-1);
      return;
    }

    try {
      await startScan.mutateAsync({
        projectId: savedId,
        branch: SCAN_BRANCH,
        config,
        gitToken: config.gitAccessToken,
        serverUrl: config.serverUrl,
      });
    } catch (error) {
      showToast({
        tone: 'error',
        title: t('REPOSITORY.SCAN_START_FAILED'),
        description: readErrorMessage(error, t('COMMON.ERROR')),
      });
    }
    navigate(-1);
  }

  async function confirmDelete() {
    if (!projectId) {
      return;
    }
    try {
      await deleteRepository.mutateAsync(projectId);
      setShowDeleteConfirm(false);
      showToast({
        tone: 'success',
        title: t('REPOSITORY.DELETE_CONFIRM.SUCCESS_TITLE'),
        description: t('REPOSITORY.DELETE_CONFIRM.SUCCESS_TEXT'),
      });
      navigate('/repositories');
    } catch {
      setShowDeleteConfirm(false);
      showToast({
        tone: 'error',
        title: t('REPOSITORY.DELETE_CONFIRM.FAILED_TITLE'),
        description: t('REPOSITORY.DELETE_CONFIRM.FAILED_TEXT'),
      });
    }
  }

  const typeLabel = PROJECT_TYPES.find((type) => type.value === form.projectType)?.label ?? '—';

  return (
    <div>
      <PageHeader
        title={t(
          isEditMode ? 'REPOSITORY.EDIT_REPOSITORY_TITLE' : 'REPOSITORY.NEW_REPOSITORY_TITLE',
        )}
        subtitle={t('REPOSITORY.CONFIGURE_CONN')}
      />

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div id="tour-repo-form-details">
            <RepositoryDetailsSection
              form={form}
              errors={errors}
              touched={touched}
              update={update}
              markTouched={markTouched}
              handleUrlChange={handleUrlChange}
              parsedGit={parsedGit}
              isEditMode={isEditMode}
              PROJECT_TYPES={PROJECT_TYPES}
              MIN_COST_PER_DAY={MIN_COST_PER_DAY}
            />
          </div>

          <div id="tour-repo-form-analysis">
            <RepositoryAnalysisSection projectKey={projectKey} serverUrl={serverUrl} />
          </div>
        </div>

        <aside id="tour-repo-form-summary" className="space-y-4 lg:sticky lg:top-20">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-faint">
              {t('REPOSITORY.SUMMARY')}
            </p>
            <div className="mt-3 divide-y divide-border">
              <RepositorySummaryRow label={t('REPOSITORY.REPOSITORY_NAME')} value={form.name || '—'} />
              <RepositorySummaryRow label={t('REPOSITORY.FOLDER')} value={parsedGit.folder || '—'} mono />
              <RepositorySummaryRow label={t('REPOSITORY.PROJECT_TYPE')} value={typeLabel} />
              <RepositorySummaryRow label={t('REPOSITORY.PROJECT_KEY')} value={projectKey || '—'} mono />
              <RepositorySummaryRow
                label={t('REPOSITORY.COST_PER_DAY')}
                value={form.costPerDay ? form.costPerDay.toLocaleString() : '—'}
              />
            </div>

            <div className="mt-5 space-y-2">
              <button
                id="tour-repo-form-save"
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : isEditMode ? (
                  <Save size={15} />
                ) : (
                  <Plus size={15} />
                )}
                {t(isEditMode ? 'REPOSITORY.SAVE_CHANGES' : 'REPOSITORY.ADD_REPOSITORY')}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t('REPOSITORY.CLEAR')}
              </button>
              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={15} />
                  {t('REPOSITORY.TOOLTIP_DELETE')}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                {t('REPOSITORY.CANCEL')}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showMissingConfig ? (
        <MissingScanConfigDialog
          reason="SONAR"
          onClose={() => setShowMissingConfig(false)}
          onGoToConfig={() => navigate('/sonarqubeconfig')}
        />
      ) : null}

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={t('REPOSITORY.DELETE_CONFIRM.CANCEL')}
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/12 text-danger">
              <Trash2 size={20} />
            </div>
            <h2 className="mt-4 text-base font-semibold text-fg">
              {t('REPOSITORY.DELETE_CONFIRM.TITLE')}
            </h2>
            <p className="mt-1.5 text-sm text-muted">{t('REPOSITORY.DELETE_CONFIRM.TEXT')}</p>
            <p className="mt-2 truncate text-sm font-medium text-fg">{form.name}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
              >
                {t('REPOSITORY.DELETE_CONFIRM.CANCEL')}
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deleteRepository.isPending}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-danger px-4 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:opacity-70"
              >
                {deleteRepository.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  t('REPOSITORY.DELETE_CONFIRM.CONFIRM')
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
