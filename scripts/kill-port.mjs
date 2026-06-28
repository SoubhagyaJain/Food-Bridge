/**
 * Kill any process listening on the given port (Windows).
 * Usage: node scripts/kill-port.mjs [port]
 */
import { execSync } from "node:child_process";

const port = process.argv[2] ?? process.env.PORT ?? "3002";

try {
  const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
  const pids = new Set();

  for (const line of output.split("\n")) {
    if (!line.includes("LISTENING")) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && pid !== "0") pids.add(pid);
  }

  if (pids.size === 0) {
    console.log(`Port ${port} is free`);
    process.exit(0);
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "pipe" });
      console.log(`Stopped process ${pid} on port ${port}`);
    } catch {
      console.warn(`Could not stop PID ${pid} — close that terminal or run as admin`);
    }
  }
} catch {
  console.log(`Port ${port} is free`);
}