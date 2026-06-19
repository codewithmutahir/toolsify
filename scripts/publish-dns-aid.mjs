#!/usr/bin/env node
/**
 * Publish DNS-AID discovery records to Cloudflare.
 *
 * Required:
 *   CLOUDFLARE_API_TOKEN — Zone.DNS Edit (+ Zone.DNSSEC Edit for DNSSEC)
 *
 * Optional:
 *   CLOUDFLARE_ZONE_ID   — looked up from DNS_AID_ZONE_NAME when omitted
 *   DNS_AID_ZONE_NAME    — default: toolsify.online
 *   DNS_AID_TARGET       — canonical HTTPS hostname (default: www.toolsify.online)
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

loadEnvFile(resolve(ROOT, ".env.local"));
loadEnvFile(resolve(ROOT, ".env"));

const API_BASE = "https://api.cloudflare.com/client/v4";
const ZONE_NAME = process.env.DNS_AID_ZONE_NAME || "toolsify.online";
const TARGET = process.env.DNS_AID_TARGET || "www.toolsify.online";
const TTL = 3600;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

const HTTPS_PARAMS = 'alpn="h3,h2" port=443 mandatory="alpn,port"';
const TXT_CONTENT = "agents=api-catalog:https,site-guide:https";

const RECORDS = [
  {
    name: "_index._agents",
    type: "HTTPS",
    data: { priority: 1, target: TARGET, value: HTTPS_PARAMS },
  },
  {
    name: "_index._agents.www",
    type: "HTTPS",
    data: { priority: 1, target: TARGET, value: HTTPS_PARAMS },
  },
  {
    name: "_index._agents",
    type: "TXT",
    content: TXT_CONTENT,
  },
];

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function cf(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json();
  if (!body.success) {
    const detail = body.errors?.map((e) => e.message).join("; ") || response.statusText;
    throw new Error(`Cloudflare API error: ${detail}`);
  }
  return body;
}

async function getZoneId() {
  if (process.env.CLOUDFLARE_ZONE_ID) return process.env.CLOUDFLARE_ZONE_ID;
  const body = await cf(`/zones?name=${encodeURIComponent(ZONE_NAME)}`);
  const zone = body.result?.[0];
  if (!zone) throw new Error(`Zone not found: ${ZONE_NAME}`);
  return zone.id;
}

async function listRecords(zoneId) {
  const body = await cf(`/zones/${zoneId}/dns_records?per_page=100`);
  return body.result || [];
}

function normalizeTarget(target) {
  return target?.replace(/\.$/, "") ?? "";
}

function recordsMatch(existing, payload) {
  if (payload.type === "HTTPS" || payload.type === "SVCB") {
    return (
      existing.data?.priority === payload.data.priority &&
      normalizeTarget(existing.data?.target) === normalizeTarget(payload.data.target) &&
      existing.data?.value === payload.data.value &&
      existing.proxied === false
    );
  }

  const existingContent =
    typeof existing.content === "string"
      ? existing.content.replace(/^"|"$/g, "")
      : existing.content;
  return existingContent === payload.content;
}

function buildPayload(record) {
  if (record.type === "HTTPS" || record.type === "SVCB") {
    return {
      type: record.type,
      name: record.name,
      ttl: TTL,
      proxied: false,
      data: record.data,
    };
  }

  return {
    type: record.type,
    name: record.name,
    content: record.content,
    ttl: TTL,
  };
}

async function upsertRecord(zoneId, existing, record) {
  const fullName = `${record.name}.${ZONE_NAME}`;
  const match = existing.find((r) => r.name === fullName && r.type === record.type);
  const payload = buildPayload(record);

  if (match) {
    if (recordsMatch(match, payload)) {
      console.log(`  ✓ ${record.type} ${record.name} (unchanged)`);
      return;
    }
    await cf(`/zones/${zoneId}/dns_records/${match.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    console.log(`  ↻ ${record.type} ${record.name} (updated)`);
    return;
  }

  await cf(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log(`  + ${record.type} ${record.name} (created)`);
}

async function enableDnssec(zoneId) {
  try {
    const status = await cf(`/zones/${zoneId}/dnssec`);
    if (status.result?.status === "active") {
      console.log("  ✓ DNSSEC already active");
      return status.result;
    }

    const enabled = await cf(`/zones/${zoneId}/dnssec`, {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
    });
    console.log("  + DNSSEC enabled");
    return enabled.result;
  } catch (error) {
    console.warn(
      `  ⚠ DNSSEC not enabled: ${error.message}\n` +
        "    Add Zone.DNSSEC Edit to your API token, or enable DNSSEC manually in Cloudflare → DNS → Settings."
    );
    return null;
  }
}

async function verifyRecords() {
  const names = [
    `_index._agents.${ZONE_NAME}`,
    `_index._agents.www.${ZONE_NAME}`,
  ];

  for (const name of names) {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=HTTPS`;
    const response = await fetch(url, { headers: { Accept: "application/dns-json" } });
    const body = await response.json();
    const answers = body.Answer || [];
    if (answers.length > 0) {
      console.log(`  ✓ DoH ${name} → ${answers[0].data}`);
    } else {
      console.warn(`  ⚠ DoH ${name} — no answers yet (propagation may take a few minutes)`);
    }
  }
}

async function main() {
  if (!TOKEN) {
    console.error(
      "Missing CLOUDFLARE_API_TOKEN. Create a token with Zone.DNS Edit and Zone.DNSSEC, then rerun."
    );
    process.exit(1);
  }

  console.log(`Publishing DNS-AID records for ${ZONE_NAME}`);
  console.log(`Target hostname: ${TARGET}`);
  console.log(`HTTPS params: ${HTTPS_PARAMS}\n`);

  const zoneId = await getZoneId();
  console.log(`Zone ID: ${zoneId}\nDNS records:`);

  const existing = await listRecords(zoneId);
  for (const record of RECORDS) {
    await upsertRecord(zoneId, existing, record);
  }

  console.log("\nDNSSEC:");
  const dnssec = await enableDnssec(zoneId);

  if (dnssec?.ds) {
    console.log("\nIf your registrar is not Cloudflare, add this DS record at the registrar:");
    console.log(`  ${dnssec.ds}`);
  } else if (dnssec?.digest) {
    console.log("\nDS digest:", dnssec.digest);
  }

  console.log("\nVerifying via DNS-over-HTTPS:");
  await verifyRecords();

  console.log(
    "\nDone. Re-scan with:\n  curl -X POST https://isitagentready.com/api/scan \\\n    -H \"Content-Type: application/json\" \\\n    -d '{\"url\":\"https://toolsify.online\"}'"
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
