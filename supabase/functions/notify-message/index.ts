import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://ocjenime.github.io/zaposli.ba";

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
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
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
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

  let recipientId: string | null = null;
  let senderLabel = "Korisnik";
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

  if (!recipientId) {
    return new Response(JSON.stringify({ message: "No recipient" }), { status: 200 });
  }

  const { data: recipient } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", recipientId)
    .single();

  if (!recipient || !recipient.email) {
    return new Response(JSON.stringify({ message: "No recipient email" }), { status: 200 });
  }

  const profile = recipient as Profile;

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ message: "No Resend key configured" }), { status: 200 });
  }

  const conversationUrl = `${SITE_URL}/dashboard/razgovor/?job_id=${job.id}`;
  const subject = `Nova poruka za ${job.title} — Zaposli.ba`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
      <div style="margin-bottom: 24px;">
        <strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Nova poruka</h1>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
        ${senderLabel} vam je poslao poruku u vezi posla <strong>${job.title}</strong> (${job.city}).
      </p>
      <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 16px; color: #1f1f1f; line-height: 1.5;">${message.content.replace(/\n/g, "<br>")}</p>
      </div>
      <a href="${conversationUrl}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Odgovori u razgovoru</a>
      <p style="font-size: 12px; color: #999; margin-top: 24px;">
        Ne želite primati ove emailove? Podesite obavještenja u postavkama profila na Zaposli.ba.
      </p>
    </div>
  `;

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

    return new Response(JSON.stringify({ message: "Sent" }), { status: 200 });
  } catch (err) {
    console.error("Email failed:", err);
    return new Response(JSON.stringify({ message: "Email failed", error: String(err) }), { status: 500 });
  }
});
