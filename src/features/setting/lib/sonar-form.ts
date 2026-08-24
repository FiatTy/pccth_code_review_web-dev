import type { BuildTool, SonarQubeConfig, SonarQubeConfigPayload } from '@/features/setting/types';

export type GateKey =
  | 'qgCoverageThreshold'
  | 'qgMaxBugs'
  | 'qgMaxVulnerabilities'
  | 'qgMaxCodeSmells'
  | 'qgMaxDuplications'
  | 'qgMaxSecurityHotspots';

export interface SonarQubeFormState {
  serverUrl: string;
  authToken: string;
  organization: string;
  gitAccessToken: string;
  gitTokenEnabled: boolean;
  angularRunNpm: boolean;
  angularCoverage: boolean;
  angularTsFiles: boolean;
  angularExclusions: string;
  springRunTests: boolean;
  springJacoco: boolean;
  springBuildTool: BuildTool;
  springJdkVersion: number;
  qgFailOnError: boolean;
  qgCoverageThreshold: number;
  qgMaxBugs: number;
  qgMaxVulnerabilities: number;
  qgMaxCodeSmells: number;
  qgMaxDuplications: number;
  qgMaxSecurityHotspots: number;
}

export const DEFAULT_EXCLUSIONS = '**/node_modules/**,**/dist/**,**/*.spec.ts';
export const JDK_VERSIONS = [8, 11, 17, 21, 25];
export const TOKEN_MIN_LENGTH = 10;
export const URL_PATTERN = /^https?:\/\/.+/;

export const BUILD_TOOLS: { value: BuildTool; labelKey: string }[] = [
  { value: 'maven', labelKey: 'SONARQUBE_CONFIG.MAVEN' },
  { value: 'gradle', labelKey: 'SONARQUBE_CONFIG.GRADLE' },
];

export const DEFAULT_FORM: SonarQubeFormState = {
  serverUrl: '',
  authToken: '',
  organization: '',
  gitAccessToken: '',
  gitTokenEnabled: false,
  angularRunNpm: false,
  angularCoverage: false,
  angularTsFiles: false,
  angularExclusions: DEFAULT_EXCLUSIONS,
  springRunTests: false,
  springJacoco: false,
  springBuildTool: 'maven',
  springJdkVersion: 21,
  qgFailOnError: false,
  qgCoverageThreshold: 0,
  qgMaxBugs: 0,
  qgMaxVulnerabilities: 0,
  qgMaxCodeSmells: 0,
  qgMaxDuplications: 0,
  qgMaxSecurityHotspots: 0,
};

export function toFormState(config: SonarQubeConfig): SonarQubeFormState {
  return {
    serverUrl: config.serverUrl || '',
    authToken: config.authToken || '',
    organization: config.organization || '',
    gitAccessToken: config.gitAccessToken || '',
    gitTokenEnabled: Boolean(config.gitTokenEnabled),
    angularRunNpm: Boolean(config.angularRunNpm),
    angularCoverage: Boolean(config.angularCoverage),
    angularTsFiles: Boolean(config.angularTsFiles),
    angularExclusions: config.angularExclusions || DEFAULT_EXCLUSIONS,
    springRunTests: Boolean(config.springRunTests),
    springJacoco: Boolean(config.springJacoco),
    springBuildTool: config.springBuildTool === 'gradle' ? 'gradle' : 'maven',
    springJdkVersion: config.springJdkVersion || 21,
    qgFailOnError: Boolean(config.qgFailOnError),
    qgCoverageThreshold: config.qgCoverageThreshold ?? 0,
    qgMaxBugs: config.qgMaxBugs ?? 0,
    qgMaxVulnerabilities: config.qgMaxVulnerabilities ?? 0,
    qgMaxCodeSmells: config.qgMaxCodeSmells ?? 0,
    qgMaxDuplications: config.qgMaxDuplications ?? 0,
    qgMaxSecurityHotspots: config.qgMaxSecurityHotspots ?? 0,
  };
}

export function isGitTokenValid(value: string, enabled: boolean = true): boolean {
  return !enabled || value.trim().length >= TOKEN_MIN_LENGTH;
}

export function trimForm(form: SonarQubeFormState): SonarQubeFormState {
  return {
    ...form,
    serverUrl: form.serverUrl.trim(),
    authToken: form.authToken.trim(),
    organization: form.organization.trim(),
    gitAccessToken: form.gitAccessToken.trim(),
    angularExclusions: form.angularExclusions.trim(),
  };
}

export function toPayload(form: SonarQubeFormState, userId: string): SonarQubeConfigPayload {
  return { ...form, userId };
}

export function readNumber(value: string, max?: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  const floored = Math.max(0, Math.round(parsed));
  return max === undefined ? floored : Math.min(max, floored);
}
