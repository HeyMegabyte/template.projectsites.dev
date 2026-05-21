/**
 * POST /api/contact — Cloudflare Pages Function (idea #111).
 *
 * Accepts a JSON body { name, email, subject, message } from the ContactForm
 * component. Validates with Zod, optionally verifies a Turnstile token, then
 * relays to Resend (or any transactional email provider).
 *
 * Required Pages env vars (set via `wrangler pages secret put`):
 *   RESEND_API_KEY   - https://resend.com/api-keys
 *   CONTACT_TO       - destination email (e.g. you@yourbusiness.com)
 *   CONTACT_FROM     - verified sender (e.g. forms@yourdomain.com)
 *   TURNSTILE_SECRET - https://dash.cloudflare.com/?to=/:account/turnstile (optional)
 *
 * This file runs on Cloudflare's edge for free under the Pages Functions tier.
 * No build step needed — Pages auto-detects and deploys functions/* on push.
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  TURNSTILE_SECRET?: string;
}

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Optional Turnstile token from the form. */
  cfToken?: string;
}

const MAX_BYTES = 32 * 1024; // 32 KB
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function badRequest(error: string, status = 400): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!secret || !token) return true; // Turnstile not configured → skip
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const j = (await res.json().catch(() => ({}))) as { success?: boolean };
  return !!j.success;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  // Content-Length sanity check
  const lenHeader = ctx.request.headers.get('content-length');
  if (lenHeader && Number(lenHeader) > MAX_BYTES) return badRequest('Payload too large', 413);

  let body: ContactBody;
  try {
    body = await ctx.request.json();
  } catch {
    return badRequest('Invalid JSON');
  }

  // Validate
  if (!body.name?.trim() || body.name.trim().length < 2)
    return badRequest('Name must be at least 2 characters');
  if (!body.email?.trim() || !EMAIL_RE.test(body.email.trim()))
    return badRequest('Invalid email');
  if (!body.subject?.trim() || body.subject.trim().length < 3)
    return badRequest('Subject must be at least 3 characters');
  if (!body.message?.trim() || body.message.trim().length < 10)
    return badRequest('Message must be at least 10 characters');

  // Turnstile (optional)
  const ip = ctx.request.headers.get('CF-Connecting-IP') ?? '';
  if (ctx.env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(ctx.env.TURNSTILE_SECRET, body.cfToken ?? '', ip);
    if (!ok) return badRequest('Turnstile verification failed', 403);
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = ctx.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    // Without keys configured, log + return 202 so the form UX still feels good
    // but the operator knows they need to wire up email.
    console.log('[contact:no-email-configured]', { ...body, ip });
    return new Response(JSON.stringify({ accepted: true, delivered: false }), {
      status: 202,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }

  const html = `
    <h2>${escapeHtml(body.subject)}</h2>
    <p><strong>From:</strong> ${escapeHtml(body.name)} &lt;${escapeHtml(body.email)}&gt;</p>
    <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
    <pre style="white-space:pre-wrap;font-family:system-ui,sans-serif;">${escapeHtml(body.message)}</pre>
  `;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: body.email,
      subject: `[Contact] ${body.subject}`,
      html,
    }),
  });

  if (!r.ok) {
    const err = await r.text();
    console.error('[contact:resend-error]', err);
    return badRequest('Could not send. Please try again or email us directly.', 502);
  }

  return new Response(JSON.stringify({ accepted: true, delivered: true }), {
    status: 202,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
