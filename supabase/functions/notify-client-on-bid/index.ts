import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "info@zaposli.ba";
const SITE_URL = Deno.env.get("SITE_URL") || "https://www.zaposli.ba";

interface BidRecord {
  id: string;
  job_id: string;
  firm_id: string;
  amount: number;
  message: string | null;
  status: string;
  created_at: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: BidRecord;
  schema: string;
}

interface Job {
  id: string;
  title: string;
  city: string;
  client_id: string;
}

interface Firm {
  id: string;
  name: string | null;
  city: string | null;
  logo_url: string | null;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
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

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

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

  if (!payload || payload.type !== "INSERT" || payload.table !== "bids") {
    return new Response(JSON.stringify({ message: "Skipped" }), { status: 200 });
  }

  const bid = payload.record;

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("SB_URL") || "";
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Fetch job and client
  const [{ data: jobData }, { data: firmData }, { data: clientData }] = await Promise.all([
    supabase.from("jobs").select("id,title,city,client_id").eq("id", bid.job_id).single(),
    supabase.from("firms").select("id,name,city,logo_url").eq("id", bid.firm_id).single(),
    supabase
      .from("jobs")
      .select("client_id, profiles(email, full_name)")
      .eq("id", bid.job_id)
      .single()
      .then((res) => {
        const typed = res.data as unknown as { client_id: string; profiles: Profile | null } | null;
        return { data: typed?.profiles };
      }),
  ]);

  const job = jobData as Job | null;
  const firm = firmData as Firm | null;
  const client = clientData as Profile | null;

  if (!job || !client?.email) {
    return new Response(JSON.stringify({ message: "No client email found" }), { status: 200 });
  }

  const clientDashboardUrl = `${SITE_URL}/dashboard/poslovi/?id=${job.id}`;
  const firmName = firm?.name || "Firma";
  const firmCity = firm?.city || "BiH";
  const amount = bid.amount.toLocaleString("bs-BA");
  const message = bid.message?.trim() || "Firma nije ostavila poruku.";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
      <div style="margin-bottom: 24px;">
        <strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Stigla je nova ponuda!</h1>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
        Poštovani ${client.full_name || ""},<br><br>
        Firma <strong>${firmName}</strong> iz ${firmCity} poslala je ponudu za vaš posao <strong>${job.title}</strong>.
      </p>
      <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">${job.title}</p>
        <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;">${job.city}</p>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px;">
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Firma:</strong> ${firmName}</p>
          <p style="margin: 0 0 8px; font-size: 16px;"><strong>Iznos ponude:</strong> ${amount} KM</p>
          <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;"><strong>Poruka:</strong> ${message}</p>
        </div>
      </div>
      <a href="${clientDashboardUrl}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Pogledaj ponude</a>
      <p style="font-size: 12px; color: #999; margin-top: 24px;">
        Ponuda je poslana ${formatDate(bid.created_at)}. Ne želite primati ove emailove? Podesite obavještenja u postavkama profila.
      </p>
    </div>
  `;

  const subject = `Nova ponuda za ${job.title} — ${amount} KM`;
  const sentTo: string[] = [];
  let lastError: string | null = null;

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "No Resend key configured" }), { status: 500 });
  }

  // Send to client
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: client.email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body);
    }
    sentTo.push(client.email);
  } catch (err) {
    console.error(`Client email failed for ${client.email}:`, err);
    lastError = String(err);
  }

  // Optional: send a copy to admin
  if (ADMIN_EMAIL && ADMIN_EMAIL !== client.email) {
    try {
      const adminHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
          <div style="margin-bottom: 24px;"><strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong></div>
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Nova ponuda poslana</h1>
          <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 16px;"><strong>Posao:</strong> ${job.title}</p>
            <p style="margin: 0 0 8px; font-size: 16px;"><strong>Klijent:</strong> ${client.email}</p>
            <p style="margin: 0 0 8px; font-size: 16px;"><strong>Firma:</strong> ${firmName}</p>
            <p style="margin: 0 0 8px; font-size: 16px;"><strong>Iznos:</strong> ${amount} KM</p>
            <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;"><strong>Poruka:</strong> ${message}</p>
          </div>
          <a href="${clientDashboardUrl}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Pogledaj u adminu</a>
        </div>
      `;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `[Admin] Nova ponuda: ${job.title}`,
          html: adminHtml,
        }),
      });
    } catch (err) {
      console.error("Admin copy failed:", err);
    }
  }

  if (sentTo.length === 0) {
    return new Response(JSON.stringify({ message: "Email failed", error: lastError }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Sent", recipients: sentTo }), { status: 200 });
});
