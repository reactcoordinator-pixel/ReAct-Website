import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);
  const sb = supabaseAdmin();

  if (req.method === "PUT") {
    const { name, email, username, jobRole, password } = req.body || {};
    const patch: Record<string, any> = {
      name: name || "",
      email: email || null,
      username,
      job_role: jobRole || "",
    };
    // only update the password when a new one is provided
    if (password) patch.password_hash = bcrypt.hashSync(password, 10);
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
