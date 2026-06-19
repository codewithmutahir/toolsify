import fs from "node:fs";
import { execSync } from "node:child_process";

const skip = new Set([
  "components/tools/ToolPageShell.tsx",
  "components/tools/ToolWrapper.tsx",
  "components/tools/ToolHeader.tsx",
  "components/tools/RelatedTools.tsx",
  "components/tools/AllToolsPage.tsx",
  "components/tools/bmi-calculator/BMICalculator.tsx",
]);

const files = execSync('git ls-files "components/tools/**/*.tsx"', {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter((f) => f.includes("/") && !f.includes("shared/") && !skip.has(f));

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("<ToolWrapper")) continue;

  const wrapperMatch = content.match(
    /<ToolWrapper[\s\S]*?^\s*>\s*\n([\s\S]*?)<\/ToolWrapper>/m
  );
  if (!wrapperMatch) {
    console.warn("No wrapper match:", file);
    continue;
  }

  const children = wrapperMatch[1].trim();

  content = content.replace(
    /import JsonLd from "@\/components\/seo\/JsonLd";\n/g,
    ""
  );
  content = content.replace(
    /import ToolWrapper from "@\/components\/tools\/ToolWrapper";\n/g,
    ""
  );
  content = content.replace(
    /import ToolFaq from "@\/components\/tools\/shared\/ToolFaq";\n/g,
    ""
  );
  content = content.replace(
    /import \{ getToolBySlug \} from "@\/constants\/tools";\n/g,
    ""
  );
  content = content.replace(/const tool = getToolBySlug\([^)]+\)!;\n\n/g, "");
  content = content.replace(/\n\s*const schema = \{[\s\S]*?\};\n/g, "");

  content = content.replace(
    /return \(\s*<>\s*<JsonLd data=\{schema\} \/>\s*<ToolWrapper[\s\S]*?<\/ToolWrapper>\s*<\/>\s*\);/m,
    `return (\n    ${children}\n  );`
  );

  if (content.includes("<ToolWrapper")) {
    content = content.replace(
      /<ToolWrapper[\s\S]*?<\/ToolWrapper>/m,
      children
    );
    content = content.replace(/return \(\s*<>\s*/m, "return (\n    ");
    content = content.replace(/\s*<\/>\s*\);/m, "\n  );");
    content = content.replace(/<JsonLd data=\{schema\} \/>\s*/g, "");
  }

  fs.writeFileSync(file, content);
  console.log("Updated", file);
}
