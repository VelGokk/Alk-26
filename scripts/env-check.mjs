import "dotenv/config";

const critical = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
];

const optional = [
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

function check(keys) {
  return keys.map((key) => ({
    key,
    ok: Boolean(process.env[key]),
  }));
}

const criticalStatus = check(critical);
const optionalStatus = check(optional);

console.log("\nALKAYA env check\n");
console.log("Criticas:");
criticalStatus.forEach((item) => {
  console.log(`- ${item.key}: ${item.ok ? "OK" : "MISSING"}`);
});

console.log("\nOpcionales:");
optionalStatus.forEach((item) => {
  console.log(`- ${item.key}: ${item.ok ? "OK" : "MISSING"}`);
});

const missingCritical = criticalStatus.some((item) => !item.ok);
process.exit(missingCritical ? 1 : 0);
