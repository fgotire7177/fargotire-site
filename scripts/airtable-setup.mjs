// One-time setup: creates the "Fargo Tire Service Website" base from airtable/schema.json and
// loads airtable/seed.json. Run with the SHOP's Airtable token, not Jay's.
//
//   AIRTABLE_TOKEN        personal access token with schema.bases:read, schema.bases:write,
//                         data.records:read, data.records:write on the shop's workspace
//   AIRTABLE_WORKSPACE_ID wsp... (from the workspace URL)
//
//   npm run airtable:setup             create the base and load the seed
//   npm run airtable:setup -- --seed-only   load the seed into AIRTABLE_BASE_ID (tables must exist)
import fs from "node:fs/promises";

try { process.loadEnvFile(); } catch { /* no .env */ }

const API = "https://api.airtable.com/v0";
const token = process.env.AIRTABLE_TOKEN;
const seedOnly = process.argv.includes("--seed-only");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(method, path, body) {
  await sleep(250); // Airtable allows 5 requests per second per base
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}\n${text}`);
  return text ? JSON.parse(text) : {};
}

if (!token) { console.error("Set AIRTABLE_TOKEN in .env first."); process.exit(1); }

const schema = JSON.parse(await fs.readFile(new URL("../airtable/schema.json", import.meta.url), "utf8"));
const seed = JSON.parse(await fs.readFile(new URL("../airtable/seed.json", import.meta.url), "utf8"));

let baseId = process.env.AIRTABLE_BASE_ID;
if (!seedOnly) {
  const workspaceId = process.env.AIRTABLE_WORKSPACE_ID;
  if (!workspaceId) { console.error("Set AIRTABLE_WORKSPACE_ID in .env (the wsp... id from the workspace URL)."); process.exit(1); }
  const tables = schema.tables.map((t) => ({ name: t.name, description: t.description, fields: t.fields }));
  const created = await call("POST", "/meta/bases", { name: schema.baseName, workspaceId, tables });
  baseId = created.id;
  console.log(`Created base ${schema.baseName}: ${baseId}`);
}
if (!baseId) { console.error("No base ID. Set AIRTABLE_BASE_ID or run without --seed-only."); process.exit(1); }

for (const [table, rows] of Object.entries(seed)) {
  if (table.startsWith("_") || !Array.isArray(rows) || !rows.length) continue;
  for (let i = 0; i < rows.length; i += 10) {
    const records = rows.slice(i, i + 10).map((fields) => ({ fields }));
    await call("POST", `/${baseId}/${encodeURIComponent(table)}`, { records, typecast: true });
  }
  console.log(`Loaded ${rows.length} rows into ${table}`);
}

console.log(`\nDone. Put this in .env and in Netlify's environment variables:\nAIRTABLE_BASE_ID=${baseId}`);
console.log("Then add an 'Update website' button field (Open URL) to Coupons, Special Hours, Blog Posts and Business Info,");
console.log("pointing at https://<your-site>/.netlify/functions/update-site?key=<UPDATE_SITE_KEY>.");
