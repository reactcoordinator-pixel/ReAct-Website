/**
 * Seed (or reset) an admin account in the Supabase `admins` table.
 *
 * Defaults to username "AdminReact" / password "Admin123", but you can override
 * either from the command line or the environment:
 *
 *   node supabase/seed-admin.js
 *   node supabase/seed-admin.js MyUser MyPassw0rd
 *   ADMIN_USERNAME=MyUser ADMIN_PASSWORD=MyPassw0rd node supabase/seed-admin.js
 *
 * Idempotent: if the username already exists its password (and name) are reset;
 * otherwise a new admin row is inserted. Passwords are bcrypt-hashed — the same
 * scheme the login route (/api/admin/login) verifies against.
 */
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

// Load env from .env / .env.local without extra deps (mirrors the other scripts).
for (const f of [".env", ".env.local"]) {
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
  process.exit(1);
}

const USERNAME = process.argv[2] || process.env.ADMIN_USERNAME || "AdminReact";
const PASSWORD = process.argv[3] || process.env.ADMIN_PASSWORD || "Admin123";
const NAME = process.env.ADMIN_NAME || "React Admin";

const sb = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

(async () => {
  const password_hash = bcrypt.hashSync(PASSWORD, 10);

  // Does this username already exist?
  const { data: existing, error: selErr } = await sb
    .from("admins")
    .select("id")
    .eq("username", USERNAME)
    .maybeSingle();
  if (selErr) throw new Error(`lookup failed: ${selErr.message}`);

  if (existing) {
    const { error } = await sb
      .from("admins")
      .update({ password_hash, name: NAME })
      .eq("id", existing.id);
    if (error) throw new Error(`update failed: ${error.message}`);
    console.log(`✅ Reset existing admin  ${USERNAME} / ${PASSWORD}`);
  } else {
    const { error } = await sb.from("admins").insert({
      name: NAME,
      username: USERNAME,
      job_role: "Administrator",
      password_hash,
    });
    if (error) throw new Error(`insert failed: ${error.message}`);
    console.log(`✅ Created admin  ${USERNAME} / ${PASSWORD}`);
  }

  process.exit(0);
})().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
