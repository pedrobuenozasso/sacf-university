const baseUrl = (process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000/academy").replace(/\/$/, "");

async function check(path, expectedStatus, method = "GET") {
  const response = await fetch(`${baseUrl}${path}`, { method, redirect: "manual" });
  if (response.status !== expectedStatus) throw new Error(`${path}: expected ${expectedStatus}, received ${response.status}`);
  console.log(`ok ${path} (${response.status})`);
}

await check("/api/health", 200);
await check("/login", 200);
await check("/api/admin/uploads/verify", 401, "POST");
console.log("Smoke checks passed.");
