import { createHash } from "crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import path from "path";

export const AGENT_SKILLS_SCHEMA =
  "https://schemas.agentskills.io/discovery/0.2.0/schema.json";

const SKILLS_DIR = path.join(process.cwd(), ".agents", "skills");

export type AgentSkillEntry = {
  name: string;
  type: "skill-md";
  description: string;
  url: string;
  digest: string;
};

export type AgentSkillsIndex = {
  $schema: typeof AGENT_SKILLS_SCHEMA;
  skills: AgentSkillEntry[];
};

function parseDescription(content: string): string | undefined {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return undefined;

  const lines = frontmatterMatch[1].split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("description: |")) {
      const descLines: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].startsWith("  ")) {
          descLines.push(lines[j].slice(2));
        } else {
          break;
        }
      }
      return descLines.join(" ").trim().slice(0, 1024);
    }

    if (line.startsWith("description:")) {
      return line
        .slice("description:".length)
        .trim()
        .replace(/^["']|["']$/g, "")
        .slice(0, 1024);
    }
  }

  return undefined;
}

export function computeSkillDigest(content: Buffer): string {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

export function getSkillArtifactPath(name: string): string | null {
  const skillPath = path.join(SKILLS_DIR, name, "SKILL.md");
  if (!existsSync(skillPath)) return null;
  return skillPath;
}

export function readSkillArtifact(name: string): Buffer | null {
  const skillPath = getSkillArtifactPath(name);
  if (!skillPath) return null;
  return readFileSync(skillPath);
}

export function discoverAgentSkills(): AgentSkillEntry[] {
  if (!existsSync(SKILLS_DIR)) return [];

  const entries: AgentSkillEntry[] = [];

  for (const name of readdirSync(SKILLS_DIR)) {
    const skillDir = path.join(SKILLS_DIR, name);
    if (!statSync(skillDir).isDirectory()) continue;

    const skillPath = path.join(skillDir, "SKILL.md");
    if (!existsSync(skillPath)) continue;

    const content = readFileSync(skillPath);
    const description =
      parseDescription(content.toString("utf-8")) ?? name;

    entries.push({
      name,
      type: "skill-md",
      description,
      url: `/.well-known/agent-skills/${name}/SKILL.md`,
      digest: computeSkillDigest(content),
    });
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

export function buildAgentSkillsIndex(): AgentSkillsIndex {
  return {
    $schema: AGENT_SKILLS_SCHEMA,
    skills: discoverAgentSkills(),
  };
}
