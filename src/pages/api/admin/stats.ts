import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const sb = supabaseAdmin();
  const count = async (t: string) => {
    const { count } = await sb.from(t).select("*", { count: "exact", head: true });
    return count || 0;
  };
  const [blogs, projects, subscribers, messages, admins] = await Promise.all([
    count("blogs"),
    count("projects"),
    count("newsletter_emails"),
    count("contact_messages"),
    count("admins"),
  ]);
  res.status(200).json({ blogs, projects, subscribers, messages, admins });
}
