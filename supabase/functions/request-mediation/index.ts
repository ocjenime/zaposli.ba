import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "info@zaposli.ba";
const SITE_URL = Deno.env.get("SITE_URL") || "https://zaposli.ba";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
}

interface Firm {
  id: string;
  name: string | null;
  email: string | null;
  owner_id: string;
}

interface Job {
  id: string;
  title: string;
  client_id: string;
  target_firm_id: string | null;
  is_private: boolean;
  status: string;
  private_status: string | null;
  deadline: string | null;
  city: string | null;
  mediation_requested: boolean;
}

function isValidStatus(status: string, privateStatus: string | null, isPrivate: boolean) {
  if (isPrivate) {
    return privateStatus === "in_progress" || privateStatus === "done_pending" || privateStatus === "completed";
  }
  return status === "in_progress" || status === "done_pending" || status === "completed";
}

function deadlinePassed(deadline: string | null) {
  if (!deadline) return false;
  return new Date() > new Date(deadline);
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

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("SB_URL") || "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SB_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), { status: 500 });
  }

  // Authenticated client to verify the caller
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await authClient.auth.getUser();
  if (userErr || !userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = userData.user.id;

  let body: { job_id?: string; reason?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { job_id: jobId, reason } = body;
  if (!jobId || typeof reason !== "string" || reason.trim().length < 10) {
    return new Response(
      JSON.stringify({ error: "job_id and reason (min 10 characters) are required" }),
      { status: 400 }
    );
  }

  // Service-role client for data fetching and updates
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: job, error: jobErr } = await supabase
    .from("jobs")
    .select("id, title, client_id, target_firm_id, is_private, status, private_status, deadline, city, mediation_requested")
    .eq("id", jobId)
    .single();

  if (jobErr || !job) {
    return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
  }

  const typedJob = job as unknown as Job;

  // Determine if caller is a participant
  let isParticipant = false;
  let participantType = "";

  if (typedJob.client_id === userId) {
    isParticipant = true;
    participantType = "Klijent";
  } else {
    // Check if caller is owner of accepted firm bid (public jobs) or target firm (private jobs)
    const { data: firmData } = await supabase
      .from("firms")
      .select("id, name, email, owner_id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (firmData) {
      const firm = firmData as unknown as Firm;
      if (typedJob.is_private && typedJob.target_firm_id === firm.id) {
        isParticipant = true;
        participantType = firm.name || "Firma";
      } else if (!typedJob.is_private) {
        const { data: bidData } = await supabase
          .from("bids")
          .select("id")
          .eq("job_id", typedJob.id)
          .eq("firm_id", firm.id)
          .eq("status", "accepted")
          .maybeSingle();
        if (bidData) {
          isParticipant = true;
          participantType = firm.name || "Firma";
        }
      }
    }
  }

  if (!isParticipant) {
    return new Response(JSON.stringify({ error: "Not a participant" }), { status: 403 });
  }

  if (typedJob.mediation_requested) {
    return new Response(JSON.stringify({ error: "Mediation already requested" }), { status: 409 });
  }

  if (!isValidStatus(typedJob.status, typedJob.private_status, typedJob.is_private)) {
    return new Response(
      JSON.stringify({ error: "Mediation can only be requested for jobs in progress, done pending, or completed" }),
      { status: 400 }
    );
  }

  if (!deadlinePassed(typedJob.deadline)) {
    return new Response(
      JSON.stringify({ error: "Mediation can only be requested after the agreed deadline has passed" }),
      { status: 400 }
    );
  }

  const { error: updateErr } = await supabase
    .from("jobs")
    .update({
      mediation_requested: true,
      mediation_requested_at: new Date().toISOString(),
      mediation_requested_by: userId,
      mediation_reason: reason.trim(),
      mediation_resolved: false,
    })
    .eq("id", typedJob.id);

  if (updateErr) {
    console.error("Failed to request mediation:", updateErr);
    return new Response(JSON.stringify({ error: "Failed to request mediation" }), { status: 500 });
  }

  // Fetch requester info for email
  const { data: requesterData } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", userId)
    .single();
  const requester = requesterData as unknown as Profile | null;
  const requesterName = requester?.full_name || requester?.email || participantType;

  // Notify all admins in-app
  try {
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("is_admin", true);
    const adminIds = (admins as Array<{ id: string }> | null)?.map((a) => a.id) || [];
    for (const adminId of adminIds) {
      await supabase.from("notifications").insert({
        user_id: adminId,
        type: "mediation_requested",
        title: "Nova nesuglasica",
        message: `${requesterName} zatražio/la medijaciju za posao "${typedJob.title}"`,
        job_id: typedJob.id,
      });
    }
  } catch (err) {
    console.error("Failed to notify admins:", err);
  }

  await sendAdminEmail(
    `[Medijacija] Nova nesuglasica: ${typedJob.title}`,
    `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
      <div style="margin-bottom: 24px;"><strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong></div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Nova nesuglasica - potrebna medijacija</h1>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
        <strong>${requesterName}</strong> (${participantType}) zatražio/la je pomoć administratora za posao <strong>${typedJob.title}</strong>.
      </p>
      <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 16px;"><strong>Posao:</strong> ${typedJob.title}</p>
        <p style="margin: 0 0 8px; font-size: 16px;"><strong>Grad:</strong> ${typedJob.city || "nepoznato"}</p>
        <p style="margin: 0 0 8px; font-size: 16px;"><strong>Rok:</strong> ${typedJob.deadline || "nepoznat"}</p>
        <p style="margin: 0 0 8px; font-size: 16px;"><strong>Tip:</strong> ${typedJob.is_private ? "Direktni zahtjev" : "Javni oglas"}</p>
        <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;"><strong>Razlog nesuglasice:</strong><br>${reason.trim().replace(/\n/g, "<br>")}</p>
      </div>
      <a href="${SITE_URL}/admin/?tab=mediations" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Otvori spor u admin panelu</a>
    </div>
    `
  );

  return new Response(JSON.stringify({ message: "Mediation requested" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
