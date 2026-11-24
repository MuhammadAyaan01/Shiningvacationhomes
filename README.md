# Shining Vacation Homes

Next.js App Router and React with shared CSS and the approved warm editorial design. Node.js 26.x is the verified production target.

## Run locally

Run `npm ci`, `npm run build`, `npm test`, then `npm run preview`. The local production preview runs at http://127.0.0.1:4173/. For hot reload, use `npm run dev` instead. Stop another server on that port first.

## Enquiries

Copy `.env.example` to `.env.local`. For Gmail, set `ENQUIRY_PROVIDER=gmail`, `SMTP_USER` to your Google account email, and `SMTP_APP_PASSWORD` to its 16-letter App Password (requires 2-Step Verification). Leave `ENQUIRY_TO` blank to receive enquiries in the same inbox, or set a different recipient. The sender is always the authenticated Google account. Run `npm run check:email` to verify SMTP connection/authentication without sending an email, then restart the server. Set `ENQUIRY_ORIGIN` to the exact deployed HTTPS origin behind a proxy. Never commit secrets.

Resend remains optional: set `ENQUIRY_PROVIDER=resend`, `RESEND_API_KEY`, `ENQUIRY_FROM` (a verified sender) and `ENQUIRY_TO`. Existing environments without ENQUIRY_PROVIDER continue to use Resend. Gmail uses TLS on smtp.gmail.com:465 and needs outbound SMTP access from the host. Google can impose sending limits or block sign-ins; this is intended for low-volume enquiries.

The form posts JSON to `/api/enquiry/`. Controls stay disabled until hydration; without JavaScript, direct contact details remain available. Server validation, bounded request bodies, same-origin checks, a honeypot, Resend provider idempotency, per-process Gmail retry deduplication for 15 minutes, timeouts and a basic per-process limiter protect the endpoint. A 202 response means the enquiry was durably captured; its message distinguishes confirmed provider acceptance from unconfirmed email delivery. It never means inbox receipt or a reservation. Missing configuration returns 503 and explicitly reports that nothing was sent.

## Architecture

Content routes are prerendered; enquiry delivery runs on the server. Internal navigation uses Next Link. Collection images use Next Image, responsive sizes and local source photographs. Fonts are served locally with their licenses. Full motion starts automatically without a toggle. The gallery has no zoom.

`out/` is a generated HTML test snapshot, not a deployable backend. See DEPLOYMENT.md.

## Remaining launch inputs

Accommodation photographs are illustrative. Actual options and prices are discussed after enquiry. Media rights, final policies, the delivery account and applicable provider/confirmation terms need owner verification. No live booking or payment is implemented.

Audit scores require fresh deployed measurements. Source fixes alone do not establish WCAG certification, field Core Web Vitals, inbox delivery or legal compliance.

## Accommodation enquiries

This website showcases accommodation Shining can help arrange; it does not publish live inventory. Visitors share requirements and the team follows up with suitable available options. The homepage and contact page use the same protected POST form. Exact dates are optional when an approximate travel plan or duration is supplied. Guests may add accommodation, area and AED budget preferences. Owner enquiries are separate. Configure delivery and complete an approved inbox test before public launch.

## Production commands

Use `npm run check:release` to validate the deployment origin and delivery settings. `npm start` runs the Next.js server in the foreground using the host PORT (default 3000). `npm run preview` is the separate local background preview on port 4173. Vercel configuration runs the release check, build and tests before a deployment can succeed. See DEPLOYMENT.md for the required environment values and live verification.

## Persistent enquiries

The live endpoint encrypts and saves validated enquiries before email delivery. Localhost uses private SQLite storage; Vercel requires managed PostgreSQL via ENQUIRY_DATABASE_URL and a stable ENQUIRY_DATA_KEY (64 hex characters). A Node server can instead use an absolute persistent ENQUIRY_STORAGE_DIR. The release gate checks these requirements. Shared database transactions enforce per-email and overall sending budgets. See ENQUIRY_OPERATIONS.md for recovery, expiry, privacy deletion and required operator monitoring. No live database credentials or encryption keys belong in Git or public source archives.

## Enquiry email format

Guest, monthly-stay and owner notifications use the shared branded HTML template with inline styles and presentation tables, alongside a plain-text alternative. Form values are escaped in HTML; notes retain line breaks, accommodation names and dates are readable, blank optional rows are omitted, and the Reply action targets the enquirer. Gmail and Resend use the same content. The email reference matches the saved website enquiry reference. No remote fonts, tracking images or external assets are required.

A user-confirmed local Gmail inbox receipt was supplied on 17 November 2026. The revised HTML formatting is covered by composition and escaping tests; a fresh Gmail inbox rendering check still requires a new enquiry after rebuilding/restarting the normal local server.


## Browser regression checks

After `npm run build`, run `npm run test:browser`. The suite covers every content route at mobile/tablet/desktop sizes, automated accessibility, breakpoint overflow, navigation/gallery keyboard behavior, form states and the sticky enquiry sidebar. Windows Chrome is used when available; otherwise run `npx playwright install chromium` to install the test browser. Form requests are intercepted and do not send real emails. Keep the browser tests on localhost.

See [the 20 November audit and launch handoff](docs/AUDIT_2026-11-20.md) for verified results and hosting blockers.


## Verified build and public checks

Use npm run build to generate the current HTML test snapshot and hash-based script CSP. Both standalone and Next adapter cache layouts are supported. Do not replace this script with a bare next build deployment command. Run npm run test:adapter for the isolated, credential-free adapter regression, and npm run check:live -- https://your-approved-domain after restoring hosting. The live check is read-only and sends no enquiry.

Collection photographs use the existing local responsive WebP files through Next Image, avoiding request-time conversion. Shared storage also limits repeated Vercel enquiries by a protected network identifier without adding the raw address to the enquiry or email.
