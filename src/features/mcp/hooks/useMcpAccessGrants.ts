import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMcpAccessGrants,
  withdrawAccessGrant,
  withdrawEveryGrantOf,
} from '@/features/mcp/api/mcp-client.api';
import {
  mcpAccessQueryKey,
  mcpClientsQueryKey,
} from '@/features/mcp/hooks/useMcpClients';
import type { McpAccessGrant, McpCutOff } from '@/features/mcp/types';

const REFETCH_INTERVAL_MS = 60_000;

export function useMcpAccessGrants() {
  return useQuery<McpAccessGrant[]>({
    queryKey: mcpAccessQueryKey,
    queryFn: getMcpAccessGrants,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}

function refreshBothLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: mcpAccessQueryKey });
  queryClient.invalidateQueries({ queryKey: mcpClientsQueryKey });
}

export function useWithdrawAccess() {
  const queryClient = useQueryClient();

  return useMutation<McpCutOff, unknown, string>({
    mutationFn: withdrawAccessGrant,
    onSuccess: () => refreshBothLists(queryClient),
  });
}

export function useWithdrawEveryGrantOf() {
  const queryClient = useQueryClient();

  return useMutation<McpCutOff, unknown, string>({
    mutationFn: withdrawEveryGrantOf,
    onSuccess: () => refreshBothLists(queryClient),
  });
}
