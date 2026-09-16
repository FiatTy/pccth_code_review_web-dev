import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMcpClient,
  deleteMcpClient,
  disableMcpClient,
  enableMcpClient,
  getMcpClients,
  updateMcpClient,
} from '@/features/mcp/api/mcp-client.api';
import type {
  McpClient,
  McpClientCreated,
  McpClientRequest,
  McpCutOff,
} from '@/features/mcp/types';

export const mcpClientsQueryKey = ['mcp', 'clients'] as const;
export const mcpAccessQueryKey = ['mcp', 'access'] as const;

export function useMcpClients() {
  return useQuery<McpClient[]>({
    queryKey: mcpClientsQueryKey,
    queryFn: getMcpClients,
  });
}

export function useCreateMcpClient() {
  const queryClient = useQueryClient();

  return useMutation<McpClientCreated, unknown, McpClientRequest>({
    mutationFn: createMcpClient,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: mcpClientsQueryKey }),
  });
}

export function useUpdateMcpClient() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    unknown,
    { clientId: string; payload: McpClientRequest }
  >({
    mutationFn: ({ clientId, payload }) => updateMcpClient(clientId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: mcpClientsQueryKey }),
  });
}

export function useSetMcpClientDisabled() {
  const queryClient = useQueryClient();

  return useMutation<
    McpCutOff,
    unknown,
    { clientId: string; disabled: boolean }
  >({
    mutationFn: ({ clientId, disabled }) =>
      disabled ? disableMcpClient(clientId) : enableMcpClient(clientId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: mcpClientsQueryKey }),
  });
}

export function useDeleteMcpClient() {
  const queryClient = useQueryClient();

  return useMutation<McpCutOff, unknown, string>({
    mutationFn: deleteMcpClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mcpClientsQueryKey });
      queryClient.invalidateQueries({ queryKey: mcpAccessQueryKey });
    },
  });
}
