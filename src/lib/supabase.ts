import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * Browser / public client — uses the anon key. RLS allows public reads of
 * cms/blogs/projects and public inserts for newsletter + contact only.
 */
export const supabase: SupabaseClient = createClient(url, anonKey, {
  auth: { persistSession: false },
});

/**
 * Server-only admin client — uses the service_role key, which bypasses RLS.
 * NEVER import this into client components. Only call from getServerSideProps,
 * getStaticProps, or API routes.
 */
export function supabaseAdmin(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
