/**
 * Clean restart: free port 3002, clear .next cache, start dev server.
 * Usage: npm run dev:fresh
 */
import { spawn, execSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const port = process.env.PORT ?? "3002";

console.log("── FoodBridge fresh dev start ──\n");

// 1. Free the port
try {
  execSync(`node scripts/kill-port.mjs ${port}`, { cwd: root, stdio: "inherit" });
} catch {
  // port already free
}

// 2. Clear .next cache
try {
  execSync("node scripts/clean-cache.mjs", { cwd: root, stdio: "inherit" });
} catch {
  // non-fatal
}

console.log("");

// 3. Start dev (without double-clearing — call next directly)
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