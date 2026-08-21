import { useMutation, useQuery } from '@tanstack/react-query';
import { getGitAuthorizeUrl, getGitIdentity } from '@/features/setting/api/setting.api';
import type { GitIdentityStatus, GitProvider } from '@/features/setting/types';

export function gitIdentityQueryKey(provider: GitProvider) {
  return ['git-identity', provider] as const;
}

export function useGitIdentity(provider: GitProvider) {
  return useQuery<GitIdentityStatus>({
    queryKey: gitIdentityQueryKey(provider),
    queryFn: () => getGitIdentity(provider),
    retry: false,
  });
}

export function useConnectGitProvider(provider: GitProvider) {
  return useMutation<string>({
    mutationFn: () => getGitAuthorizeUrl(provider),
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}
