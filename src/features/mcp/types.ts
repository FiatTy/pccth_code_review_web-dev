export interface McpClient {
  clientId: string;
  clientName: string;
  redirectUris: string[];
  scopes: string[];
  disabled: boolean;
  selfRegistered: boolean;
  registeredAt: string;
  lastUsedAt: string | null;
}

export interface McpClientRequest {
  clientName: string;
  redirectUris: string[];
  scopes: string[];
}

export interface McpClientCreated {
  clientId: string;
  clientSecret: string;
  notice: string;
}

export interface McpAccessGrant {
  id: string;
  clientId: string;
  clientName: string;
  principalName: string;
  lastUsedAt: string | null;
  accessTokenExpiresAt: string | null;
  accessUntil: string | null;
}

export interface McpCutOff {
  outcome: string;
  takesEffect: string;
}
