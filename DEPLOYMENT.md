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

Gmail sends from SMTP_USER over TLS on smtp.gmail.com:465. The host must allow outbound SMTP. Enable Google 2-Step Verification and create an App Password. Run npm run check:email to verify authentication without sending a message. SMTP retry deduplication is per-process for 15 minutes; it is not durable or shared between instances, and a timeout can leave delivery uncertain.

Do not place secret values in Git, NEXT_PUBLIC variables, screenshots or public logs. Use separate approved test recipients and environment values for preview deployments. The release check validates presence and basic syntax; it cannot prove domain ownership, provider authentication or inbox receipt. It intentionally blocks the hosted build when delivery settings are missing.

After deployment, verify HTTPS and the actual domain, all 14 routes and custom 404, image optimization, canonical/sitemap URLs, keyboard/mobile interactions and delivery to an approved test inbox. Confirm provider acceptance and actual receipt separately. Add the custom domain and make the required DNS change only in the domain owner's account. Enforce a shared endpoint rate limit/bot rule at the hosting layer before promotion; the application email limiter is best effort per process.

The enquiry privacy information is an implementation overview. The business must approve the final responsible entity, retention/processor information, media rights and stay/booking policies. No live inventory or checkout is implemented; enquiries are followed up by the team.

## Node server

Use Node 26.x. Run npm ci, npm run check:release, npm run build, npm test, then npm start. The start command stays in the foreground and respects the host's PORT environment variable (3000 by default). Run it under the host's process supervisor behind HTTPS. npm start does not rebuild, detach or bind only to localhost.

For the local Windows preview on port 4173, use npm run preview or Start-Preview.cmd. For hot reload, use npm run dev. Do not run these simultaneously on the same port.

## Runtime security

The Next.js server emits nosniff, frame protection, referrer/permissions policies, HSTS and a content security policy. Production resources and browser connections are restricted to this origin, with data/blob images permitted. Inline scripts and styles remain allowed for the current Next.js prerendered/hydrated application; this is not a nonce-based script policy. The email service is contacted from the server, never the browser.

## Optional Cloudflare adapter

The optional build:worker target remains unverified in this Windows environment because esbuild cannot resolve its configuration through a restricted ancestor directory. It is not the selected production deployment path. Do not publish the HTML test snapshot as a substitute for the server application.

## Persistent enquiries

The live endpoint encrypts and saves validated enquiries before email delivery. Localhost uses private SQLite storage; Vercel requires managed PostgreSQL via ENQUIRY_DATABASE_URL and a stable ENQUIRY_DATA_KEY (64 hex characters). A Node server can instead use an absolute persistent ENQUIRY_STORAGE_DIR. The release gate checks these requirements. Shared database transactions enforce per-email and overall sending budgets. See ENQUIRY_OPERATIONS.md for recovery, expiry, privacy deletion and required operator monitoring. No live database credentials or encryption keys belong in Git or public source archives.
