import fs from "node:fs";
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

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("<ToolWrapper") && !content.includes("JsonLd")) continue;

  const wrapperMatch = content.match(
    /<ToolWrapper[\s\S]*?^\s*>\s*\n([\s\S]*?)<\/ToolWrapper>/m
  );

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
  content = content.replace(/\n\s*const schema = \{[\s\S]*?\};\n/g, "\n");

  if (wrapperMatch) {
    const children = wrapperMatch[1].trim();
    content = content.replace(
      /return \(\s*<>\s*<JsonLd data=\{schema\} \/>\s*<ToolWrapper[\s\S]*?<\/ToolWrapper>\s*<\/>\s*\);/m,
      `return (\n    <>\n${children}\n    </>\n  );`
    );
    if (content.includes("<ToolWrapper")) {
      content = content.replace(
        /<ToolWrapper[\s\S]*?<\/ToolWrapper>/m,
        children
      );
      content = content.replace(/\s*<JsonLd data=\{schema\} \/>\n/g, "");
      content = content.replace(/return \(\s*<>\s*\n\s*<>\n/m, "return (\n    <>\n");
    }
  }

  fs.writeFileSync(file, content);
  console.log("Stripped", file);
}
