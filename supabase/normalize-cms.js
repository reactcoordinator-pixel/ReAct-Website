/**
 * One-off cleanup: fold any object keys that contain a "." into their proper
 * nested path across every row in the `cms` table.
 *
 * Background: an earlier bug in updateContent() stored dotted sections
 * (e.g. "contactInfo.phone") as a literal top-level key instead of nesting
 * under contactInfo.phone. This normalizes those rows in place.
 *
 * IMPORTANT: only KEY names are ever split. Values are copied verbatim, so a
 * phone number like "+60 12-345 6789" is preserved exactly (spaces / hyphens
 * and all). Dotted-key data wins on leaf conflicts, since it represents the
 * edit the user most recently attempted (the one that appeared "lost").
 *
 * Usage:
 *   node supabase/normalize-cms.js            apply the fix in place
 *   DRY_RUN=1 node supabase/normalize-cms.js  preview only, no writes
 * (reads .env / .env.local)
 */
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

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
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set.");
  process.exit(1);
}

const isPlainObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

/** Deep-merge `source` into `target`; leaf values from source win. */
function deepMerge(target, source) {
  for (const k of Object.keys(source)) {
    if (isPlainObject(source[k])) {
      if (!isPlainObject(target[k])) target[k] = {};
      deepMerge(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
  return target;
}

/**
 * Recursively rebuild an object so that any key containing "." is nested.
 * Returns { value, changed }.
 */
function normalize(node) {
  if (Array.isArray(node)) {
    let changed = false;
    const out = node.map((item) => {
      const r = normalize(item);
      if (r.changed) changed = true;
      return r.value;
    });
    return { value: out, changed };
  }
  if (!isPlainObject(node)) return { value: node, changed: false };

  const result = {};
  const dottedKeys = [];
  let changed = false;

  // First pass: normalize children and separate dotted keys.
  for (const key of Object.keys(node)) {
    const child = normalize(node[key]);
    if (child.changed) changed = true;
    if (key.includes(".")) {
      dottedKeys.push([key, child.value]);
      changed = true;
    } else {
      result[key] = child.value;
    }
  }

  // Second pass: fold dotted keys into their nested location.
  for (const [key, val] of dottedKeys) {
    const parts = key.split(".").filter(Boolean);
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!isPlainObject(cur[parts[i]])) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    const leaf = parts[parts.length - 1];
    if (isPlainObject(val) && isPlainObject(cur[leaf])) {
      deepMerge(cur[leaf], val);
    } else {
      cur[leaf] = val;
    }
  }

  return { value: result, changed };
}

const DRY_RUN = !!process.env.DRY_RUN;

/** Collect the dotted key paths inside a node, for reporting. */
function findDottedKeys(node, trail = "", out = []) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => findDottedKeys(item, `${trail}[${i}]`, out));
  } else if (isPlainObject(node)) {
    for (const key of Object.keys(node)) {
      const here = trail ? `${trail}.${key}` : key;
      if (key.includes(".")) out.push(here);
      findDottedKeys(node[key], here, out);
    }
  }
  return out;
}

(async () => {
  const sb = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

  const { data: rows, error } = await sb.from("cms").select("id, data");
  if (error) {
    console.error("❌ Failed to read cms rows:", error.message);
    process.exit(1);
  }

  if (DRY_RUN) console.log("— DRY RUN: no rows will be written —\n");

  let fixed = 0;
  for (const row of rows || []) {
    const { value, changed } = normalize(row.data);
    if (!changed) {
      console.log(`•  ${row.id}: already clean`);
      continue;
    }
    const stray = findDottedKeys(row.data);
    console.log(`${DRY_RUN ? "→" : "✅"} ${row.id}: ${stray.length} stray key(s) → ${stray.join(", ")}`);

    if (DRY_RUN) {
      fixed++;
      continue;
    }
    const { error: upErr } = await sb
      .from("cms")
      .update({ data: value })
      .eq("id", row.id);
    if (upErr) {
      console.error(`❌ ${row.id}: update failed — ${upErr.message}`);
      continue;
    }
    fixed++;
  }

  console.log(
    `\nDone. ${fixed} row(s) ${DRY_RUN ? "would be" : ""} normalized, ${(rows || []).length} scanned.`,
  );
  process.exit(0);
})();
