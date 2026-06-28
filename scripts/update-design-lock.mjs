import { buildLockManifest, writeLockManifest, LOCK_PATH } from "./design-lock-utils.mjs";

const manifest = buildLockManifest();
writeLockManifest(manifest);

console.log(`✅ Design lock updated: ${LOCK_PATH}`);
console.log(`   ${Object.keys(manifest.files).length} files fingerprinted (${manifest.version})`);
console.log("   Commit design-lock/marketing.v1.json with your visual changes.");