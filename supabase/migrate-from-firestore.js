/**
 * One-shot migration: live Firestore  ->  Supabase.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/migrate-from-firestore.js
 *
 * Idempotent-ish: cms + admins upsert; blogs/projects/emails de-dupe on re-run
 * by clearing those tables first (safe because Firestore is the source of truth
 * during migration). Run AFTER schema.sql has been applied.
 */
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const fs = require("fs");

// load .env / .env.local if present
for (const f of [".env", ".env.local"]) {
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyBqRTkZ3gCslH4eStIsLoObIQAn6jrIbEs",
  authDomain: "reactmalaysia-6b2a1.firebaseapp.com",
  projectId: "reactmalaysia-6b2a1",
  storageBucket: "reactmalaysia-6b2a1.appspot.com",
  messagingSenderId: "864760495911",
  appId: "1:864760495911:web:66f65f4ac87b2fe0a3b302",
};

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("❌ Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const fb = getFirestore(initializeApp(firebaseConfig));
const sb = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

async function fsAll(name) {
  const snap = await getDocs(collection(fb, name));
  return snap.docs.map((d) => ({ __id: d.id, ...d.data() }));
}

async function migrateCms() {
  const docs = await fsAll("cms");
  for (const d of docs) {
    const { __id, ...data } = d;
    const { error } = await sb.from("cms").upsert({ id: __id, data });
    if (error) throw new Error(`cms/${__id}: ${error.message}`);
  }
  console.log(`✅ cms: ${docs.length}`);
}

async function migrateBlogs() {
  const docs = await fsAll("blogs");
  await sb.from("blogs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const rows = docs.map((d) => ({
    title: d.title || "",
    subtitle: d.subtitle || "",
    about: d.about || "",
    category: d.category || "",
    image_url: d.imageUrl || null,
  }));
  if (rows.length) {
    const { error } = await sb.from("blogs").insert(rows);
    if (error) throw new Error(`blogs: ${error.message}`);
  }
  console.log(`✅ blogs: ${rows.length}`);
}

async function migrateProjects() {
  const docs = await fsAll("service");
  await sb.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const rows = docs.map((d) => ({
    title: d.title || "",
    subtitle: d.subtitle || "",
    description: d.description || "",
    about: d.about || "",
    image_url: d.imageUrl || null,
  }));
  if (rows.length) {
    const { error } = await sb.from("projects").insert(rows);
    if (error) throw new Error(`projects: ${error.message}`);
  }
  console.log(`✅ projects: ${rows.length}`);
}

async function migrateEmails() {
  const docs = await fsAll("emails");
  const seen = new Set();
  const rows = [];
  for (const d of docs) {
    const email = (d.email || "").trim().toLowerCase();
    if (email && !seen.has(email)) {
      seen.add(email);
      rows.push({ email });
    }
  }
  if (rows.length) {
    const { error } = await sb
      .from("newsletter_emails")
      .upsert(rows, { onConflict: "email", ignoreDuplicates: true });
    if (error) throw new Error(`newsletter_emails: ${error.message}`);
  }
  console.log(`✅ newsletter_emails: ${rows.length}`);
}

async function migrateInbox() {
  const docs = await fsAll("inbox");
  const rows = docs.map((d) => ({
    name: d.name || null,
    email: d.email || null,
    phone: d.phone || null,
    organization: d.organization || null,
    message: d.message || d.body || null,
  }));
  if (rows.length) {
    const { error } = await sb.from("contact_messages").insert(rows);
    if (error) throw new Error(`contact_messages: ${error.message}`);
  }
  console.log(`✅ contact_messages: ${rows.length}`);
}

async function migrateAdmins() {
  const docs = await fsAll("admins");
  const rows = [];
  const seen = new Set();
  for (const d of docs) {
    if (!d.username || seen.has(d.username.toLowerCase())) continue;
    seen.add(d.username.toLowerCase());
    rows.push({
      username: d.username,
      email: d.email || null,
      name: d.name || "",
      job_role: d.jobRole || "",
      password_hash: bcrypt.hashSync(d.password || "changeme123", 10),
    });
  }
  // Seeded dummy admin (change the password after first login)
  if (!seen.has("admin")) {
    rows.push({
      username: "admin",
      email: "admin@reactmalaysia.org",
      name: "ReAct Admin",
      job_role: "Administrator",
      password_hash: bcrypt.hashSync("react-admin-2026", 10),
    });
  }
  const { error } = await sb
    .from("admins")
    .upsert(rows, { onConflict: "username" });
  if (error) throw new Error(`admins: ${error.message}`);
  console.log(
    `✅ admins: ${rows.length} rows (incl. seeded 'admin' / react-admin-2026)`,
  );
}

(async () => {
  try {
    console.log("Migrating Firestore → Supabase…\n");
    await migrateCms();
    await migrateBlogs();
    await migrateProjects();
    await migrateEmails();
    await migrateInbox();
    await migrateAdmins();
    console.log("\n🎉 Migration complete.");
    process.exit(0);
  } catch (e) {
    console.error("\n❌ Migration failed:", e.message);
    process.exit(1);
  }
})();
