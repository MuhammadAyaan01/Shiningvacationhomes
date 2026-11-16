# Production release status — 16 November 2026

## Verified

- Runtime: Node 26.13.1; deployment target pinned to 26.x.
- Next.js production build passed for 14 content routes and the dynamic enquiry endpoint.
- All 40 automated tests passed, including release configuration and real command execution.
- Production HTTP checks passed for all 14 pages, genuine 404, protected POST boundaries, headers, robots/sitemap and optimized 256px/384px WebP responses.
- The foreground production start respects the host PORT. Local preview is a separate command.
- Dependency audit reports zero known vulnerabilities. This is not a penetration test.
- Deployment configuration runs the environment gate, build and tests before publishing.

## Release blockers

Vercel is not connected in the current session. No deployment was created or claimed. Configure NEXT_PUBLIC_SITE_URL and ENQUIRY_ORIGIN plus the selected delivery provider. For Gmail, ENQUIRY_PROVIDER=gmail requires SMTP_USER and SMTP_APP_PASSWORD; ENQUIRY_TO defaults to the sender inbox. Resend remains an optional alternative with its own API key, verified sender and recipient. The release gate returns exit 1 and names only missing settings; it does not print secret values.

Configure the final HTTPS origin and approved email settings through the hosting environment settings. Private Gmail settings have been supplied. The authentication check stopped at DNS lookup (EDNS), before credential verification. Production also needs stable encrypted enquiry storage/key settings. SMTP authentication and actual inbox receipt remain unverified. No real message was sent.

The optional Cloudflare build still fails in the current Windows environment and is not the chosen deployment path. It was not substituted with a static export because the form requires a server.

## Checks after connection

Create/import the existing GitHub project on Vercel, set production environment values, deploy the verified source and inspect the actual deployment result. Verify final HTTPS/domain and canonical URLs, run the production HTTP checks, review the pages and keyboard/mobile interactions in a browser, configure shared abuse protection for the enquiry endpoint and complete an explicitly approved inbox test. Review business privacy/booking content and image permissions before public promotion. No Lighthouse/field performance or browser conformance score is asserted by this report.

Current corrections and remaining launch evidence are recorded in AUDIT_FIXES_2026-11-17.md and ENQUIRY_OPERATIONS.md.

## Gmail connection diagnosis — 17 November 2026

The OS resolver successfully resolves smtp.gmail.com. Gmail transport now uses that resolver while retaining TLS SNI and certificate validation for smtp.gmail.com; no IP address is hardcoded. Normal authenticated SMTP checks on both ports 465 and 587 were denied with EACCES before login in this execution environment. Credentials have not been rejected or verified. Run npm run check:email from an ordinary user terminal or the deployment host with approved SMTP access. No message is sent by this command. Do not disable TLS or regenerate passwords to address a network access denial.
