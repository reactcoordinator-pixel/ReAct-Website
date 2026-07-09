import type { NextApiRequest, NextApiResponse } from "next";
import { getBlog, updateBlog, deleteBlog } from "@/lib/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);

  if (req.method === "GET") {
    const blog = await getBlog(id);
    if (!blog) return res.status(404).json({ error: "not found" });
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ blog });
  }
  if (req.method === "PUT") {
    try {
      await updateBlog(id, req.body || {});
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  if (req.method === "DELETE") {
    try {
      await deleteBlog(id);
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.setHeader("Allow", "GET, PUT, DELETE");
  return res.status(405).json({ error: "method not allowed" });
}
