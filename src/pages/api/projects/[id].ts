import type { NextApiRequest, NextApiResponse } from "next";
import { getProject, updateProject, deleteProject } from "@/lib/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);

  if (req.method === "GET") {
    const project = await getProject(id);
    if (!project) return res.status(404).json({ error: "not found" });
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ project });
  }
  if (req.method === "PUT") {
    try {
      await updateProject(id, req.body || {});
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  if (req.method === "DELETE") {
    try {
      await deleteProject(id);
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.setHeader("Allow", "GET, PUT, DELETE");
  return res.status(405).json({ error: "method not allowed" });
}
