export interface ConsentParams {
  clientId: string;
  scope: string;
  state: string;
}

const SCOPE_LABEL_KEYS: Record<string, string> = {
  'codereview:read': 'OAUTH.SCOPE_READ',
  'codereview:source': 'OAUTH.SCOPE_SOURCE',
};

export function scopeLabelKey(scope: string): string {
  return SCOPE_LABEL_KEYS[scope] ?? 'OAUTH.SCOPE_UNKNOWN';
}

export function readConsentParams(params: URLSearchParams): ConsentParams | null {
  const clientId = params.get('client_id')?.trim() ?? '';
  const scope = params.get('scope')?.trim() ?? '';
  const state = params.get('state')?.trim() ?? '';
  if (!clientId || !scope || !state) {
    return null;
  }
  return { clientId, scope, state };
}
