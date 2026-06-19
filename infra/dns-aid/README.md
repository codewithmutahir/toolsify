# DNS-AID for toolsify.online

DNS for AI Discovery (DNS-AID) is published at your **authoritative DNS provider** (Cloudflare), not in the Next.js app. The app provides the HTTP agent index that DNS points to.

## Automated setup (recommended)

1. Create a [Cloudflare API token](https://dash.cloudflare.com/profile/api-tokens) with:
   - **Zone → DNS → Edit**
   - **Zone → DNSSEC → Edit**
2. Add to `.env.local`:
   ```
   CLOUDFLARE_API_TOKEN=your_token_here
   ```
3. Run:
   ```bash
   npm run dns-aid:publish
   ```

This creates (DNS-only, not proxied):

| Name | Type | Value |
|------|------|-------|
| `_index._agents` | HTTPS | `1 www.toolsify.online. alpn="h3,h2" port=443 mandatory="alpn,port"` |
| `_index._agents.www` | HTTPS | same (covers `www.toolsify.online` scans) |
| `_index._agents` | TXT | `agents=api-catalog:https,site-guide:https` |

It also enables **DNSSEC** on the zone.

## Manual setup (Cloudflare dashboard)

1. **DNS → Records → Add record**
   - Type: `HTTPS`
   - Name: `_index._agents`
   - Priority: `1`
   - Target: `www.toolsify.online`
   - Add parameters: `alpn="h3,h2"`, `port=443`, `mandatory="alpn,port"`
   - Proxy status: **DNS only** (grey cloud)
2. Repeat for name `_index._agents.www`.
3. Optional TXT fallback on `_index._agents`:
   - `agents=api-catalog:https,site-guide:https`
4. **DNS → Settings → DNSSEC → Enable**

If your registrar is outside Cloudflare, copy the DS record Cloudflare shows and add it at the registrar.

## HTTP complement (in this repo)

| Path | Purpose |
|------|---------|
| `/.well-known/agent-index.json` | Organization agent index (DNS-AID HTTP fallback) |
| `/.well-known/api-catalog` | RFC 9727 API catalog |

## Verify

```bash
# Service binding record
curl "https://cloudflare-dns.com/dns-query?name=_index._agents.toolsify.online&type=HTTPS" \
  -H "accept: application/dns-json"

# Agent readiness scan
curl -X POST https://isitagentready.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://toolsify.online"}'
```

Expect `checks.discoverability.dnsAid.status` to be `"pass"` once records propagate and DNSSEC validates.

## References

- [DNS-AID draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
- [RFC 9460 — SVCB/HTTPS records](https://www.rfc-editor.org/rfc/rfc9460)
- [Agent readiness DNS-AID skill](https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md)
