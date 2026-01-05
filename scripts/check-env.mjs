import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const CRITICAL_ENV = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
];

const OPTIONAL_ENV = [
  "NEXT_PUBLIC_APP_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "MERCADOPAGO_ACCESS_TOKEN",
  "MERCADOPAGO_WEBHOOK_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MUX_TOKEN_ID",
  "MUX_TOKEN_SECRET",
  "OPENAI_API_KEY",
];

function loadExampleKeys(examplePath) {
  if (!fs.existsSync(examplePath)) {
    return new Set();
  }
  const content = fs.readFileSync(examplePath, "utf-8");
  const keys = new Set();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key] = trimmed.split("=", 1);
    if (key) {
      keys.add(key.trim());
    }
  }
  return keys;
}

const examplePath = path.resolve(process.cwd(), ".env.example");
const sampleKeys = loadExampleKeys(examplePath);

function checkKeys(keys) {
  return keys.map((key) => ({
    key,
    ok: Boolean(process.env[key]),
  }));
}

const criticalStatus = checkKeys(CRITICAL_ENV);
const optionalStatus = checkKeys(OPTIONAL_ENV);

const missingInSample = [...CRITICAL_ENV, ...OPTIONAL_ENV].filter(
  (key) => !sampleKeys.has(key)
);

console.log("\nALKAYA env guard\n");
console.log("Critical vars:");
criticalStatus.forEach((item) => {
  console.log(`- ${item.key}: ${item.ok ? "present" : "MISSING"}`);
});

console.log("\nOptional vars:");
optionalStatus.forEach((item) => {
  console.log(`- ${item.key}: ${item.ok ? "present" : "missing"}`);
});

if (missingInSample.length > 0) {
  console.warn("\nWARNING: The following keys are missing from .env.example:");
  missingInSample.forEach((key) => console.warn(`- ${key}`));
}

const missingCritical = criticalStatus.filter((item) => !item.ok);
if (missingCritical.length > 0) {
  console.error(
    "\nBuild aborted: Missing critical environment variables.",
    missingCritical.map((item) => item.key).join(", ")
  );
  process.exit(1);
}

console.log("\nEnvironment check passed 🎉\n");
