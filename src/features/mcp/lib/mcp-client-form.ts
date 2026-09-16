import type { McpClientRequest } from '@/features/mcp/types';

export const MCP_SCOPES = ['codereview:read', 'codereview:source'] as const;

const LOOPBACK_HOSTS = new Set(['127.0.0.1', '[::1]', 'localhost']);

export interface ClientDraft {
  clientName: string;
  redirectUris: string;
  scopes: string[];
}

export interface DraftErrors {
  clientName?: string;
  redirectUris?: string;
  scopes?: string;
}

export function emptyDraft(): ClientDraft {
  return { clientName: '', redirectUris: '', scopes: ['codereview:read'] };
}

export function parseRedirectUris(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function isSupportedRedirectUri(value: string): boolean {
  let address: URL;
  try {
    address = new URL(value);
  } catch {
    return false;
  }

  if (address.protocol === 'https:') {
    return true;
  }
  if (address.protocol === 'http:') {
    return LOOPBACK_HOSTS.has(address.hostname);
  }
  return address.protocol.includes('.');
}

export function validateDraft(draft: ClientDraft): DraftErrors {
  const errors: DraftErrors = {};
  const addresses = parseRedirectUris(draft.redirectUris);

  if (!draft.clientName.trim()) {
    errors.clientName = 'MCP.NAME_REQUIRED';
  }
  if (addresses.length === 0) {
    errors.redirectUris = 'MCP.REDIRECT_REQUIRED';
  } else if (!addresses.every(isSupportedRedirectUri)) {
    errors.redirectUris = 'MCP.REDIRECT_UNSUPPORTED';
  }
  if (draft.scopes.length === 0) {
    errors.scopes = 'MCP.SCOPE_REQUIRED';
  }

  return errors;
}

export function hasErrors(errors: DraftErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function toRequest(draft: ClientDraft): McpClientRequest {
  return {
    clientName: draft.clientName.trim(),
    redirectUris: parseRedirectUris(draft.redirectUris),
    scopes: draft.scopes,
  };
}
