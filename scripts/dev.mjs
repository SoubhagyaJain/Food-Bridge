import { spawn, execSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { rmSync, existsSync } from "node:fs";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const cacheDir = join(root, ".next");
const port = process.env.PORT ?? "3002";

try {
  execSync(`node scripts/kill-port.mjs ${port}`, { cwd: root, stdio: "inherit" });
} catch {
  // non-fatal — port may already be free
}

if (existsSync(cacheDir)) {
  rmSync(cacheDir, { recursive: true, force: true });
  console.log("Cleared .next cache before starting dev server");
}

const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "dev", "-p", port], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));