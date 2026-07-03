/**
 * Quick smoke test: API login + JWT agency claims.
 * Run: node scripts/test-agency-login.mjs
 */
const API = "http://localhost:3000";
const email = process.argv[2] ?? "ashrafjallouz@gmail.com";
const password = process.argv[3] ?? "Achraf13461342";

function decodeJwt(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
}

const res = await fetch(`${API}/dashboard/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const body = await res.json();
if (!res.ok) {
  console.error("LOGIN FAILED", res.status, body);
  process.exit(1);
}

const jwt = decodeJwt(body.access_token);
console.log("OK status", res.status);
console.log("agencyId (body):", body.agencyId);
console.log("agencyRole (body):", body.agencyRole);
console.log("agencyId (jwt):", jwt.agencyId);
console.log("agencyRole (jwt):", jwt.agencyRole);

if (!body.agencyId || !jwt.agencyId) {
  console.error("MISSING agencyId — dashboard will not open");
  process.exit(1);
}

console.log("API login looks good for dashboard access.");
