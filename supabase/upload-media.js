/**
 * Upload public/ images into the Supabase `media` bucket, then point the CMS
 * records at the resulting public URLs. Also (re)sets the `admin` password.
 * Idempotent: re-running overwrites the same storage paths + fields.
 *
 * Usage: node supabase/upload-media.js
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

for (const f of [".env", ".env.local"]) {
  if (fs.existsSync(f))
    for (const line of fs.readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const BUCKET = "media";
const CT = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

// public file  ->  storage path
const FILES = [
  "hero-home.jpg",
  "Introduction.jpg",
  "about.jpg",
  "missing-vision.jpg",
  "section.jpeg",
  "logo.png",
  "logo-white.png",
  "placeholder.jpg",
];

async function upload(name) {
  const local = path.join("public", name);
  if (!fs.existsSync(local)) {
    console.log(`  ⚠️  skip (not found): ${name}`);
    return null;
  }
  const ext = path.extname(name).toLowerCase();
  const dest = `site/${name}`;
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(dest, fs.readFileSync(local), {
      contentType: CT[ext] || "application/octet-stream",
      upsert: true,
    });
  if (error) throw new Error(`upload ${name}: ${error.message}`);
  const { data } = sb.storage.from(BUCKET).getPublicUrl(dest);
  console.log(`  ✅ ${name} -> ${data.publicUrl}`);
  return data.publicUrl;
}

// set a nested "a.b.c" field on an object (mutates)
function setPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

async function updateCms(id, updates) {
  const { data: row, error } = await sb.from("cms").select("data").eq("id", id).single();
  if (error) throw new Error(`load cms/${id}: ${error.message}`);
  const data = row.data || {};
  for (const [field, value] of Object.entries(updates)) setPath(data, field, value);
  const { error: ue } = await sb.from("cms").update({ data }).eq("id", id);
  if (ue) throw new Error(`update cms/${id}: ${ue.message}`);
  console.log(`  ✅ cms/${id}: ${Object.keys(updates).join(", ")}`);
}

(async () => {
  console.log("Uploading images to Supabase Storage…");
  const url = {};
  for (const f of FILES) url[f] = await upload(f);

  console.log("\nWiring CMS image fields…");
  await updateCms("homepage", {
    "hero.backgroundImage": url["hero-home.jpg"],
    "introduction.image": url["Introduction.jpg"],
    "aboutUs.mainImage": url["about.jpg"],
    "aboutUs.headerImage": url["missing-vision.jpg"],
  });
  await updateCms("navigation", { logo: url["logo.png"] });
  await updateCms("contact", { "hero.image": url["section.jpeg"] });

  console.log("\nSetting admin account…");
  const { error: ae } = await sb
    .from("admins")
    .update({ password_hash: bcrypt.hashSync("Admin123", 10), name: "Admin" })
    .eq("username", "admin");
  if (ae) throw new Error(`admin update: ${ae.message}`);
  console.log("  ✅ admin / Admin123");

  console.log("\n🎉 Done.");
  process.exit(0);
})().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
