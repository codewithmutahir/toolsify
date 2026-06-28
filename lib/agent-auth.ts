import { SITE_URL } from "@/lib/config";

export const AGENT_AUTH_SKILL_URL = `${SITE_URL}/auth.md`;
export const OAUTH_PROTECTED_RESOURCE_URL = `${SITE_URL}/.well-known/oauth-protected-resource`;
export const OAUTH_AUTHORIZATION_SERVER_URL = `${SITE_URL}/.well-known/oauth-authorization-server`;

export const AGENT_SCOPES = [
  "profile.read",
  "favorites.read",
  "favorites.write",
  "history.read",
] as const;

export const AGENT_REGISTER_URI = `${SITE_URL}/api/agent/auth`;
export const AGENT_CLAIM_URI = `${SITE_URL}/api/agent/auth/claim`;
export const AGENT_TOKEN_URI = `${SITE_URL}/api/agent/oauth/token`;
export const AGENT_REVOKE_URI = `${SITE_URL}/api/agent/oauth/revoke`;

const REVOCATION_EVENT =
  "https://schemas.workos.com/events/agent/auth/identity/assertion/revoked";

export function buildProtectedResourceMetadata() {
  return {
    resource: SITE_URL,
    resource_name: "Toolsify",
    resource_documentation: `${SITE_URL}/llms.txt`,
    authorization_servers: [SITE_URL],
    scopes_supported: [...AGENT_SCOPES],
    bearer_methods_supported: ["header"],
  };
}

export function buildAuthorizationServerMetadata() {
  const prm = buildProtectedResourceMetadata();

  return {
    ...prm,
    issuer: SITE_URL,
    token_endpoint: AGENT_TOKEN_URI,
    revocation_endpoint: AGENT_REVOKE_URI,
    grant_types_supported: [
      "urn:ietf:params:oauth:grant-type:jwt-bearer",
      "urn:workos:agent-auth:grant-type:claim",
    ],
    agent_auth: {
      skill: AGENT_AUTH_SKILL_URL,
      register_uri: AGENT_REGISTER_URI,
      identity_endpoint: AGENT_REGISTER_URI,
      claim_uri: AGENT_CLAIM_URI,
      claim_endpoint: AGENT_CLAIM_URI,
      revocation_uri: AGENT_REVOKE_URI,
      identity_types_supported: [
        "anonymous",
        "identity_assertion",
        "service_auth",
      ],
      identity_assertion: {
        assertion_types_supported: [
          "urn:ietf:params:oauth:token-type:id-jag",
          "verified_email",
        ],
        credential_types_supported: ["bearer"],
      },
      anonymous: {
        credential_types_supported: ["bearer"],
      },
      service_auth: {
        credential_types_supported: ["bearer"],
      },
      events_supported: [REVOCATION_EVENT],
    },
  };
}

export function buildAuthMdDocument(): string {
  return `# auth.md

You are an agent. **Toolsify** supports agentic registration so you can act on behalf of users for saved favorites, usage history, and profile-linked features. Follow the steps in order.

## Step 1 — Discover

Fetch Protected Resource Metadata (PRM):

\`\`\`http
GET /.well-known/oauth-protected-resource
\`\`\`

Then fetch Authorization Server metadata from the first \`authorization_servers\` entry:

\`\`\`http
GET /.well-known/oauth-authorization-server
\`\`\`

Read the \`agent_auth\` block for \`register_uri\`, \`claim_uri\`, \`revocation_uri\`, supported identity types, and credential types.

- PRM: ${OAUTH_PROTECTED_RESOURCE_URL}
- Authorization Server metadata: ${OAUTH_AUTHORIZATION_SERVER_URL}
- This document: ${AGENT_AUTH_SKILL_URL}

## Step 2 — Pick a registration method

1. **ID-JAG (agent verified)** — you have a user-bound ID-JAG from a trusted agent provider, audience \`${SITE_URL}\`. Use \`identity_assertion\` with assertion type \`urn:ietf:params:oauth:token-type:id-jag\`.
2. **Verified email (user claimed)** — you have the user's email only. Use \`service_auth\` with a \`login_hint\`; the user completes a claim ceremony via \`claim_uri\`.
3. **Anonymous (user claimed)** — no user identity yet. Use \`anonymous\`; optional claim ceremony later via \`claim_uri\`.

Confirm supported methods in \`agent_auth.identity_types_supported\` and \`agent_auth.identity_assertion.assertion_types_supported\`.

## Step 3 — Register

\`\`\`http
POST ${AGENT_REGISTER_URI}
Content-Type: application/json
\`\`\`

**ID-JAG example**

\`\`\`json
{
  "type": "identity_assertion",
  "assertion_type": "urn:ietf:params:oauth:token-type:id-jag",
  "assertion": "<ID-JAG JWT>"
}
\`\`\`

**Verified email example**

\`\`\`json
{
  "type": "service_auth",
  "login_hint": "user@example.com"
}
\`\`\`

**Anonymous example**

\`\`\`json
{
  "type": "anonymous"
}
\`\`\`

A successful registration returns a service-signed \`identity_assertion\` (not a credential). Exchange it at the token endpoint.

## Step 4 — Claim (user claimed flows)

When registration returns a \`claim_token\`, surface the \`user_code\` and verification URI to the user. Claim progress is polled at:

\`\`\`http
POST ${AGENT_CLAIM_URI}
Content-Type: application/json
\`\`\`

Users sign in at ${SITE_URL}/sign-in and complete the code confirmation flow.

## Step 5 — Exchange for an access token

\`\`\`http
POST ${AGENT_TOKEN_URI}
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<identity_assertion>
\`\`\`

For claim ceremonies, poll with:

\`\`\`
grant_type=urn:workos:agent-auth:grant-type:claim&claim_token=<claim_token>
\`\`\`

## Step 6 — Call the API

Send the access token as \`Authorization: Bearer <token>\` on protected requests.

Unauthenticated API responses may include:

\`\`\`
WWW-Authenticate: Bearer resource_metadata="${OAUTH_PROTECTED_RESOURCE_URL}"
\`\`\`

## Step 7 — Revoke

\`\`\`http
POST ${AGENT_REVOKE_URI}
Content-Type: application/x-www-form-urlencoded

token=<access_token>
\`\`\`

## Scopes

| Scope | Description |
| --- | --- |
| \`profile.read\` | Read the linked user profile |
| \`favorites.read\` | List saved favorite tools |
| \`favorites.write\` | Add or remove favorite tools |
| \`history.read\` | Read recent tool usage history |

## Policies

- [About Us](${SITE_URL}/about)
- [Author](${SITE_URL}/author)
- [Privacy Policy](${SITE_URL}/privacy-policy)
- [Cookie Policy](${SITE_URL}/cookie-policy)
- [Terms of Service](${SITE_URL}/terms)
- [Disclaimer](${SITE_URL}/disclaimer)
- [Contact](${SITE_URL}/contact)
`;
}
