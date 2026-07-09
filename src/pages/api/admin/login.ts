import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/admin/login { username, password }
 * Verifies against the Supabase `admins` table using bcrypt (hash never leaves
 * the server). Returns the admin's public profile on success.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const { data: admin, error } = await supabaseAdmin()
    .from("admins")
    .select("id, name, email, username, job_role, password_hash")
    .eq("username", username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: "Login failed. Try again." });
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  return res.status(200).json({
    ok: true,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      username: admin.username,
      jobRole: admin.job_role,
    },
  });
}
