import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "info@zaposli.ba";
const SITE_URL = Deno.env.get("SITE_URL") || "https://www.zaposli.ba";

interface JobRecord {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  client_id: string;
  target_firm_id: string | null;
  private_status: string | null;
  status: string | null;
  is_private: boolean;
  client_question: string | null;
  problem_reported: boolean;
  problem_description: string | null;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  created_at: string;
  completed_at: string | null;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: JobRecord;
  old_record?: JobRecord | null;
  schema: string;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
}

interface Firm {
  id: string;
  name: string | null;
  email: string | null;
  owner_id: string;
}

interface EmailResult {
  to: string;
  status: "sent" | "error" | "skipped";
  error?: string;
}

function emailWrapper(heading: string, body: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
      <div style="margin-bottom: 24px;">
        <strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">${heading}</h1>
      ${body}
      <p style="font-size: 12px; color: #999; margin-top: 24px;">
        Ne želite primati ove emailove? Podesite obavještenja u postavkama profila na Zaposli.ba.
      </p>
    </div>
  `;
}

function jobCard(title: string, details: string) {
  return `
    <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">${title}</p>
      ${details}
    </div>
  `;
}

function ctaButton(url: string, text: string) {
  return `
    <a href="${url}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">${text}</a>
  `;
}

function formatBudget(mode: string | null, min: number | null, max: number | null) {
  if (mode === "open") return "Klijent želi da majstori predlože cijenu";
  if (min && max) return `${min.toLocaleString("bs-BA")} – ${max.toLocaleString("bs-BA")} KM`;
  if (min) return `od ${min.toLocaleString("bs-BA")} KM`;
  if (max) return `do ${max.toLocaleString("bs-BA")} KM`;
  return "po dogovoru";
}

async function sendResendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    return { to, status: "skipped" };
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
        to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body);
    }
    return { to, status: "sent" };
  } catch (err) {
    console.error(`Email failed for ${to}:`, err);
    return { to, status: "error", error: String(err) };
  }
}

async function insertNotification(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  type: string,
  title: string,
  message: string,
  jobId: string
) {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title,
      message,
      job_id: jobId,
    });
  } catch (err) {
    console.error("Failed to insert notification:", err);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const webhookHeader = req.headers.get("X-Webhook-Secret") || "";
  const webhookSecret = Deno.env.get("WEBHOOK_SECRET") || "";
  if (!webhookSecret || webhookHeader !== webhookSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let payload: WebhookPayload | null = null;
  try {
    payload = (await req.json()) as WebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (!payload || payload.table !== "jobs" || !payload.record.is_private) {
    return new Response(JSON.stringify({ message: "Skipped" }), { status: 200 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("SB_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SB_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const job = payload.record;
  const oldRecord = payload.old_record || null;
  const oldStatus = oldRecord?.private_status || null;
  const newStatus = job.private_status;

  const [{ data: clientData, error: clientErr }, { data: firmData, error: firmErr }] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name").eq("id", job.client_id).maybeSingle(),
    job.target_firm_id
      ? supabase.from("firms").select("id, name, email, owner_id").eq("id", job.target_firm_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (clientErr) {
    console.error("Failed to fetch client profile:", clientErr);
  }
  if (firmErr) {
    console.error("Failed to fetch firm:", firmErr);
  }

  const client = clientData as Profile | null;
  const firm = firmData as Firm | null;

  let firmOwner: Profile | null = null;
  if (firm?.owner_id) {
    const { data: ownerData, error: ownerErr } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", firm.owner_id)
      .maybeSingle();
    if (ownerErr) {
      console.error("Failed to fetch firm owner profile:", ownerErr);
    }
    firmOwner = ownerData as Profile | null;
  }

  const clientName = client?.full_name || client?.email || "Klijent";
  const firmName = firm?.name || "Firma";
  const firmDashboardUrl = `${SITE_URL}/dashboard/firma/?directJobId=${job.id}`;
  const clientDashboardUrl = `${SITE_URL}/dashboard/poslovi/?id=${job.id}`;
  const adminUrl = `${SITE_URL}/admin/`;

  const emailPromises: Promise<EmailResult>[] = [];
  const notificationPromises: Promise<void>[] = [];

  const jobDetails = `
    <p style="margin: 0 0 8px; font-size: 14px; color: #555;"><strong>Klijent:</strong> ${clientName}</p>
    <p style="margin: 0 0 8px; font-size: 14px; color: #555;"><strong>Firma:</strong> ${firmName}</p>
    <p style="margin: 0 0 8px; font-size: 14px; color: #555;"><strong>Grad:</strong> ${job.city || "nepoznato"}</p>
    <p style="margin: 0; font-size: 14px; color: #555;"><strong>Budžet:</strong> ${formatBudget(job.budget_mode, job.budget_min, job.budget_max)}</p>
  `;

  // 1. New direct request
  if (payload.type === "INSERT" && newStatus === "pending") {
    const clientMessage = job.client_question
      ? `<p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;"><strong>Pitanje klijenta:</strong> ${job.client_question}</p>`
      : "";

    const html = emailWrapper(
      "Novi zahtjev za ponudu",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${firmName},<br><br>
          Dobili ste novi direktni zahtjev za ponudu za posao <strong>${job.title}</strong>.
          Pregledajte detalje i odgovorite u roku od 48 sati kako ne biste propustili priliku.
        </p>
        ${jobCard(job.title, clientMessage + jobDetails)}
        ${ctaButton(firmDashboardUrl, "Pregledaj zahtjev i odgovori")}
      `
    );

    if (firm?.email && firm.email !== client?.email) {
      emailPromises.push(sendResendEmail(firm.email, `Novi zahtjev za ponudu: ${job.title}`, html));
    }
    if (firmOwner?.email && firmOwner.email !== firm?.email && firmOwner.email !== client?.email) {
      emailPromises.push(sendResendEmail(firmOwner.email, `Novi zahtjev za ponudu: ${job.title}`, html));
    }

    if (firmOwner) {
      notificationPromises.push(
        insertNotification(
          supabase,
          firmOwner.id,
          "direct_request",
          "Novi direktni zahtjev",
          `Dobili ste novi direktni zahtjev za ponudu: "${job.title}"`,
          job.id
        )
      );
    }

    if (ADMIN_EMAIL && RESEND_API_KEY) {
      emailPromises.push(
        sendResendEmail(
          ADMIN_EMAIL,
          `Novi direktni zahtjev: ${job.title}`,
          emailWrapper(
            "Novi direktni zahtjev",
            `
              <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">Upravo je kreiran novi direktni zahtjev.</p>
              ${jobCard(job.title, jobDetails)}
              ${ctaButton(adminUrl, "Otvori admin panel")}
            `
          )
        )
      );
    }
  }

  // 2. Status transitions
  if (payload.type === "UPDATE" && newStatus !== oldStatus) {
    switch (newStatus) {
      case "accepted": {
        const html = emailWrapper(
          "Ponuda je prihvaćena",
          `
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
              Poštovani ${clientName},<br><br>
              Firma <strong>${firmName}</strong> je prihvatila vaš zahtjev za ponudu za posao <strong>${job.title}</strong>.
              Možete nastaviti razgovor i dogovoriti detalje izvođenja.
            </p>
            ${jobCard(job.title, jobDetails)}
            ${ctaButton(clientDashboardUrl, "Otvori razgovor")}
          `
        );
        if (client?.email) emailPromises.push(sendResendEmail(client.email, `Ponuda za "${job.title}" je prihvaćena`, html));
        notificationPromises.push(
          insertNotification(
            supabase,
            job.client_id,
            "direct_request_accepted",
            "Ponuda prihvaćena",
            `Firma ${firmName} je prihvatila vaš zahtjev za "${job.title}"`,
            job.id
          )
        );
        break;
      }
      case "in_progress": {
        const html = emailWrapper(
          "Rad je u toku",
          `
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
              Poštovani ${clientName},<br><br>
              Firma <strong>${firmName}</strong> je započela rad na vašem poslu <strong>${job.title}</strong>.
            </p>
            ${jobCard(job.title, jobDetails)}
            ${ctaButton(clientDashboardUrl, "Prati napredak")}
          `
        );
        if (client?.email) emailPromises.push(sendResendEmail(client.email, `Firma je započela rad na "${job.title}"`, html));
        notificationPromises.push(
          insertNotification(
            supabase,
            job.client_id,
            "direct_request_in_progress",
            "Rad u toku",
            `Firma ${firmName} je započela rad na "${job.title}"`,
            job.id
          )
        );
        break;
      }
      case "done_pending": {
        const html = emailWrapper(
          "Potvrdite završetak posla",
          `
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
              Poštovani ${clientName},<br><br>
              Firma <strong>${firmName}</strong> označila je posao <strong>${job.title}</strong> kao gotov.
              Molimo vas da pregledate rad i potvrdite završetak.
            </p>
            ${jobCard(job.title, jobDetails)}
            ${ctaButton(clientDashboardUrl, "Pregledaj i potvrdi završetak")}
            <p style="font-size: 14px; color: #555; margin-top: 16px; line-height: 1.5;">
              Ako smatrate da posao nije dovršen, prijavite problem putem razgovora prije potvrde.
            </p>
          `
        );
        if (client?.email) emailPromises.push(sendResendEmail(client.email, `Posao "${job.title}" je gotov — potvrdite završetak`, html));
        notificationPromises.push(
          insertNotification(
            supabase,
            job.client_id,
            "direct_request_done",
            "Posao gotov — potvrdite završetak",
            `Firma ${firmName} označila je "${job.title}" kao gotov. Potvrdite završetak.`,
            job.id
          )
        );
        break;
      }
      case "completed": {
        const html = emailWrapper(
          "Posao je završen",
          `
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
              Poštovani ${firmName},<br><br>
              Klijent <strong>${clientName}</strong> je potvrdio završetak posla <strong>${job.title}</strong>.
              Hvala vam na profesionalnoj saradnji.
            </p>
            ${jobCard(job.title, jobDetails)}
            ${ctaButton(firmDashboardUrl, "Idi na dashboard")}
          `
        );
        if (firm?.email) emailPromises.push(sendResendEmail(firm.email, `Klijent je potvrdio završetak posla "${job.title}"`, html));
        if (firmOwner?.email && firmOwner.email !== firm?.email) {
          emailPromises.push(sendResendEmail(firmOwner.email, `Klijent je potvrdio završetak posla "${job.title}"`, html));
        }
        if (firmOwner) {
          notificationPromises.push(
            insertNotification(
              supabase,
              firmOwner.id,
              "direct_request_completed",
              "Posao završen",
              `Klijent ${clientName} je potvrdio završetak posla "${job.title}"`,
              job.id
            )
          );
        }
        break;
      }
      case "declined": {
        const html = emailWrapper(
          "Zahtjev nije prihvaćen",
          `
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
              Poštovani ${clientName},<br><br>
              Nažalost, firma <strong>${firmName}</strong> trenutno nije u mogućnosti prihvatiti vaš zahtjev za ponudu za posao <strong>${job.title}</strong>.
              Ne brinite, vaš posao je i dalje vidljiv drugim provjerenim firmama na Zaposli.ba.
            </p>
            ${jobCard(job.title, jobDetails)}
            ${ctaButton(clientDashboardUrl, "Pronađi druge firme")}
          `
        );
        if (client?.email) emailPromises.push(sendResendEmail(client.email, `Zahtjev za ponudu za "${job.title}" nije prihvaćen`, html));
        notificationPromises.push(
          insertNotification(
            supabase,
            job.client_id,
            "direct_request_declined",
            "Zahtjev odbijen",
            `Firma ${firmName} je odbila vaš zahtjev za "${job.title}"`,
            job.id
          )
        );
        break;
      }
      case "cancelled": {
        const html = emailWrapper(
          "Zahtjev otkazan",
          `
            <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
              Zahtjev za posao <strong>${job.title}</strong> je otkazan.
            </p>
            ${jobCard(job.title, jobDetails)}
            ${ctaButton(clientDashboardUrl, "Pogledaj detalje")}
          `
        );
        if (client?.email) emailPromises.push(sendResendEmail(client.email, `Zahtjev otkazan: ${job.title}`, html));
        if (firm?.email && firm.email !== client?.email) {
          emailPromises.push(sendResendEmail(firm.email, `Zahtjev otkazan: ${job.title}`, html));
        }
        if (firmOwner?.email && firmOwner.email !== firm?.email && firmOwner.email !== client?.email) {
          emailPromises.push(sendResendEmail(firmOwner.email, `Zahtjev otkazan: ${job.title}`, html));
        }
        notificationPromises.push(
          insertNotification(
            supabase,
            job.client_id,
            "direct_request_cancelled",
            "Zahtjev otkazan",
            `Zahtjev "${job.title}" je otkazan`,
            job.id
          )
        );
        if (firmOwner) {
          notificationPromises.push(
            insertNotification(
              supabase,
              firmOwner.id,
              "direct_request_cancelled",
              "Zahtjev otkazan",
              `Zahtjev "${job.title}" je otkazan`,
              job.id
            )
          );
        }
        break;
      }
    }
  }

  // 3. Problem reported
  if (payload.type === "UPDATE" && job.problem_reported && (!oldRecord || !oldRecord.problem_reported)) {
    const html = emailWrapper(
      "Prijavljen problem",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Klijent ${clientName} prijavio je problem za posao <strong>${job.title}</strong>.
        </p>
        ${jobCard(job.title, jobDetails + `
          <p style="margin: 12px 0 0; font-size: 14px; color: #555; line-height: 1.5;"><strong>Opis problema:</strong> ${job.problem_description || "Nije naveden"}</p>
        `)}
        ${ctaButton(adminUrl, "Pregledaj u adminu")}
      `
    );
    if (firm?.email) emailPromises.push(sendResendEmail(firm.email, `Prijavljen problem: ${job.title}`, html));
    if (firmOwner?.email && firmOwner.email !== firm?.email) {
      emailPromises.push(sendResendEmail(firmOwner.email, `Prijavljen problem: ${job.title}`, html));
    }
    if (ADMIN_EMAIL && RESEND_API_KEY) {
      emailPromises.push(sendResendEmail(ADMIN_EMAIL, `[Admin] Problem prijavljen: ${job.title}`, html));
    }
    if (firmOwner) {
      notificationPromises.push(
        insertNotification(
          supabase,
          firmOwner.id,
          "direct_request_problem",
          "Prijavljen problem",
          `Klijent ${clientName} prijavio je problem za "${job.title}"`,
          job.id
        )
      );
    }
  }

  await Promise.all([...emailPromises, ...notificationPromises]);

  const sentResults = await Promise.all(emailPromises);
  const sentCount = sentResults.filter((r) => r.status === "sent").length;

  return new Response(
    JSON.stringify({ message: "Processed", emails: sentCount, notifications: notificationPromises.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
