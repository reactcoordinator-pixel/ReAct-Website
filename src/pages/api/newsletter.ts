import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";

// Public newsletter signup
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const { error } = await supabaseAdmin()
    .from("newsletter_emails")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
