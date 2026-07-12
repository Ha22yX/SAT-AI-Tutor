import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const source = path.resolve(process.cwd(), ".next", "static");
const defaultRoot = "/www/wwwroot/sat-ai-tutor-native/shared/next-assets";
const sharedRoot = process.env.NEXT_STATIC_ASSET_ROOT || (existsSync("/www/wwwroot/sat-ai-tutor-native") ? defaultRoot : "");

if (!existsSync(source)) {
  console.log("Next static retention skipped: .next/static not found.");
  process.exit(0);
}

if (!sharedRoot) {
  console.log("Next static retention skipped: NEXT_STATIC_ASSET_ROOT is not set.");
  process.exit(0);
}

const target = path.join(sharedRoot, "_next", "static");
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log(`Next static assets retained in ${target}`);
