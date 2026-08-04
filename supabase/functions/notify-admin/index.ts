import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "info@zaposli.ba";
const SITE_URL = Deno.env.get("SITE_URL") || "https://www.zaposli.ba";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  schema: string;
}

interface ProfileRecord {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  created_at: string;
}

interface FirmRecord {
  id: string;
  name: string | null;
  email: string | null;
  city: string | null;
  owner_id: string;
  created_at: string;
}

interface ReviewRecord {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("bs-BA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

async function sendAdminEmail(subject: string, html: string) {
  if (!RESEND_API_KEY || !ADMIN_EMAIL) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body);
    }
  } catch (err) {
    console.error("Admin email failed:", err);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  // The Supabase Edge Function runtime validates Authorization as a JWT, so the
  // service role key goes there. The simpler webhook secret is sent via the
  // X-Webhook-Secret header, which the runtime does not try to validate.
  const authHeader = req.headers.get("Authorization");
  const webhookHeader = req.headers.get("X-Webhook-Secret") || "";
  const webhookSecret = Deno.env.get("WEBHOOK_SECRET") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SB_SERVICE_ROLE_KEY") || "";
  const validWebhook = webhookSecret && webhookHeader === webhookSecret;
  const validServiceRole = serviceRoleKey && authHeader === `Bearer ${serviceRoleKey}`;
  if (!validWebhook && !validServiceRole) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let payload: WebhookPayload | null = null;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (!payload || payload.type !== "INSERT" || payload.schema !== "public") {
    return new Response(JSON.stringify({ message: "Skipped" }), { status: 200 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("SB_URL") || "";
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (payload.table === "profiles") {
    const profile = payload.record as unknown as ProfileRecord;
    const roleLabel = profile.role === "firm" ? "Firma / Majstor" : profile.role === "client" ? "Klijent" : "Korisnik";
    await sendAdminEmail(
      `Novi korisnik registriran: ${profile.email || profile.id}`,
      `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
        <div style="margin-bottom: 24px;"><strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong></div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Novi korisnik registriran</h1>
        <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Email:</strong> ${profile.email || "N/A"}</p>
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Ime:</strong> ${profile.full_name || "Nije uneseno"}</p>
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Uloga:</strong> ${roleLabel}</p>
          <p style="margin: 0; font-size: 14px; color: #555;"><strong>Registrovan:</strong> ${formatDate(profile.created_at)}</p>
        </div>
        <a href="${SITE_URL}/admin/" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Otvori admin panel</a>
      </div>
      `
    );
  } else if (payload.table === "firms") {
    const firm = payload.record as unknown as FirmRecord;
    let ownerEmail = "";
    if (firm.owner_id) {
      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", firm.owner_id)
        .single();
      ownerEmail = (data as { email?: string | null } | null)?.email || "";
    }
    await sendAdminEmail(
      `Nova firma registrirana: ${firm.name || firm.id}`,
      `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
        <div style="margin-bottom: 24px;"><strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong></div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Nova firma registrirana</h1>
        <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">${firm.name || "Nepoznata firma"}</p>
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Email:</strong> ${firm.email || ownerEmail || "N/A"}</p>
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Grad:</strong> ${firm.city || "N/A"}</p>
          <p style="margin: 0; font-size: 14px; color: #555;"><strong>Registrovana:</strong> ${formatDate(firm.created_at)}</p>
        </div>
        <a href="${SITE_URL}/admin/" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Otvori admin panel</a>
      </div>
      `
    );
  } else if (payload.table === "reviews") {
    const review = payload.record as unknown as ReviewRecord;
    const [{ data: jobData }, { data: reviewerData }] = await Promise.all([
      supabase.from("jobs").select("title").eq("id", review.job_id).single(),
      supabase.from("profiles").select("email, full_name").eq("id", review.reviewer_id).single(),
    ]);
    const jobTitle = (jobData as { title?: string } | null)?.title || review.job_id;
    const reviewer = reviewerData as { email?: string | null; full_name?: string | null } | null;
    await sendAdminEmail(
      `Nova recenzija: ${jobTitle}`,
      `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
        <div style="margin-bottom: 24px;"><strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong></div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Nova recenzija ostavljena</h1>
        <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">Posao: ${jobTitle}</p>
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Ocjena:</strong> ${review.rating} / 5</p>
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Od:</strong> ${reviewer?.full_name || reviewer?.email || review.reviewer_id}</p>
          <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;">${review.comment || "Bez komentara"}</p>
          <p style="margin: 0; font-size: 14px; color: #555;"><strong>Datum:</strong> ${formatDate(review.created_at)}</p>
        </div>
        <a href="${SITE_URL}/admin/" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Otvori admin panel</a>
      </div>
      `
    );
  }

  return new Response(JSON.stringify({ message: "Processed" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
