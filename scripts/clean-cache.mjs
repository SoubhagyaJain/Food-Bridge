import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const cacheDir = join(root, ".next");

if (existsSync(cacheDir)) {
  rmSync(cacheDir, { recursive: true, force: true });
  console.log("Removed stale .next cache");
}