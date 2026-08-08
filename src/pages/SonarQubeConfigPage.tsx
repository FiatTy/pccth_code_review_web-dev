import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Plug,
  PlugZap,
  TriangleAlert,
  Unplug,
  type LucideIcon,
} from 'lucide-react';
import { SonarServerSection } from '@/features/setting/components/SonarServerSection';
import { SonarScannerSection } from '@/features/setting/components/SonarScannerSection';
import { SonarQualityGateSection } from '@/features/setting/components/SonarQualityGateSection';
import { SonarConnectionPanel } from '@/features/setting/components/SonarConnectionPanel';
import type { SonarFormControl } from '@/features/setting/components/sonar-form-control';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/lib/toast/toast-context';
import {
  useSonarQubeConfig,
  useUpdateSonarQubeConfig,
} from '@/features/setting/hooks/useSonarQubeConfig';
import { useTestSonarConnection } from '@/features/setting/hooks/useTestSonarConnection';
import {
  DEFAULT_FORM,
  toFormState,
  toPayload,
  TOKEN_MIN_LENGTH,
  trimForm,
  URL_PATTERN,
  type GateKey,
  type SonarQubeFormState,
} from '@/features/setting/lib/sonar-form';

type ConnectionState = 'unknown' | 'connected' | 'failed';

const CONNECTION_META: Record<
  ConnectionState,
  { icon: LucideIcon; chip: string; badge: string; labelKey: string }
> = {
  unknown: {
    icon: Plug,
    chip: 'border-border bg-surface-2 text-muted',
    badge: 'bg-surface-2 text-muted',
    labelKey: 'SONARQUBE_CONFIG.CONNECTION_UNKNOWN',
  },
  connected: {
    icon: PlugZap,
    chip: 'border-success/30 bg-success/12 text-success',
    badge: 'bg-success/12 text-success',
    labelKey: 'SONARQUBE_CONFIG.CONNECTION_OK',
  },
  failed: {
    icon: Unplug,
    chip: 'border-danger/30 bg-danger/12 text-danger',
    badge: 'bg-danger/12 text-danger',
    labelKey: 'SONARQUBE_CONFIG.CONNECTION_FAILED',
  },
};

function readErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || fallback;
  }
  return fallback;
}

export function SonarQubeConfigPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const configQuery = useSonarQubeConfig();
  const updateConfig = useUpdateSonarQubeConfig();
  const testConnection = useTestSonarConnection();

  const [form, setForm] = useState<SonarQubeFormState>(DEFAULT_FORM);
  const [savedForm, setSavedForm] = useState<SonarQubeFormState>(DEFAULT_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showToken, setShowToken] = useState(false);
  const [showGitToken, setShowGitToken] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('unknown');
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || !configQuery.data) {
      return;
    }
    hydrated.current = true;
    const next = toFormState(configQuery.data);
    setForm(next);
    setSavedForm(next);
  }, [configQuery.data]);

  const errors = useMemo(() => {
    const serverUrl = form.serverUrl.trim();
    const authToken = form.authToken.trim();
    const gitAccessToken = form.gitAccessToken.trim();
    return {
      serverUrl: !serverUrl
        ? t('SONARQUBE_CONFIG.URL_REQUIRED')
        : !URL_PATTERN.test(serverUrl)
          ? t('SONARQUBE_CONFIG.URL_INVALID')
          : '',
      authToken: !authToken
        ? t('SONARQUBE_CONFIG.AUTH_TOKEN_REQUIRED')
        : authToken.length < TOKEN_MIN_LENGTH
          ? t('SONARQUBE_CONFIG.TOKEN_MIN_LENGTH')
          : '',
      gitAccessToken: !gitAccessToken
        ? t('SONARQUBE_CONFIG.GIT_TOKEN_REQUIRED')
        : gitAccessToken.length < TOKEN_MIN_LENGTH
          ? t('SONARQUBE_CONFIG.TOKEN_MIN_LENGTH')
          : '',
    };
  }, [form.serverUrl, form.authToken, form.gitAccessToken, t]);

  const isValid = !errors.serverUrl && !errors.authToken && !errors.gitAccessToken;
  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  const isSaving = updateConfig.isPending;
  const isTesting = testConnection.isPending;

  function update(patch: Partial<SonarQubeFormState>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  const formControl: SonarFormControl = { form, errors, touched, update, markTouched };

  function markTouched(field: string) {
    setTouched((current) => ({ ...current, [field]: true }));
    setForm((current) => trimForm(current));
  }

  function updateGate(key: GateKey, value: number) {
    setForm((current) => {
      const next = { ...current };
      next[key] = value;
      return next;
    });
  }

  async function runConnectionTest(values: SonarQubeFormState): Promise<boolean> {
    if (!values.serverUrl) {
      showToast({
        tone: 'warning',
        title: t('SONARQUBE_CONFIG.SWAL.MISSING_URL_TITLE'),
        description: t('SONARQUBE_CONFIG.SWAL.MISSING_URL_TEXT'),
      });
      return false;
    }
    if (!values.authToken) {
      showToast({
        tone: 'warning',
        title: t('SONARQUBE_CONFIG.SWAL.MISSING_TOKEN_TITLE'),
        description: t('SONARQUBE_CONFIG.SWAL.MISSING_TOKEN_TEXT'),
      });
      return false;
    }

    try {
      const response = await testConnection.mutateAsync({
        sonarHostUrl: values.serverUrl,
        sonarToken: values.authToken,
      });
      if (response.connected) {
        setConnectionState('connected');
        showToast({
          tone: 'success',
          title: t('SONARQUBE_CONFIG.SWAL.CONN_SUCCESS_TITLE'),
          description: t('SONARQUBE_CONFIG.SWAL.CONN_SUCCESS_TEXT'),
        });
        return true;
      }
      setConnectionState('failed');
      showToast({
        tone: 'error',
        title: t('SONARQUBE_CONFIG.SWAL.CONN_FAILED_TITLE'),
        description: t('SONARQUBE_CONFIG.SWAL.CONN_FAILED_TEXT'),
      });
      return false;
    } catch (error) {
      setConnectionState('failed');
      showToast({
        tone: 'error',
        title: t('SONARQUBE_CONFIG.SWAL.CONN_FAILED_TITLE'),
        description: readErrorMessage(error, t('SONARQUBE_CONFIG.SWAL.CONN_FAILED_TEXT')),
      });
      return false;
    }
  }

  async function handleTestConnection() {
    const trimmed = trimForm(form);
    setForm(trimmed);
    await runConnectionTest(trimmed);
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setTouched({});
    setConnectionState('unknown');
    showToast({
      tone: 'info',
      title: t('SONARQUBE_CONFIG.SWAL.RESET_TITLE'),
      description: t('SONARQUBE_CONFIG.SWAL.RESET_TEXT'),
    });
  }

  async function handleSave() {
    const trimmed = trimForm(form);
    setForm(trimmed);
    setTouched({ serverUrl: true, authToken: true, gitAccessToken: true });

    const connected = await runConnectionTest(trimmed);
    if (!connected || !user?.id) {
      return;
    }

    try {
      await updateConfig.mutateAsync(toPayload(trimmed, user.id));
      setSavedForm(trimmed);
      showToast({
        tone: 'success',
        title: t('SONARQUBE_CONFIG.SWAL.SAVE_SUCCESS_TITLE'),
        description: t('SONARQUBE_CONFIG.SWAL.SAVE_SUCCESS_TEXT'),
      });
    } catch (error) {
      showToast({
        tone: 'error',
        title: t('SONARQUBE_CONFIG.SWAL.SAVE_FAILED_TITLE'),
        description: readErrorMessage(error, t('SONARQUBE_CONFIG.SWAL.SAVE_FAILED_TEXT')),
      });
    }
  }

  const connectionMeta = CONNECTION_META[connectionState];
  const ConnectionIcon = connectionMeta.icon;

  const gateFields: { key: GateKey; labelKey: string; max?: number }[] = [
    {
      key: 'qgCoverageThreshold',
      labelKey: 'SONARQUBE_CONFIG.COVERAGE_THRESHOLD',
      max: 100,
    },
    { key: 'qgMaxBugs', labelKey: 'SONARQUBE_CONFIG.MAX_BUGS' },
    {
      key: 'qgMaxVulnerabilities',
      labelKey: 'SONARQUBE_CONFIG.MAX_VULNERABILITIES',
    },
    { key: 'qgMaxCodeSmells', labelKey: 'SONARQUBE_CONFIG.MAX_CODE_SMELLS' },
    { key: 'qgMaxDuplications', labelKey: 'SONARQUBE_CONFIG.MAX_DUPLICATIONS' },
    {
      key: 'qgMaxSecurityHotspots',
      labelKey: 'SONARQUBE_CONFIG.MAX_SECURITY_HOTSPOTS',
    },
  ];

  if (configQuery.isLoading) {
    return (
      <div>
        <PageHeader title={t('SONARQUBE_CONFIG.TITLE')} subtitle={t('SONARQUBE_CONFIG.SUBTITLE')} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {[220, 260, 200].map((height) => (
              <div
                key={height}
                className="animate-pulse rounded-xl border border-border bg-surface"
                style={{ height }}
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('SONARQUBE_CONFIG.TITLE')}
        subtitle={t('SONARQUBE_CONFIG.SUBTITLE')}
        actions={
          <span
            className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium ${connectionMeta.chip}`}
          >
            <ConnectionIcon size={14} />
            {t(connectionMeta.labelKey)}
          </span>
        }
      />

      {configQuery.isError ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          <p>{t('SONARQUBE_CONFIG.LOAD_ERROR')}</p>
        </div>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SonarServerSection
            control={formControl}
            showToken={showToken}
            setShowToken={setShowToken}
            showGitToken={showGitToken}
            setShowGitToken={setShowGitToken}
          />

          <SonarScannerSection control={formControl} />

          <SonarQualityGateSection
            control={formControl}
            updateGate={updateGate}
            gateFields={gateFields}
          />
        </div>

        <SonarConnectionPanel
          connectionMeta={connectionMeta}
          ConnectionIcon={ConnectionIcon}
          isTesting={isTesting}
          handleTestConnection={() => void handleTestConnection()}
          form={form}
          isSaving={isSaving}
          isValid={isValid}
          isDirty={isDirty}
          handleReset={handleReset}
          handleSave={() => void handleSave()}
        />
      </div>
    </div>
  );
}
