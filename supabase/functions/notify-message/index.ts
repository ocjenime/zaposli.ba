import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://zaposli.ba";

interface MessageRecord {
  id: string;
  job_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: MessageRecord;
  schema: string;
}

interface Job {
  id: string;
  title: string;
  city: string;
  client_id: string;
}

interface Bid {
  firm_id: string;
  firms: { owner_id: string; name: string } | null;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin?: boolean | null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  // Validate authorization to prevent public abuse
  const authHeader = req.headers.get("Authorization");
  const supabaseServiceRole = Deno.env.get("SB_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (supabaseServiceRole && (!authHeader || authHeader !== `Bearer ${supabaseServiceRole}`)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let payload: WebhookPayload | null = null;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (!payload || payload.type !== "INSERT" || payload.table !== "messages") {
    return new Response(JSON.stringify({ message: "Skipped" }), { status: 200 });
  }

  const message = payload.record;
  const supabaseUrl = Deno.env.get("SB_URL") || Deno.env.get("SUPABASE_URL") || "";

  if (!supabaseUrl || !supabaseServiceRole) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: jobData, error: jobError } = await supabase
    .from("jobs")
    .select("id,title,city,client_id")
    .eq("id", message.job_id)
    .single();

  if (jobError || !jobData) {
    console.error("Failed to fetch job:", jobError);
    return new Response(JSON.stringify({ message: "Job not found" }), { status: 200 });
  }

  const job = jobData as Job;

  const { data: bidData } = await supabase
    .from("bids")
    .select("firm_id, firms(owner_id, name)")
    .eq("job_id", message.job_id)
    .eq("status", "accepted")
    .single();

  const bid = bidData as Bid | null;
  const firmOwnerId = bid?.firms?.owner_id;
  const firmName = bid?.firms?.name || "Firma";

  const { data: senderData } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin")
    .eq("id", message.sender_id)
    .single();

  const senderProfile = senderData as Profile | null;
  const isAdminSender = senderProfile?.is_admin ?? false;

  const recipients: Profile[] = [];
  let senderLabel = "Korisnik";
  let subject = `Nova poruka za ${job.title} — Zaposli.ba`;
  let htmlBody = "";

  if (isAdminSender) {
    senderLabel = "Administrator";
    subject = `Administrator se uključio u razgovor: ${job.title}`;

    const [{ data: clientProfile }, { data: ownerProfile }] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name").eq("id", job.client_id).single(),
      firmOwnerId
        ? supabase.from("profiles").select("id, email, full_name").eq("id", firmOwnerId).single()
        : Promise.resolve({ data: null }),
    ]);

    if (clientProfile) recipients.push(clientProfile as Profile);
    if (ownerProfile) recipients.push(ownerProfile as Profile);

    htmlBody = `<p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
      Administrator se uključio u razgovor za posao <strong>${job.title}</strong> (${job.city}).
    </p>`;
  } else {
    let recipientId: string | null = null;
    let recipientLabel = "vas";

    if (message.sender_id === job.client_id) {
      recipientId = firmOwnerId ?? null;
      senderLabel = "Klijent";
      recipientLabel = "firmi";
    } else if (message.sender_id === firmOwnerId) {
      recipientId = job.client_id;
      senderLabel = "Firma";
      recipientLabel = "klijentu";
    }

    if (recipientId) {
      const { data: recipient } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", recipientId)
        .single();

      if (recipient) recipients.push(recipient as Profile);
    }

    htmlBody = `<p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
      ${senderLabel} vam je poslao poruku u vezi posla <strong>${job.title}</strong> (${job.city}).
    </p>`;
  }

  if (recipients.length === 0) {
    return new Response(JSON.stringify({ message: "No recipient" }), { status: 200 });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "No Resend key configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const conversationUrl = `${SITE_URL}/dashboard/razgovor/?job_id=${job.id}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
      <div style="margin-bottom: 24px;">
        <strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">${isAdminSender ? "Administrator se uključio" : "Nova poruka"}</h1>
      ${htmlBody}
      <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 16px; color: #1f1f1f; line-height: 1.5;">${message.content.replace(/\n/g, "<br>")}</p>
      </div>
      <a href="${conversationUrl}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Odgovori u razgovoru</a>
      <p style="font-size: 12px; color: #999; margin-top: 24px;">
        Ne želite primati ove emailove? Podesite obavještenja u postavkama profila na Zaposli.ba.
      </p>
    </div>
  `;

  const sentTo: string[] = [];
  let lastError: string | null = null;

  for (const profile of recipients) {
    if (!profile.email) continue;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: profile.email,
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body);
      }

      sentTo.push(profile.email);
    } catch (err) {
      console.error(`Email to ${profile.email} failed:`, err);
      lastError = String(err);
    }
  }

  if (sentTo.length === 0) {
    return new Response(JSON.stringify({ message: "Email failed", error: lastError }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Sent", recipients: sentTo }), { status: 200 });
});
