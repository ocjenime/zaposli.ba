import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://www.zaposli.ba";

interface JobRecord {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  category_slug: string;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  client_id: string;
}

interface FirmRow {
  id: string;
  name: string;
  email: string;
  owner_id: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: JobRecord;
  schema: string;
}

function formatBudget(mode: string | null, min: number | null, max: number | null) {
  if (mode === "open") return "Klijent želi da majstori predlože cijenu";
  if (min && max) return `${min.toLocaleString("bs-BA")} – ${max.toLocaleString("bs-BA")} KM`;
  if (min) return `od ${min.toLocaleString("bs-BA")} KM`;
  if (max) return `do ${max.toLocaleString("bs-BA")} KM`;
  return "po dogovoru";
}

Deno.serve(async (req: Request) => {
  // Only accept POST requests from Supabase webhooks or authorized callers.
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  // Validate authorization to prevent public abuse
  const authHeader = req.headers.get("Authorization");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SB_SERVICE_ROLE_KEY") || "";
  if (serviceRoleKey && (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let payload: WebhookPayload | null = null;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (!payload || payload.type !== "INSERT" || payload.table !== "jobs") {
    return new Response(JSON.stringify({ message: "Skipped" }), { status: 200 });
  }

  const job = payload.record;
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("SB_URL") || "";
  const supabaseServiceRole = serviceRoleKey;

  if (!supabaseUrl || !supabaseServiceRole) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find firms that cover this category and have email notifications enabled.
  const { data: firms, error: firmsError } = await supabase
    .from("firm_categories")
    .select("firm_id, firms(id, name, email, owner_id)")
    .eq("category_slug", job.category_slug)
    .eq("email_enabled", true);

  if (firmsError) {
    console.error("Failed to fetch firms:", firmsError);
    return new Response(JSON.stringify({ error: "Failed to fetch firms" }), { status: 500 });
  }

  const recipients: FirmRow[] = [];
  for (const row of (firms as unknown as Array<{ firm_id: string; firms: FirmRow | null }>) || []) {
    if (row.firms?.email) {
      recipients.push({
        id: row.firms.id,
        name: row.firms.name,
        email: row.firms.email,
        owner_id: row.firms.owner_id,
      });
    }
  }

  if (recipients.length === 0) {
    return new Response(JSON.stringify({ message: "No recipients" }), { status: 200 });
  }

  // Get category display name from lookup table if it exists.
  let categoryName = job.category_slug;
  try {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("name")
      .eq("slug", job.category_slug)
      .maybeSingle();
    if (categoryData && (categoryData as { name?: string }).name) {
      categoryName = (categoryData as { name: string }).name;
    }
  } catch {
    categoryName = job.category_slug;
  }
  const dashboardUrl = `${SITE_URL}/dashboard/firma/`;

  const results: { email: string; status: "sent" | "skipped" | "error"; error?: string }[] = [];

  for (const firm of recipients) {
    if (!RESEND_API_KEY) {
      results.push({ email: firm.email, status: "skipped" });
      continue;
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: firm.email,
          subject: `Novi posao u kategoriji ${categoryName} — Zaposli.ba`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
              <div style="margin-bottom: 24px;">
                <strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong>
              </div>
              <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Novi posao za vas</h1>
              <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
                Poštovani ${firm.name},<br><br>
                Objavljen je novi posao u kategoriji <strong>${categoryName}</strong>. Ako želite poslati ponudu, kliknite na dugme ispod.
              </p>
              <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">${job.title}</p>
                <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;">${job.description ? job.description.slice(0, 180) + (job.description.length > 180 ? "..." : "") : ""}</p>
                <p style="margin: 0; font-size: 14px; color: #555;">
                  <strong>Grad:</strong> ${job.city || "nepoznato"}<br>
                  <strong>Budžet:</strong> ${formatBudget(job.budget_mode, job.budget_min, job.budget_max)}
                </p>
              </div>
              <a href="${dashboardUrl}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Pogledaj posao i pošalji ponudu</a>
              <p style="font-size: 12px; color: #999; margin-top: 24px;">
                Ne želite primati ove emailove? Uključite/isključite obavještenja u postavkama profila na Zaposli.ba.
              </p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body);
      }

      results.push({ email: firm.email, status: "sent" });
    } catch (err) {
      console.error(`Email failed for ${firm.email}:`, err);
      results.push({ email: firm.email, status: "error", error: String(err) });
    }
  }

  return new Response(JSON.stringify({ message: "Processed", recipients: results.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
