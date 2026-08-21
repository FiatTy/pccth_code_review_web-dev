import { apiClient } from '@/lib/api-client';
import type {
  GitIdentityStatus,
  GitProvider,
  NotificationSettings,
  NotificationSettingsPayload,
  SonarQubeConfig,
  SonarQubeConfigPayload,
  TestConnectionRequest,
  TestConnectionResponse,
} from '@/features/setting/types';

export async function getNotificationSettings(userId: string): Promise<NotificationSettings> {
  const { data } = await apiClient.get<NotificationSettings>(`/settings/notification/${userId}`);
  return data;
}

export async function updateNotificationSettings(
  payload: NotificationSettingsPayload,
): Promise<NotificationSettings> {
  const { data } = await apiClient.put<NotificationSettings>('/settings/notification', payload);
  return data;
}

export async function getSonarQubeConfig(userId: string): Promise<SonarQubeConfig> {
  const { data } = await apiClient.get<SonarQubeConfig>(`/settings/sonarqube/${userId}`);
  return data;
}

export async function updateSonarQubeConfig(
  payload: SonarQubeConfigPayload,
): Promise<SonarQubeConfig> {
  const { data } = await apiClient.put<SonarQubeConfig>('/settings/sonarqube', payload);
  return data;
}

export async function testSonarConnection(
  request: TestConnectionRequest,
): Promise<TestConnectionResponse> {
  const { data } = await apiClient.post<TestConnectionResponse>('/sonar/test-connect', request);
  return data;
}

export async function getGitIdentity(provider: GitProvider): Promise<GitIdentityStatus> {
  const { data } = await apiClient.get<GitIdentityStatus>(`/api/git-identities/${provider}`);
  return data;
}

export async function getGitAuthorizeUrl(provider: GitProvider): Promise<string> {
  const { data } = await apiClient.get<{ url: string }>(
    `/api/git-identities/${provider}/authorize-url`,
  );
  return data.url;
}
