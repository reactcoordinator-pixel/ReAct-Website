/**
 * Apply supabase/schema.sql directly over the Postgres wire protocol.
 * Usage: DATABASE_URL=... node supabase/apply.js   (also reads .env)
 */
const fs = require("fs");
const { Client } = require("pg");

for (const f of [".env", ".env.local"]) {
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL not set (add it to .env).");
  process.exit(1);
}

(async () => {
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  const sql = fs.readFileSync("supabase/schema.sql", "utf8");
  try {
    await client.query(sql);
    console.log("✅ schema.sql applied successfully.");
  } catch (e) {
    console.error("❌ SQL error:", e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
