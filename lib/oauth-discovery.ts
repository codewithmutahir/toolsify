import { getClerkFapiOrigin } from "./clerk-origin";

export type OpenIdConfiguration = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  grant_types_supported: string[];
  response_types_supported: string[];
  [key: string]: unknown;
};

export type OAuthAuthorizationServerMetadata = Pick<
  OpenIdConfiguration,
  | "issuer"
  | "authorization_endpoint"
  | "token_endpoint"
  | "jwks_uri"
  | "grant_types_supported"
  | "response_types_supported"
> & {
  token_endpoint_auth_methods_supported?: string[];
  code_challenge_methods_supported?: string[];
};

function buildFallbackOpenIdConfiguration(
  issuer: string
): OpenIdConfiguration {
  return {
    issuer,
    authorization_endpoint: `${issuer}/oauth/authorize`,
    token_endpoint: `${issuer}/oauth/token`,
    revocation_endpoint: `${issuer}/oauth/token/revoke`,
    introspection_endpoint: `${issuer}/oauth/token_info`,
    userinfo_endpoint: `${issuer}/oauth/userinfo`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    scopes_supported: [
      "openid",
      "profile",
      "email",
      "offline_access",
      "public_metadata",
      "private_metadata",
    ],
    response_types_supported: ["code"],
    response_modes_supported: ["query", "form_post"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    token_endpoint_auth_methods_supported: [
      "client_secret_basic",
      "client_secret_post",
      "none",
    ],
    code_challenge_methods_supported: ["S256"],
  };
}

export async function getOpenIdConfiguration(): Promise<OpenIdConfiguration | null> {
  const issuer = getClerkFapiOrigin();
  if (!issuer) return null;

  try {
    const response = await fetch(
      `${issuer}/.well-known/openid-configuration`,
      { next: { revalidate: 86_400 } }
    );

    if (response.ok) {
      return (await response.json()) as OpenIdConfiguration;
    }
  } catch {
    // Fall back to constructed metadata when Clerk is unreachable.
  }

  return buildFallbackOpenIdConfiguration(issuer);
}

export function toOAuthAuthorizationServerMetadata(
  config: OpenIdConfiguration
): OAuthAuthorizationServerMetadata {
  const metadata: OAuthAuthorizationServerMetadata = {
    issuer: config.issuer,
    authorization_endpoint: config.authorization_endpoint,
    token_endpoint: config.token_endpoint,
    jwks_uri: config.jwks_uri,
    grant_types_supported: config.grant_types_supported,
    response_types_supported: config.response_types_supported,
  };

  if (Array.isArray(config.token_endpoint_auth_methods_supported)) {
    metadata.token_endpoint_auth_methods_supported =
      config.token_endpoint_auth_methods_supported;
  }

  if (Array.isArray(config.code_challenge_methods_supported)) {
    metadata.code_challenge_methods_supported =
      config.code_challenge_methods_supported;
  }

  return metadata;
}
