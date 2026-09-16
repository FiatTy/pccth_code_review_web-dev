import { useQuery } from '@tanstack/react-query';
import { fetchConsentInfo } from '@/features/auth/api/oauth.api';

export function useConsentInfo(clientId: string, scope: string) {
  return useQuery({
    queryKey: ['oauth-consent', clientId, scope],
    queryFn: () => fetchConsentInfo(clientId, scope),
    enabled: clientId.length > 0,
    retry: false,
  });
}
