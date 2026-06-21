/**
 * Ensures every getTranslations/useTranslations namespace used in code
 * exists in messages/en.json. Run: node scripts/validate-i18n-namespaces.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const messages = JSON.parse(
  readFileSync(join(root, "messages/en.json"), "utf-8")
);

const SOURCE_DIRS = ["app", "components", "hooks", "lib"];
const SOURCE_EXT = new Set([".ts", ".tsx"]);

const TRANSLATION_CALL =
  /(?:getTranslations|useTranslations)\(\s*(?:\{[^}]*namespace:\s*)?["'`]([^"'`$]+)["'`]/g;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(path, files);
    } else if (SOURCE_EXT.has(path.slice(path.lastIndexOf(".")))) {
      files.push(path);
    }
  }
  return files;
}

function namespaceExists(namespace) {
  const parts = namespace.split(".");
  let node = messages;

  for (const part of parts) {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return false;
    }
    node = node[part];
  }

  return node !== undefined && node !== null;
}

const usages = new Map();

for (const dir of SOURCE_DIRS) {
  const absDir = join(root, dir);
  for (const file of walk(absDir)) {
    const content = readFileSync(file, "utf-8");
    for (const match of content.matchAll(TRANSLATION_CALL)) {
      const namespace = match[1];
      const rel = relative(root, file);
      if (!usages.has(namespace)) usages.set(namespace, []);
      usages.get(namespace).push(rel);
    }
  }
}

const missing = [];

for (const [namespace, files] of usages) {
  if (!namespaceExists(namespace)) {
    missing.push({ namespace, files: [...new Set(files)] });
  }
}

if (missing.length > 0) {
  console.error("Missing i18n namespaces in messages/en.json:\n");
  for (const { namespace, files } of missing.sort((a, b) =>
    a.namespace.localeCompare(b.namespace)
  )) {
    console.error(`  - "${namespace}" used in:`);
    for (const file of files) {
      console.error(`      ${file}`);
    }
  }
  console.error(
    "\nAdd the missing namespace to messages/en.json and scripts/generate-i18n-messages.ts."
  );
  process.exit(1);
}

console.log(`Validated ${usages.size} i18n namespace(s) against messages/en.json.`);
