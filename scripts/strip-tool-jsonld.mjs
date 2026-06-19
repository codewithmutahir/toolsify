import fs from "node:fs";
import { execSync } from "node:child_process";

const skip = new Set([
  "components/tools/bmi-calculator/BMICalculator.tsx",
]);

const files = execSync('git ls-files "components/tools/**/*.tsx"', {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter((f) => f.includes("/") && !skip.has(f));

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("JsonLd")) continue;

  content = content.replace(
    /import JsonLd from "@\/components\/seo\/JsonLd";\n/g,
    ""
  );
  content = content.replace(/\n\s*const schema = \{[\s\S]*?\};\n/g, "\n");
  content = content.replace(/\s*<JsonLd data=\{schema\} \/>\n/g, "");
  content = content.replace(
    /return \(\s*<>\s*([\s\S]*?)\s*<\/>\s*\);/g,
    "return (\n    <>\n$1\n    </>\n  );"
  );

  fs.writeFileSync(file, content);
  console.log("Updated", file);
}
