import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET  /api/cms/:id  -> { data } (the JSONB content for that page/section)
 * POST /api/cms/:id  -> save { data } back
 * All access is server-side via the service_role key.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "missing id" });

  const sb = supabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await sb
      .from("cms")
      .select("data")
      .eq("id", id)
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "not found" });
    // cache at the edge briefly; content is not user-specific
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ data: data.data });
  }

  if (req.method === "POST") {
    const body = req.body?.data ?? req.body;
    const { error } = await sb.from("cms").upsert({ id, data: body });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method not allowed" });
}
