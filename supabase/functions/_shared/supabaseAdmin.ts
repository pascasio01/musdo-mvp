import { createClient } from "npm:@supabase/supabase-js@^2.45.0";

// Service-role client: bypasses RLS. Used ONLY inside trusted Edge Functions
// (never shipped to the browser) to write membership + invoice rows that the
// client is forbidden to write directly.
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Resolve the calling user from their Supabase access token (the JWT that
// supabase.functions.invoke attaches as the Authorization header).
export async function getUserFromRequest(
  req: Request,
): Promise<{ id: string; email: string | null } | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}
