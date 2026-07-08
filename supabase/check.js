// Empirically probe RLS state (anon) + create the media bucket (service role).
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = createClient(URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const admin = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

(async () => {
  // 1. anon read cms (should succeed if a read policy OR RLS disabled)
  const r1 = await anon.from("cms").select("id").limit(1);
  console.log("anon SELECT cms:", r1.error ? "DENIED ("+r1.error.message+")" : "OK");

  // 2. anon INSERT into blogs — should be DENIED if RLS is properly on
  const r2 = await anon.from("blogs").insert({ title: "__rls_probe__" });
  console.log("anon INSERT blogs:", r2.error ? "DENIED ✅ ("+r2.error.code+")" : "ALLOWED ❌ (RLS NOT protecting writes!)");
  if (!r2.error) await admin.from("blogs").delete().eq("title", "__rls_probe__");

  // 3. anon SELECT admins — should be DENIED
  const r3 = await anon.from("admins").select("id").limit(1);
  console.log("anon SELECT admins:", r3.error ? "DENIED ✅" : "ALLOWED ❌ (admins readable by public!)");

  // 4. create media bucket via service role
  const { data: b, error: be } = await admin.storage.createBucket("media", { public: true });
  console.log("create bucket media:", be ? (/exists/i.test(be.message) ? "already exists ✅" : "ERR "+be.message) : "created ✅");

  process.exit(0);
})();
