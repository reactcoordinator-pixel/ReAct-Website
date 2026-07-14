import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { supabaseAdmin } from "@/lib/supabase";

export const config = { api: { bodyParser: false } };

const EXT_CT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/**
 * POST /api/upload  (multipart/form-data, field "image")
 * Uploads to the Supabase `media` bucket and returns { success, url }.
 * Matches the old cPanel uploader's response shape so callers just swap the URL.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "method not allowed" });
  }

  try {
    const form = formidable({ maxFileSize: 15 * 1024 * 1024 });
    const [, files] = await form.parse(req);
    const f = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!f) return res.status(400).json({ success: false, error: "No file" });

    const origName = f.originalFilename || "upload";
    const ext = (origName.split(".").pop() || "jpg").toLowerCase();
    const contentType = f.mimetype || EXT_CT[ext] || "application/octet-stream";
    // unique-ish path without Date.now/Math.random (safe in all envs)
    const base = origName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
    const dest = `uploads/${base}-${f.newFilename}.${ext}`;

    const buffer = fs.readFileSync(f.filepath);
    const sb = supabaseAdmin();
    const { error } = await sb.storage
      .from("media")
      // cache for a year at the CDN + browser; paths are unique per upload so
      // stale cache is never an issue and repeat views are instant.
      .upload(dest, buffer, {
        contentType,
        upsert: true,
        cacheControl: "31536000",
      });
    if (error) throw new Error(error.message);

    const { data } = sb.storage.from("media").getPublicUrl(dest);
    return res.status(200).json({ success: true, url: data.publicUrl });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
