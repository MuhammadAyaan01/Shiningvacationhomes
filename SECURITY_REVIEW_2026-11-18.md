# Security review - 18 November 2026

## Scope

Source review of the Next.js application, enquiry API, email delivery, encrypted enquiry storage, response headers, deployment configuration, dependency tree and tracked secret exposure. This review is not a penetration test or a guarantee of security. Production hosting settings were not accessible.

## Dependency finding and remediation

A fresh npm audit found eight high-severity dependency entries tracing to picomatch (GHSA-fc5q-39xc-vjpf) through the unused Cloudflare/OpenNext build toolchain. The advisory currently lists no patched version. The unused adapter, Wrangler, worker script and associated configuration were removed rather than downgrading framework packages or suppressing the finding. Vercel and conventional Node deployment remain supported. The lockfile was regenerated.

After removal, npm audit reports zero known vulnerabilities across production and development dependencies; npm outdated reports no outdated direct packages. Registry latest tags match Next.js 16.4.6, React/React DOM 19.3.1, Nodemailer 10.6.0, postgres 4.1.1, TypeScript 7.0.2, Node types 26.6.6 and React types 19.3.0. Node types are now an explicit build dependency rather than an incidental dependency of the removed adapter. These are point-in-time findings. Weekly Dependabot pull requests are configured for npm updates.

## Source controls reviewed

- Private .env.local and local .data storage are ignored by Git; only the blank/example environment template is tracked. Checks against configured secret values and common token/private-key patterns found no matches in tracked source. No credential values are included in this report.
- The enquiry form declares POST, disables fields until hydration and sends JSON. It does not fall back to a GET containing personal data.
- The API rejects foreign/missing origins, wrong content types, oversized bodies, invalid fields/dates and malformed idempotency keys. User input cannot select the delivery recipient or SMTP host.
- Email HTML escapes user content. Gmail uses certificate-verified TLS, fixed authenticated sender, bounded timeouts and disabled file/URL attachment access.
- PostgreSQL queries bind values separately from fixed SQL text. Enquiry payloads use AES-256-GCM with random nonces, HMAC identifiers, expiry and persistent idempotency. Shared transaction limits bound accepted enquiries.
- CSP, HSTS, frame blocking, nosniff, referrer and permissions policies are configured. Next.js powered-by headers are disabled.
- Application code does not contain user-controlled eval, shell execution or arbitrary outbound URL fetches. JSON-LD injection points escape less-than characters.

## Remaining production work and limitations

- Configure the actual HTTPS origin, Gmail credentials, PostgreSQL connection and stable encryption key in Vercel. Keep secrets server-only; the site URL is intentionally public. Production configuration checks remain enabled.
- Verify the managed database connection, effective HTTPS/security headers and email receipt on the deployed host. The local test environment cannot establish outgoing SMTP; the user previously confirmed a Gmail notification received from their ordinary terminal/server.
- Configure and verify Vercel edge abuse protection/rate limits. Database sending budgets protect accepted submissions, but do not replace network/bot protection against request floods and quota exhaustion.
- CSP still permits inline scripts/styles for the existing prerendered Next.js application. A strict nonce/hash policy needs a separately validated rendering change; this review does not claim strict CSP or complete XSS prevention.
- Review mailbox access, MFA, database backup/retention and business privacy requirements. Automated secret checks do not prove that no credential has ever appeared in historical commits or external logs.
- No authenticated administration UI, customer login, checkout or payment handling exists in this project.

## Validation

Production build passed; all 45 automated tests passed. Runtime checks passed for all 14 content routes, genuine 404, POST origin/content/validation boundaries, no-JavaScript form guard, configured headers, robots/sitemap and real 256px/384px optimized images. Direct requests for /.env.local, /.data/enquiries/enquiries.sqlite and /package.json returned 404. No real enquiry email was sent by this review.
