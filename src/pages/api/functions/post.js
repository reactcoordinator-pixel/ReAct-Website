// Client-side write helpers — now backed by Supabase via our API routes
// (formerly direct Firebase Firestore writes).

// map the old Firestore collection names to our REST resources
const RESOURCE = { blogs: "blogs", service: "projects" };

function resourceFor(collectionName) {
  const r = RESOURCE[collectionName];
  if (!r) throw new Error(`Unknown collection: ${collectionName}`);
  return r;
}

async function postDoc(data, collectionName) {
  try {
    const res = await fetch(`/api/${resourceFor(collectionName)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (error) {
    console.error("Error posting document:", error);
    return false;
  }
}

async function updateDoc(collectionName, docId, data) {
  try {
    const res = await fetch(`/api/${resourceFor(collectionName)}/${docId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}

async function deleteDocument(collectionName, docId) {
  try {
    const res = await fetch(`/api/${resourceFor(collectionName)}/${docId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
}

export { updateDoc, postDoc, deleteDocument };
