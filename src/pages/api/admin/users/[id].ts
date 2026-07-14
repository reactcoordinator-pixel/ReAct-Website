import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);
  const sb = supabaseAdmin();

  if (req.method === "PUT") {
    const { name, email, username, jobRole, password } = req.body || {};
    // Build a PARTIAL patch: only touch fields that were actually sent. This
    // lets the "Change Password" modal send just { password } without wiping
    // the admin's name/username/email, while the full edit form still updates
    // everything it submits.
    const patch: Record<string, any> = {};
    if (name !== undefined) patch.name = name || "";
    if (email !== undefined) patch.email = email || null;
    if (username !== undefined) patch.username = username;
    if (jobRole !== undefined) patch.job_role = jobRole || "";
    if (password) patch.password_hash = bcrypt.hashSync(password, 10);

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }
    const { error } = await sb.from("admins").update(patch).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }
  if (req.method === "DELETE") {
    const { error } = await sb.from("admins").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }
  res.setHeader("Allow", "PUT, DELETE");
  return res.status(405).json({ error: "method not allowed" });
}
