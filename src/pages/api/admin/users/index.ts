import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sb = supabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await sb
      .from("admins")
      .select("id, name, email, username, job_role, created_at")
      .order("created_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ users: data });
  }

  if (req.method === "POST") {
    const { name, email, username, jobRole, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const { data, error } = await sb
      .from("admins")
      .insert({
        name: name || "",
        email: email || null,
        username,
        job_role: jobRole || "",
        password_hash: bcrypt.hashSync(password, 10),
      })
      .select("id, name, email, username, job_role")
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ user: data });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method not allowed" });
}
