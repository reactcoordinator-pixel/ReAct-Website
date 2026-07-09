// Client-side data helpers — now backed by Supabase via our API routes
// (formerly direct Firebase Firestore reads).

async function apiGet(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("apiGet failed:", url, e);
    return null;
  }
}

async function getDocById(docId, collectionName) {
  if (collectionName === "service") {
    const j = await apiGet(`/api/projects/${docId}`);
    return j?.project || null;
  }
  if (collectionName === "blogs") {
    const j = await apiGet(`/api/blogs/${docId}`);
    return j?.blog || null;
  }
  // CMS documents (homepage, navigation, contact, privacy, socialLinks, ...)
  const j = await apiGet(`/api/cms/${docId}`);
  return j?.data || null;
}

async function getBlogs() {
  const j = await apiGet("/api/blogs");
  return j?.blogs || [];
}

async function getService() {
  const j = await apiGet("/api/projects");
  return j?.projects || [];
}

async function getEmails() {
  const j = await apiGet("/api/admin/newsletter");
  return j?.emails || [];
}

async function getInbox() {
  const j = await apiGet("/api/admin/contact");
  return j?.messages || [];
}

export { getDocById, getEmails, getBlogs, getInbox, getService };
