import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabaseAdmin()
    .from("newsletter_emails")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ emails: data });
}
