import { apiClient } from '@/lib/api-client';
import { API_BASE } from '@/config/env';
import type { LoginRequest } from '@/types/user';
import type { OAuthConsentInfo, OAuthLoginResponse } from '@/features/auth/types';

export const OAUTH_AUTHORIZE_URL = `${API_BASE}/oauth2/authorize`;

export async function oauthLogin(payload: LoginRequest): Promise<OAuthLoginResponse> {
  const form = new URLSearchParams({ username: payload.email, password: payload.password });
  const response = await apiClient.post<OAuthLoginResponse>('/oauth/login', form);
  return response.data;
}

export async function fetchConsentInfo(clientId: string, scope: string): Promise<OAuthConsentInfo> {
  const response = await apiClient.get<OAuthConsentInfo>('/oauth/consent', {
    params: { client_id: clientId, scope },
  });
  return response.data;
}

export async function oauthLogout(): Promise<void> {
  await apiClient.post('/oauth/logout');
}
