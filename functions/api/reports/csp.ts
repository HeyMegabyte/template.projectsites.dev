/**
 * POST /api/reports/csp — receive CSP violation reports (idea #114, #182).
 *
 * Browsers POST to this endpoint when a CSP-Report-Only or enforced policy
 * fires. We log to Workers Tracing (free until 2026-03-01 then billed) +
 * optionally forward to Sentry / a logging endpoint.
 *
 * The body comes in two shapes depending on whether the browser uses the
 * Reporting API or the legacy `report-uri`:
 *   1. application/reports+json (Reporting API): an array of { type, body, ... }
 *   2. application/csp-report (legacy): { "csp-report": {...} }
 *
 * Endpoint is referenced from `public/_headers` Reporting-Endpoints header.
 */

interface Env {
  SENTRY_DSN?: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const contentType = ctx.request.headers.get('content-type') ?? '';
  let report: unknown;
  try {
    report = await ctx.request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  // Normalize to an array for consistent logging
  const reports = Array.isArray(report) ? report : [report];

  for (const r of reports) {
    console.log('[csp-report]', {
      timestamp: new Date().toISOString(),
      cfRay: ctx.request.headers.get('cf-ray'),
      ua: ctx.request.headers.get('user-agent'),
      contentType,
      report: r,
    });
  }

  // 204 No Content is the standard response for report endpoints
  return new Response(null, { status: 204 });
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
