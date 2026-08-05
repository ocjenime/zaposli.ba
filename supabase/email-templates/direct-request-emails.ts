/**
 * Email copy brief for Zaposli.ba direct/private job request flow.
 *
 * Usable in Supabase Edge Functions with Resend. Import the `emailTemplates`
 * object and call the relevant function with variables.
 *
 * Each function returns: { subject: string, html: string, ctaText: string }
 *
 * Variables used across templates:
 * - {{job_title}}       - title of the job
 * - {{firm_name}}       - registered firm name
 * - {{client_name}}     - client full name
 * - {{client_message}}  - optional client question/note
 * - {{amount}}          - agreed price, if set (e.g. "1.500 KM")
 * - {{review_rating}}   - 1-5 star rating
 * - {{review_comment}}  - review text, may be empty
 * - {{job_url}}         - public/private link to the request/job
 * - {{dashboard_url}}   - recipient dashboard URL
 * - {{review_url}}      - link to the review page
 * - {{site_url}}        - https://zaposli.ba
 * - {{from_email}}      - from address, usually Zaposli.ba <info@zaposli.ba>
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  ctaText: string;
}

export interface EmailVariables {
  job_title: string;
  firm_name?: string;
  client_name?: string;
  client_message?: string | null;
  amount?: string | null;
  review_rating?: number;
  review_comment?: string | null;
  job_url?: string;
  dashboard_url?: string;
  review_url?: string;
  site_url?: string;
  from_email?: string;
}

const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
  color: #1f1f1f;
`;

const BRAND_LOGO = `
  <div style="margin-bottom: 24px;">
    <strong style="font-size: 20px; color: #f97316;">Zaposli.ba</strong>
  </div>
`;

function footer(unsubscribeUrl?: string): string {
  return `
    <p style="font-size: 12px; color: #999; margin-top: 24px;">
      Ne želite primati ove emailove? Podesite obavještenja u postavkama profila na Zaposli.ba.
      ${unsubscribeUrl ? `<br><a href="${unsubscribeUrl}" style="color: #999;">Upravljanje obavještenjima</a>` : ""}
    </p>
  `;
}

function ctaButton(url: string, text: string): string {
  return `
    <a href="${url}" style="display: inline-block; background: #f97316; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 16px;">${text}</a>
  `;
}

function jobCard(title: string, details: string): string {
  return `
    <div style="background: #f8f8fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">${title}</p>
      ${details}
    </div>
  `;
}

function wrapBody(heading: string, bodyHtml: string, unsubscribeUrl?: string): string {
  return `
    <div style="${BASE_STYLE}">
      ${BRAND_LOGO}
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px;">${heading}</h1>
      ${bodyHtml}
      ${footer(unsubscribeUrl)}
    </div>
  `;
}

export const emailTemplates = {
  /**
   * 1. Firm receives new direct job request
   * Sent when: client clicks "Zatraži ponudu" on firm profile.
   */
  firmReceivesDirectRequest(vars: EmailVariables): EmailTemplate {
    const subject = `Novi zahtjev za ponudu: ${vars.job_title}`;
    const clientMessage = vars.client_message
      ? `<p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;"><strong>Pitanje klijenta:</strong> ${vars.client_message}</p>`
      : "";
    const details = `
      <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;">
        <strong>Klijent:</strong> ${vars.client_name || "Klijent"}
      </p>
      ${clientMessage}
    `;
    const html = wrapBody(
      "Novi zahtjev za ponudu",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.firm_name || "firma"},<br><br>
          Dobili ste novi direktni zahtjev za ponudu za posao <strong>${vars.job_title}</strong>.
          Pregledajte detalje i odgovorite u roku od 48 sati kako ne biste propustili priliku.
        </p>
        ${jobCard(vars.job_title, details)}
        ${ctaButton(vars.job_url || vars.dashboard_url || "https://zaposli.ba/dashboard/firma", "Pregledaj zahtjev i odgovori")}
      `
    );
    return { subject, html, ctaText: "Pregledaj zahtjev i odgovori" };
  },

  /**
   * 2. Client's request was accepted by firm
   * Sent when: firm accepts the direct request.
   */
  clientRequestAccepted(vars: EmailVariables): EmailTemplate {
    const subject = `Ponuda za "${vars.job_title}" je prihvaćena`;
    const amount = vars.amount
      ? `<p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;"><strong>Predložena cijena:</strong> ${vars.amount}</p>`
      : "";
    const details = `
      <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;">
        <strong>Firma:</strong> ${vars.firm_name || "Firma"}
      </p>
      ${amount}
    `;
    const html = wrapBody(
      "Ponuda je prihvaćena",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.client_name || "klijente"},<br><br>
          Firma <strong>${vars.firm_name || "Firma"}</strong> prihvatila je vaš zahtjev za ponudu za posao <strong>${vars.job_title}</strong>.
          Možete nastaviti razgovor i dogovoriti detalje izvođenja.
        </p>
        ${jobCard(vars.job_title, details)}
        ${ctaButton(vars.job_url || vars.dashboard_url || "https://zaposli.ba/dashboard", "Otvori razgovor")}
      `
    );
    return { subject, html, ctaText: "Otvori razgovor" };
  },

  /**
   * 3. Firm started work
   * Sent when: firm updates status to "Work in progress" (Rad u toku).
   */
  firmStartedWork(vars: EmailVariables): EmailTemplate {
    const subject = `Firma je započela rad na "${vars.job_title}"`;
    const html = wrapBody(
      "Rad je u toku",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.client_name || "klijente"},<br><br>
          Firma <strong>${vars.firm_name || "Firma"}</strong> započela je rad na vašem poslu <strong>${vars.job_title}</strong>.
          Status posla je sada <strong>Rad u toku</strong>. Ako imate bilo kakvih pitanja, kontaktirajte firmu putem razgovora.
        </p>
        ${jobCard(vars.job_title, "")}
        ${ctaButton(vars.job_url || vars.dashboard_url || "https://zaposli.ba/dashboard", "Prati napredak")}
      `
    );
    return { subject, html, ctaText: "Prati napredak" };
  },

  /**
   * 4. Firm marked job as done - client needs to confirm
   * Sent when: firm updates status to "Done/Completed" (Gotovo/Završeno).
   */
  firmMarkedDoneClientConfirm(vars: EmailVariables): EmailTemplate {
    const subject = `Posao "${vars.job_title}" je gotov - potvrdite završetak`;
    const html = wrapBody(
      "Potvrdite završetak posla",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.client_name || "klijente"},<br><br>
          Firma <strong>${vars.firm_name || "Firma"}</strong> označila je posao <strong>${vars.job_title}</strong> kao gotov.
          Molimo vas da pregledate izvedeni rad i potvrdite završetak kako bi firma mogla dobiti ocjenu.
        </p>
        ${jobCard(vars.job_title, "")}
        ${ctaButton(vars.job_url || vars.dashboard_url || "https://zaposli.ba/dashboard", "Pregledaj i potvrdi završetak")}
        <p style="font-size: 14px; color: #555; margin-top: 16px; line-height: 1.5;">
          Ako smatrate da posao nije dovršen, prijavite problem putem razgovora prije potvrde.
        </p>
      `
    );
    return { subject, html, ctaText: "Pregledaj i potvrdi završetak" };
  },

  /**
   * 5. Client confirmed completion
   * Sent when: client confirms completion.
   */
  clientConfirmedCompletion(vars: EmailVariables): EmailTemplate {
    const subject = `Klijent je potvrdio završetak posla "${vars.job_title}"`;
    const html = wrapBody(
      "Posao je završen",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.firm_name || "firma"},<br><br>
          Klijent <strong>${vars.client_name || "Klijent"}</strong> potvrdio je završetak posla <strong>${vars.job_title}</strong>.
          Status posla je sada <strong>Završeno</strong>. Hvala vam na profesionalnoj saradnji.
        </p>
        ${jobCard(vars.job_title, "")}
        ${ctaButton(vars.dashboard_url || "https://zaposli.ba/dashboard/firma", "Idi na dashboard")}
      `
    );
    return { subject, html, ctaText: "Idi na dashboard" };
  },

  /**
   * 6. Client left a review
   * Sent when: client leaves a review (1-5 stars, comment, images).
   */
  clientLeftReview(vars: EmailVariables): EmailTemplate {
    const rating = vars.review_rating || 0;
    const comment = vars.review_comment
      ? `<p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;"><strong>Komentar:</strong> ${vars.review_comment}</p>`
      : "";
    const subject = `Nova recenzija za firmu ${vars.firm_name || "Firma"}`;
    const details = `
      <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;">
        <strong>Klijent:</strong> ${vars.client_name || "Klijent"}
      </p>
      <p style="margin: 0 0 12px; font-size: 14px; color: #555; line-height: 1.5;">
        <strong>Ocjena:</strong> ${rating}/5
      </p>
      ${comment}
    `;
    const html = wrapBody(
      "Nova recenzija",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.firm_name || "firma"},<br><br>
          Klijent je ostavio recenziju za završeni posao <strong>${vars.job_title}</strong>.
        </p>
        ${jobCard(vars.job_title, details)}
        ${ctaButton(vars.review_url || vars.dashboard_url || "https://zaposli.ba/dashboard/firma", "Pregledaj recenziju")}
      `
    );
    return { subject, html, ctaText: "Pregledaj recenziju" };
  },

  /**
   * 7. Firm declined request
   * Sent when: firm declines the direct request.
   */
  firmDeclinedRequest(vars: EmailVariables): EmailTemplate {
    const subject = `Zahtjev za ponudu za "${vars.job_title}" nije prihvaćen`;
    const html = wrapBody(
      "Zahtjev nije prihvaćen",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.client_name || "klijente"},<br><br>
          Nažalost, firma <strong>${vars.firm_name || "Firma"}</strong> trenutno nije u mogućnosti prihvatiti vaš zahtjev za ponudu za posao <strong>${vars.job_title}</strong>.
          Ne brinite, vaš posao je i dalje vidljiv drugim provjerenim firmama na Zaposli.ba.
        </p>
        ${jobCard(vars.job_title, "")}
        ${ctaButton(vars.dashboard_url || "https://zaposli.ba/dashboard", "Pronađi druge firme")}
      `
    );
    return { subject, html, ctaText: "Pronađi druge firme" };
  },

  /**
   * 8. Reminder: client hasn't confirmed completion after 48h
   * Sent when: 48 hours passed after firm marked job as done.
   */
  reminderClientConfirmCompletion(vars: EmailVariables): EmailTemplate {
    const subject = `Podsjetnik: potvrdite završetak posla "${vars.job_title}"`;
    const html = wrapBody(
      "Podsjetnik: potvrdite završetak",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.client_name || "klijente"},<br><br>
          Prije 48 sati firma <strong>${vars.firm_name || "Firma"}</strong> označila je posao <strong>${vars.job_title}</strong> kao gotov.
          Molimo vas da pregledate rad i potvrdite završetak, ili se javite firmi ukoliko imate primjedbi.
        </p>
        ${jobCard(vars.job_title, "")}
        ${ctaButton(vars.job_url || vars.dashboard_url || "https://zaposli.ba/dashboard", "Potvrdi završetak")}
        <p style="font-size: 14px; color: #555; margin-top: 16px; line-height: 1.5;">
          Ako ne potvrdite u narednim danima, posao će automatski biti označen kao završen.
        </p>
      `
    );
    return { subject, html, ctaText: "Potvrdi završetak" };
  },

  /**
   * 9. Reminder: firm hasn't responded to request after 48h
   * Sent when: 48 hours passed after client sent request and firm hasn't responded.
   */
  reminderFirmRespondToRequest(vars: EmailVariables): EmailTemplate {
    const subject = `Podsjetnik: novi zahtjev za ponudu "${vars.job_title}" čeka na odgovor`;
    const html = wrapBody(
      "Podsjetnik: odgovorite na zahtjev",
      `
        <p style="font-size: 16px; line-height: 1.5; margin: 0 0 24px;">
          Poštovani ${vars.firm_name || "firma"},<br><br>
          Prije 48 sati klijent <strong>${vars.client_name || "Klijent"}</strong> poslao vam je direktni zahtjev za ponudu za posao <strong>${vars.job_title}</strong>.
          Brz odgovor povećava šanse da dobijete posao i ostavite profesionalan prvi utisak.
        </p>
        ${jobCard(vars.job_title, "")}
        ${ctaButton(vars.job_url || vars.dashboard_url || "https://zaposli.ba/dashboard/firma", "Odgovori odmah")}
      `
    );
    return { subject, html, ctaText: "Odgovori odmah" };
  },
};

/**
 * Example usage in a Supabase Edge Function:
 *
 * import { emailTemplates, EmailVariables } from "../email-templates/direct-request-emails.ts";
 *
 * const vars: EmailVariables = {
 *   job_title: "Adaptacija kupatila",
 *   firm_name: "Majstorija d.o.o.",
 *   client_name: "Amir Hodžić",
 *   client_message: "Kada možete doći na pogled?",
 *   job_url: "https://zaposli.ba/dashboard/firma/poslovi/123",
 * };
 *
 * const { subject, html, ctaText } = emailTemplates.firmReceivesDirectRequest(vars);
 *
 * await fetch("https://api.resend.com/emails", {
 *   method: "POST",
 *   headers: {
 *     "Content-Type": "application/json",
 *     Authorization: `Bearer ${RESEND_API_KEY}`,
 *   },
 *   body: JSON.stringify({
 *     from: FROM_EMAIL,
 *     to: firmEmail,
 *     subject,
 *     html,
 *   }),
 * });
 */
