import { supabase, supabaseAdmin } from "./supabase";

/**
 * Data access layer. Server helpers (getServerSideProps / API routes) use the
 * admin client; public mutations from the browser use the anon client.
 * DB is snake_case; we map to the camelCase shapes the UI already expects.
 */

// ---- shared row mappers -----------------------------------------------------
const mapBlog = (r: any) => ({
  id: r.id,
  title: r.title,
  subtitle: r.subtitle,
  about: r.about,
  category: r.category,
  imageUrl: r.image_url,
  createdAt: r.created_at,
});

const mapProject = (r: any) => ({
  id: r.id,
  title: r.title,
  subtitle: r.subtitle,
  description: r.description,
  about: r.about,
  imageUrl: r.image_url,
  createdAt: r.created_at,
});

// ---- CMS (server read) ------------------------------------------------------
export async function getCms(id: string): Promise<any | null> {
  const { data, error } = await supabaseAdmin()
    .from("cms")
    .select("data")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getCms", id, error.message);
    return null;
  }
  return data?.data ?? null;
}

export async function saveCms(id: string, data: any): Promise<boolean> {
  const { error } = await supabaseAdmin().from("cms").upsert({ id, data });
  if (error) {
    console.error("saveCms", id, error.message);
    return false;
  }
  return true;
}

// ---- Blogs ------------------------------------------------------------------
export async function getBlogs() {
  const { data, error } = await supabaseAdmin()
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getBlogs", error.message);
    return [];
  }
  return (data ?? []).map(mapBlog);
}

export async function getBlog(id: string) {
  const { data, error } = await supabaseAdmin()
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapBlog(data);
}

// ---- Projects ---------------------------------------------------------------
export async function getProjects() {
  const { data, error } = await supabaseAdmin()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProjects", error.message);
    return [];
  }
  return (data ?? []).map(mapProject);
}

export async function getProject(id: string) {
  const { data, error } = await supabaseAdmin()
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapProject(data);
}

// ---- Public mutations (anon client, allowed by RLS) -------------------------
export async function subscribeNewsletter(email: string) {
  const { error } = await supabase
    .from("newsletter_emails")
    .insert({ email: email.trim().toLowerCase() });
  // unique-violation just means already subscribed — treat as success
  if (error && !/duplicate|unique/i.test(error.message)) {
    console.error("subscribeNewsletter", error.message);
    return false;
  }
  return true;
}

export async function sendContactMessage(msg: {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  message?: string;
}) {
  const { error } = await supabase.from("contact_messages").insert(msg);
  if (error) {
    console.error("sendContactMessage", error.message);
    return false;
  }
  return true;
}

// ---- Admin writes (server-side, service role) -------------------------------
const toBlogRow = (d: any) => ({
  title: d.title ?? "",
  subtitle: d.subtitle ?? "",
  about: d.about ?? "",
  category: d.category ?? "",
  image_url: d.imageUrl ?? null,
});

const toProjectRow = (d: any) => ({
  title: d.title ?? "",
  subtitle: d.subtitle ?? "",
  description: d.description ?? "",
  about: d.about ?? "",
  image_url: d.imageUrl ?? null,
});

export async function createBlog(data: any) {
  const { data: row, error } = await supabaseAdmin()
    .from("blogs")
    .insert(toBlogRow(data))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapBlog(row);
}

export async function updateBlog(id: string, data: any) {
  const { error } = await supabaseAdmin()
    .from("blogs")
    .update(toBlogRow(data))
    .eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteBlog(id: string) {
  const { error } = await supabaseAdmin().from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function createProject(data: any) {
  const { data: row, error } = await supabaseAdmin()
    .from("projects")
    .insert(toProjectRow(data))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapProject(row);
}

export async function updateProject(id: string, data: any) {
  const { error } = await supabaseAdmin()
    .from("projects")
    .update(toProjectRow(data))
    .eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin().from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
