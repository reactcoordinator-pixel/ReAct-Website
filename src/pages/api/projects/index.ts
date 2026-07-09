import type { NextApiRequest, NextApiResponse } from "next";
import { getProjects, createProject } from "@/lib/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const projects = await getProjects();
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ projects });
  }
  if (req.method === "POST") {
    try {
      const project = await createProject(req.body || {});
      return res.status(201).json({ project });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method not allowed" });
}
