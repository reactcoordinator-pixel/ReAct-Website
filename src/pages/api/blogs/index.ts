import type { NextApiRequest, NextApiResponse } from "next";
import { getBlogs, createBlog } from "@/lib/data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const blogs = await getBlogs();
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ blogs });
  }
  if (req.method === "POST") {
    try {
      const blog = await createBlog(req.body || {});
      return res.status(201).json({ blog });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method not allowed" });
}
