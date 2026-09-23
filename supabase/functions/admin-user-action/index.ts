import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || Deno.env.get("SB_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SB_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function generatePassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: "Unauthorized or missing env" }, 401);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Verify caller with the service-role client (no anon key needed).
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
    authHeader.replace("Bearer ", "")
  );
  if (userError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return json({ error: "Forbidden" }, 403);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { action, userId, firmId, password, blocked } = body;
  if (!action || (typeof userId !== "string" && typeof firmId !== "string")) {
    return json({ error: "Missing action or target id" }, 400);
  }

  try {
    if (action === "set_password") {
      if (typeof userId !== "string") return json({ error: "Missing userId" }, 400);
      const newPassword = typeof password === "string" && password.length >= 6 ? password : generatePassword();
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
      if (error) throw error;
      return json({ success: true, password: newPassword });
    }

    if (action === "delete_user") {
      if (typeof userId !== "string") return json({ error: "Missing userId" }, 400);
      // Delete auth user; profiles/firms/jobs/bids cascade via FK ON DELETE CASCADE.
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "delete_firm") {
      if (typeof firmId !== "string") return json({ error: "Missing firmId" }, 400);
      // Best-effort: remove logo files first (paths are stored per owner).
      try {
        const { data: firm } = await supabaseAdmin
          .from("firms")
          .select("owner_id, logo_url")
          .eq("id", firmId)
          .single();
        if (firm?.owner_id) {
          const { data: files } = await supabaseAdmin.storage
            .from("firm-logos")
            .list(String(firm.owner_id));
          if (files && files.length > 0) {
            await supabaseAdmin.storage
              .from("firm-logos")
              .remove(files.map((f) => `${firm.owner_id}/${f.name}`));
          }
        }
      } catch {
        // Storage cleanup is best-effort only.
      }
      // Categories, bids, subscriptions, ads, visits cascade via FK ON DELETE CASCADE.
      const { error } = await supabaseAdmin.from("firms").delete().eq("id", firmId);
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "block_user") {
      if (typeof userId !== "string") return json({ error: "Missing userId" }, 400);
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ blocked: blocked === true })
        .eq("id", userId);
      if (error) throw error;
      return json({ success: true, blocked: blocked === true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Action failed";
    return json({ error: message }, 500);
  }
});
