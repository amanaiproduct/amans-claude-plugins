#!/usr/bin/env node

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(`Usage:
  node verify-private-boundary.mjs --url <https-url> --asset <real-path> [--asset <path> ...] [--forbid <text> ...]

The root and every asset must redirect or return 401/403. A 200 or 404 fails.
Redirect targets are fetched anonymously and scanned for forbidden text.`);
  process.exit(message ? 2 : 0);
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) usage();

let baseUrl;
const assets = [];
const forbidden = [];

for (let index = 0; index < args.length; index += 1) {
  const flag = args[index];
  const value = args[index + 1];
  if (!["--url", "--asset", "--forbid"].includes(flag)) usage(`Unknown argument: ${flag}`);
  if (!value || value.startsWith("--")) usage(`Missing value for ${flag}`);
  if (flag === "--url") baseUrl = value;
  if (flag === "--asset") assets.push(value);
  if (flag === "--forbid") forbidden.push(value);
  index += 1;
}

if (!baseUrl) usage("--url is required");
if (assets.length === 0) usage("At least one --asset with a real deployed asset path is required");

let origin;
try {
  origin = new URL(baseUrl);
} catch {
  usage("--url must be a valid absolute URL");
}
if (origin.protocol !== "https:") usage("--url must use HTTPS");

const blockedStatuses = new Set([401, 403]);
const redirectStatuses = new Set([301, 302, 303, 307, 308]);
const failures = [];
const checks = [];

function scan(label, body) {
  const lowerBody = body.toLocaleLowerCase();
  for (const phrase of forbidden) {
    if (lowerBody.includes(phrase.toLocaleLowerCase())) {
      failures.push(`${label} exposed forbidden text: ${JSON.stringify(phrase)}`);
    }
  }
}

async function requestManual(url, label) {
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "private-boundary-verifier/1.0" },
  });
  const body = await response.text();
  scan(label, body);
  checks.push({ label, url, status: response.status, location: response.headers.get("location") });
  return { response, body };
}

async function verifyGate(url, label) {
  const { response } = await requestManual(url, label);
  if (!blockedStatuses.has(response.status) && !redirectStatuses.has(response.status)) {
    const reason = response.status === 404
      ? "404 does not prove authentication; confirm this is a real deployed path"
      : "expected an authentication redirect, 401, or 403";
    failures.push(`${label} returned ${response.status}: ${reason}`);
  }
  return response;
}

try {
  const rootResponse = await verifyGate(origin.href, "root");
  const location = rootResponse.headers.get("location");
  if (location && redirectStatuses.has(rootResponse.status)) {
    const target = new URL(location, origin);
    if (target.protocol !== "https:") {
      failures.push(`root redirects to a non-HTTPS URL: ${target.href}`);
    } else {
      await requestManual(target.href, "anonymous sign-in target");
    }
  }

  for (const asset of assets) {
    const target = new URL(asset, origin);
    if (target.origin !== origin.origin) {
      failures.push(`asset must be on the same origin: ${target.href}`);
      continue;
    }
    await verifyGate(target.href, `asset ${target.pathname}`);
  }
} catch (error) {
  failures.push(`network check failed: ${error instanceof Error ? error.message : String(error)}`);
}

for (const check of checks) {
  const redirect = check.location ? ` -> ${check.location}` : "";
  console.log(`${check.label}: ${check.status}${redirect}`);
}

if (failures.length > 0) {
  console.error("\nPrivacy-boundary verification FAILED:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nPrivacy-boundary verification passed for anonymous requests.");
console.log("Still complete authenticated, rejected-identity, sign-out, and alternate-host checks manually.");
