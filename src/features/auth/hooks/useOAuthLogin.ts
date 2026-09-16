import { useMutation } from '@tanstack/react-query';
import { oauthLogin } from '@/features/auth/api/oauth.api';
import type { OAuthLoginResponse } from '@/features/auth/types';
import type { LoginRequest } from '@/types/user';

export function useOAuthLogin() {
  return useMutation<OAuthLoginResponse, unknown, LoginRequest>({
    mutationFn: oauthLogin,
  });
}
