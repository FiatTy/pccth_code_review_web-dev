import { apiClient } from '@/lib/api-client';
import type {
  McpAccessGrant,
  McpClient,
  McpClientCreated,
  McpClientRequest,
  McpCutOff,
} from '@/features/mcp/types';

const CLIENTS = '/api/mcp/clients';

function at(clientId: string): string {
  return `${CLIENTS}/${encodeURIComponent(clientId)}`;
}

export async function getMcpClients(): Promise<McpClient[]> {
  const { data } = await apiClient.get<McpClient[]>(CLIENTS);
  return Array.isArray(data) ? data : [];
}

export async function createMcpClient(
  payload: McpClientRequest,
): Promise<McpClientCreated> {
  const { data } = await apiClient.post<McpClientCreated>(CLIENTS, payload);
  return data;
}

export async function updateMcpClient(
  clientId: string,
  payload: McpClientRequest,
): Promise<void> {
  await apiClient.put(at(clientId), payload);
}

export async function disableMcpClient(clientId: string): Promise<McpCutOff> {
  const { data } = await apiClient.put<McpCutOff>(`${at(clientId)}/disabled`);
  return data;
}

export async function enableMcpClient(clientId: string): Promise<McpCutOff> {
  const { data } = await apiClient.delete<McpCutOff>(
    `${at(clientId)}/disabled`,
  );
  return data;
}

export async function deleteMcpClient(clientId: string): Promise<McpCutOff> {
  const { data } = await apiClient.delete<McpCutOff>(at(clientId));
  return data;
}

export async function getMcpAccessGrants(): Promise<McpAccessGrant[]> {
  const { data } = await apiClient.get<McpAccessGrant[]>(`${CLIENTS}/access`);
  return Array.isArray(data) ? data : [];
}

export async function withdrawAccessGrant(grantId: string): Promise<McpCutOff> {
  const { data } = await apiClient.delete<McpCutOff>(
    `${CLIENTS}/access/${encodeURIComponent(grantId)}`,
  );
  return data;
}

export async function withdrawEveryGrantOf(
  principalName: string,
): Promise<McpCutOff> {
  const { data } = await apiClient.delete<McpCutOff>(`${CLIENTS}/access`, {
    params: { principal: principalName },
  });
  return data;
}
