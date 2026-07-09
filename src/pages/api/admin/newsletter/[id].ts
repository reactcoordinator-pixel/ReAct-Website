import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);
  const sb = supabaseAdmin();

  if (req.method === "PUT") {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Invalid email" });
    const { error } = await sb.from("newsletter_emails").update({ email }).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }
  if (req.method === "DELETE") {
    const { error } = await sb.from("newsletter_emails").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }
  res.setHeader("Allow", "PUT, DELETE");
  return res.status(405).json({ error: "method not allowed" });
}
