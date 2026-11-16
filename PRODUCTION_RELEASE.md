# Production release status — 16 November 2026

## Verified

- Runtime: Node 26.13.1; deployment target pinned to 26.x.
- Next.js production build passed for 14 content routes and the dynamic enquiry endpoint.
- All 25 automated tests passed, including release configuration and real command execution.
- Production HTTP checks passed for all 14 pages, genuine 404, protected POST boundaries, headers, robots/sitemap and optimized 256px/384px WebP responses.
- The foreground production start respects the host PORT. Local preview is a separate command.
- Dependency audit reports zero known vulnerabilities. This is not a penetration test.
- Deployment configuration runs the environment gate, build and tests before publishing.

## Release blockers

Vercel is not connected in the current session. No deployment was created or claimed. The following production values are missing: NEXT_PUBLIC_SITE_URL, ENQUIRY_ORIGIN, RESEND_API_KEY, ENQUIRY_FROM and ENQUIRY_TO. The release gate returns exit 1 and names only missing settings; it does not print secret values.

Configure the final HTTPS origin, verified sender and approved recipient through the hosting environment settings. Authentication, sender verification and actual inbox receipt remain unverified. No real message was sent.

The optional Cloudflare build still fails in the current Windows environment and is not the chosen deployment path. It was not substituted with a static export because the form requires a server.

## Checks after connection

Create/import the existing GitHub project on Vercel, set production environment values, deploy the verified source and inspect the actual deployment result. Verify final HTTPS/domain and canonical URLs, run the production HTTP checks, review the pages and keyboard/mobile interactions in a browser, configure shared abuse protection for the enquiry endpoint and complete an explicitly approved inbox test. Review business privacy/booking content and image permissions before public promotion. No Lighthouse/field performance or browser conformance score is asserted by this report.
