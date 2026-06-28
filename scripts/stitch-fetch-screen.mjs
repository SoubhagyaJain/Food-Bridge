import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { stitch } from "@google/stitch-sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  try {
    const contents = readFileSync(resolve(root, ".env.local"), "utf8");
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
    // optional
  }
}

loadEnvLocal();

const projectId = process.argv[2] ?? "10006310988283133215";
const screenId = process.argv[3] ?? "8b13b581dd4f409f8cdd73cf672162af";

const project = stitch.project(projectId);
const screen = await project.getScreen(screenId);
const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();

console.log("Fetching HTML from:", htmlUrl);
const htmlRes = await fetch(htmlUrl);
const html = await htmlRes.text();

const outDir = resolve(root, "stitch-export");
mkdirSync(outDir, { recursive: true });
const htmlPath = resolve(outDir, `${screenId}.html`);
writeFileSync(htmlPath, html, "utf8");

console.log("Saved HTML:", htmlPath);
console.log("Screenshot URL:", imageUrl);
console.log("HTML length:", html.length);