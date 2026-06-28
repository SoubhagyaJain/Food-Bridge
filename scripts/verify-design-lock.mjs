import { verifyLock } from "./design-lock-utils.mjs";

const errors = verifyLock();

if (errors.length > 0) {
  console.error("\n❌ Marketing design lock failed:\n");
  for (const error of errors) {
    console.error(`  • ${error}\n`);
  }
  console.error(
    "Intentional design change? Update the lock: npm run design:lock\n"
  );
  process.exit(1);
}

console.log("✅ Marketing design lock verified — styles and layout match the frozen baseline.");