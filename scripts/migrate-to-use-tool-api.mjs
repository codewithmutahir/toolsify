import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const skip = new Set(["components/tools/bmi-calculator/BMICalculator.tsx"]);

const files = execSync('git ls-files "components/tools/**/*.tsx"', {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter(
    (f) =>
      f.includes("/") &&
      !f.includes("shared/") &&
      !f.includes("ToolPageShell") &&
      !f.includes("ToolWrapper.tsx") &&
      !f.includes("ToolHeader") &&
      !f.includes("RelatedTools") &&
      !f.includes("AllToolsPage") &&
      !skip.has(f)
  );

function slugFromPath(file) {
  return path.basename(path.dirname(file));
}

function cleanup(content) {
  return content
    .replace(/import JsonLd from "@\/components\/seo\/JsonLd";\n/g, "")
    .replace(/import ToolWrapper from "@\/components\/tools\/ToolWrapper";\n/g, "")
    .replace(/import ToolFaq from "@\/components\/tools\/shared\/ToolFaq";\n/g, "")
    .replace(/import \{ getToolBySlug \} from "@\/constants\/tools";\n/g, "")
    .replace(/const tool = getToolBySlug\([^)]+\)!;\n\n/g, "")
    .replace(/\n\s*const schema = \{[\s\S]*?\};\n/g, "\n")
    .replace(/return \(\s*<>\s*\n/g, "return (\n    <>\n")
    .replace(/\n\s*<\/>\s*\);/g, "\n    </>\n  );");
}

const MIGRATIONS = {
  "percentage-calculator": {
    removeImports: [
      /import \{\s*calculatePercentage,\s*type PercentageMode,\s*\} from "@\/lib\/calculators\/percentage";\n/,
      /import \{\s*calculatePercentage,\s*\} from "@\/lib\/calculators\/percentage";\n/,
    ],
    addImports: `import { useToolApi } from "@/hooks/useToolApi";
import type { PercentageMode, PercentageResult } from "@/lib/calculators/percentage";
`,
    replaceUseMemo: `  const requestBody = useMemo(() => {
    const av = parseFloat(a);
    const bv = parseFloat(b);
    if (Number.isNaN(av) || Number.isNaN(bv)) return null;
    return { mode, a: av, b: bv };
  }, [mode, a, b]);

  const { data: result, error } = useToolApi<PercentageResult>(
    "percentage-calculator",
    requestBody
  );`,
    oldUseMemo:
      /const result = useMemo\(\(\) => \{\s*return calculatePercentage\(mode, parseFloat\(a\), parseFloat\(b\)\);\s*\}, \[mode, a, b\]\);/,
  },
  "age-calculator": {
    removeImports: [/import \{ calculateAge, formatAgeSummary \} from "@\/lib\/calculators\/age";\n/],
    addImports: `import { useToolApi } from "@/hooks/useToolApi";
import { formatAgeSummary, type AgeResult } from "@/lib/calculators/age";
`,
    replaceUseMemo: `  const requestBody = useMemo(
    () => ({ birthDate, asOfDate }),
    [birthDate, asOfDate]
  );

  const { data: result, error } = useToolApi<AgeResult>("age-calculator", requestBody);`,
    oldUseMemo:
      /const result = useMemo\(\(\) => \{\s*return calculateAge\(new Date\(birthDate\), new Date\(asOfDate\)\);\s*\}, \[birthDate, asOfDate\]\);/,
    extraReplace: [
      [
        /\{result \? \(/,
        `{error && (
          <p className="font-body text-body text-error text-center mb-lg">{error}</p>
        )}
        {result ? (`,
      ],
    ],
  },
};

for (const file of files) {
  const slug = slugFromPath(file);
  let content = cleanup(fs.readFileSync(file, "utf8"));
  const migration = MIGRATIONS[slug];

  if (migration) {
    for (const pattern of migration.removeImports) {
      content = content.replace(pattern, "");
    }
    if (!content.includes("useToolApi")) {
      content = content.replace(
        /("use client";\n\n)/,
        `$1${migration.addImports}`
      );
    }
    content = content.replace(migration.oldUseMemo, migration.replaceUseMemo);
    if (migration.extraReplace) {
      for (const [from, to] of migration.extraReplace) {
        content = content.replace(from, to);
      }
    }
  }

  fs.writeFileSync(file, content);
  console.log(migration ? "Migrated" : "Cleaned", slug);
}
