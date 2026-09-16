export interface OAuthLoginResponse {
  redirectTo: string;
}

export interface OAuthConsentInfo {
  clientName: string;
  principalName: string;
  scopesToApprove: string[];
  previouslyApprovedScopes: string[];
}
