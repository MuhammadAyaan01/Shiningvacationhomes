# Deployment

## Vercel

Import MuhammadAyaan01/Shiningvacationhomes from GitHub. The checked-in configuration selects Next.js, uses Node 26.x, installs from package-lock.json and runs the release configuration check, production build and tests. Keep the output directory at the framework default; do not choose out.

Before deploying, set these production environment variables in Vercel's secret/environment settings:

| Variable | Value |
|---|---|
| NEXT_PUBLIC_SITE_URL | Final public HTTPS origin used for canonicals and sitemap |
| ENQUIRY_ORIGIN | Same origin, without a trailing slash |
| ENQUIRY_PROVIDER | gmail (or resend for the optional alternative) |
| SMTP_USER | Google account email when using Gmail |
| SMTP_APP_PASSWORD | Server-only Google App Password when using Gmail |
| ENQUIRY_TO | Optional for Gmail: blank uses SMTP_USER; otherwise approved recipient inboxes |
| RESEND_API_KEY | Required only for Resend |
| ENQUIRY_FROM | Required only for Resend: sender on a verified domain |

Gmail sends from SMTP_USER over TLS on smtp.gmail.com:465. The host must allow outbound SMTP. Enable Google 2-Step Verification and create an App Password. Run npm run check:email to verify authentication without sending a message. The public endpoint durably claims the enquiry in shared storage before sending. Gmail also has a per-process retry guard; SMTP acceptance still does not prove inbox receipt, and ambiguous failures are retained for operator review.

Do not place secret values in Git, NEXT_PUBLIC variables, screenshots or public logs. Use separate approved test recipients and environment values for preview deployments. The release check validates presence and basic syntax; it cannot prove domain ownership, provider authentication or inbox receipt. It intentionally blocks the hosted build when delivery settings are missing.

After deployment, run npm run check:live -- https://your-approved-domain to verify public route responses, security headers, canonical/sitemap URLs and the POST-only enquiry boundary. Then verify keyboard/mobile interactions and delivery to an approved test inbox. Confirm provider acceptance and actual receipt separately. Add the custom domain and make the required DNS change only in the domain owner's account. Enforce a shared endpoint rate limit/bot rule at the hosting layer before promotion; the application also enforces shared per-email, global and Vercel network quotas in its database.

The enquiry privacy information is an implementation overview. The business must approve the final responsible entity, retention/processor information, media rights and stay/booking policies. No live inventory or checkout is implemented; enquiries are followed up by the team.

## Node server

Use Node 26.x. Run npm ci, npm run check:release, npm run build, npm test, then npm start. The start command stays in the foreground and respects the host's PORT environment variable (3000 by default). Run it under the host's process supervisor behind HTTPS. npm start does not rebuild, detach or bind only to localhost.

For the local Windows preview on port 4173, use npm run preview or Start-Preview.cmd. For hot reload, use npm run dev. Do not run these simultaneously on the same port.

## Runtime security

The Next.js server emits nosniff, frame protection, referrer/permissions policies, HSTS and a content security policy. Production resources and browser connections are restricted to this origin, with data/blob images permitted. npm run build computes SHA-256 hashes from the actual prerendered scripts, then installs the policy in the Next routes manifest and any Vercel build-output routing configuration. Script unsafe-inline is removed. Inline styles remain allowed for the existing layout and motion. The larger script policy is scoped to documents rather than photograph/font/chunk responses. The email service is contacted from the server, never the browser.

## Deployment scope

Vercel and a conventional Node server are supported. Unused Cloudflare adapter tooling was removed during the 18 November 2026 security review. Do not publish the HTML test snapshot as a substitute for the server application.

## Persistent enquiries

The live endpoint encrypts and saves validated enquiries before email delivery. Localhost uses private SQLite storage; Vercel requires managed PostgreSQL via ENQUIRY_DATABASE_URL and a stable ENQUIRY_DATA_KEY (64 hex characters). A Node server can instead use an absolute persistent ENQUIRY_STORAGE_DIR. The release gate checks these requirements. Shared database transactions enforce per-email and overall sending budgets, plus a ten-per-15-minute network quota when a trusted Vercel address is available. Raw network addresses are not stored in enquiry payloads or sent by email. See ENQUIRY_OPERATIONS.md for recovery, expiry, privacy deletion and required operator monitoring. No live database credentials or encryption keys belong in Git or public source archives.


## Build verification and cost controls

Always use npm run build; calling next build directly skips the script-policy finalization and test snapshot. Missing page, robots or sitemap artifacts fail the build rather than passing through stale output. Both standalone and adapter route-cache layouts are supported. npm run test:adapter builds a secret-free isolated copy in real Next adapter mode, checks the alternate output layout, and runs the regression suite with a deployment ID.

Collection photographs use Next Image with the project's existing pre-generated WebP widths. No request-time image conversion is needed for those photos. Original JPEGs remain available. Media responses use a one-day browser cache with stale revalidation; the photographs are not claimed to be immutable across releases.

The public verification command does not send an enquiry or authenticate to Gmail/PostgreSQL. A controlled production form-to-inbox check and recovery verification remain separate launch tasks. Do not disable the release gate to get a green deployment.
