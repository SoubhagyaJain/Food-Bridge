/**
 * Verify Google Stitch API key and list projects.
 * Usage: node scripts/stitch-test.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stitch } from "@google/stitch-sdk";

function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local optional if STITCH_API_KEY is already in environment
  }
}

loadEnvLocal();

if (!process.env.STITCH_API_KEY?.trim()) {
  console.error("STITCH_API_KEY is not set. Add it to .env.local");
  process.exit(1);
}

try {
  const projects = await stitch.projects();
  console.log(`Stitch connected — ${projects.length} project(s) found.`);
  for (const project of projects.slice(0, 5)) {
    const screens = await project.screens();
    console.log(`  • ${project.projectId} — ${screens.length} screen(s)`);
  }
  if (projects.length === 0) {
    console.log("No projects yet. Run stitch-generate-hero.mjs to create one.");
  }
} catch (error) {
  console.error("Stitch connection failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}