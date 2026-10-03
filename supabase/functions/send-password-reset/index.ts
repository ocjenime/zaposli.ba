import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Reset lozinke preko dokazanog Resend API puta (umjesto Supabase SMTP-a).
// POST { email } -> generiše recovery link i šalje ga korisniku.
// Uvijek vraća success:true da se ne otkriva da li nalog postoji.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Zaposli.ba <info@zaposli.ba>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://zaposli.ba";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = (body.email || "").trim().toLowerCase();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Neispravna email adresa." }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("SB_URL") || "";
  const serviceRoleKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SB_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !serviceRoleKey || !RESEND_API_KEY) {
    console.error("Missing env vars for send-password-reset");
    return json({ error: "Usluga trenutno nije dostupna." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error: linkError } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${SITE_URL}/nova-lozinka/` },
  });

  const actionLink = data?.properties?.action_link as string | undefined;
  if (linkError || !actionLink) {
    // Namjerno generički odgovor - ne otkrivamo da li nalog postoji.
    console.error("generateLink failed:", linkError?.message || "no action link");
    return json({ success: true });
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
        to: email,
        subject: "Reset lozinke - Zaposli.ba",
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1f1f1f;">
          <div style="margin-bottom: 24px;"><strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong></div>
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">Reset lozinke</h1>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Zatražili ste reset lozinke za vaš nalog. Kliknite na dugme ispod da postavite novu lozinku.
            Link vrijedi 1 sat. Ako niste vi zatražili reset, ignorišite ovaj email.
          </p>
          <a href="${actionLink}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">Postavi novu lozinku</a>
          <p style="font-size: 13px; color: #777; margin: 24px 0 0;">Ako dugme ne radi, kopirajte ovaj link u browser:<br/>${actionLink}</p>
        </div>
        `,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(body);
    }
  } catch (err) {
    console.error("Reset email failed:", err);
    return json({ error: "Slanje nije uspjelo. Pokušajte ponovo." }, 500);
  }

  return json({ success: true });
});
