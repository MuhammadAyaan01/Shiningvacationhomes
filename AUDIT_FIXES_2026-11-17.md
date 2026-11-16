# Audit correction status — 17 November 2026

## Implemented and verified

- F-101: reset form/sidebar grid placement at 761–1000px so a one-column tablet grid cannot create an unintended second column. Fresh browser rendering is still required.
- F-103: increased meaningful eyebrow, form-note and footer text sizes while preserving the approved design.
- F-104: moved the footer to server rendering and split the photo dialog into an on-demand client module. It is absent from initial HTML. This was not a major bundle-size reduction: homepage-referenced JS changed from 617,245 raw / 192,470 synthetic-gzip bytes to 617,045 / 192,365 bytes. Further reductions need profiling; no exaggerated performance improvement is claimed.
- F-105: shortened hero reveal to 780ms and title words to 700ms. Full motion remains enabled as explicitly requested. No LCP or CLS improvement is claimed without browser measurements.
- F-106: added transactional shared database budgets: five per email per 15 minutes, twenty total per 15 minutes, eighty per UTC day. Global and per-email limits commit atomically with new lead capture. No untrusted forwarding header is treated as a verified IP identity.
- F-107: blocked inline event-handler attributes and framing through additional CSP directives. Inline script/style support remains for the existing Next.js prerendered/hydrated implementation; a fully strict script policy is not claimed.
- F-108: privacy content now describes encrypted website records, 30-day expiry and separate mailbox retention. Added operator commands for metadata-only listing, explicit local decryption, expiry cleanup and individual record deletion.
- F-109: removed duplicate About title branding and added practical owner-management questions without inventing commercial promises. Existing canonical/robots/schema safeguards remain.
- F-111: capture now precedes email delivery. Enquiries are AES-256-GCM encrypted at rest; durable request keys prevent duplicate claims across restarts. Provider failures leave recoverable records. SQLite is available locally; PostgreSQL supports shared public deployment. The SMTP send has a 20-second deadline and the browser waits 30 seconds. A failed or uncertain SMTP send is never blindly resent.

## Verification

- Node 26.13.1 / Next.js production build passed.
- All 40 automated tests passed, including encrypted record persistence after restart, request conflicts, transactional quota limits, concurrent duplicate requests, email failure recovery, storage failure, expiry/deletion and stalled SMTP connection closure.
- HTTP checks passed for all 14 routes, 404 behavior, headers, form boundaries, robots, sitemap and actual optimized WebP responses.
- Direct HTTP access to the private storage path returned 404.
- Dependency installation audit reported zero known vulnerabilities.
- No real email was sent. Existing credentials were not displayed, committed or included in the source archive.

## Outstanding evidence and owner inputs

- F-110: the Gmail check reached a DNS error (EDNS) before authentication. This does not prove incorrect credentials. Verify SMTP networking/authentication on the actual deployment host, then perform an explicitly approved inbox test.
- Vercel production needs ENQUIRY_DATABASE_URL and a stable private ENQUIRY_DATA_KEY. A Node server can use an absolute persistent ENQUIRY_STORAGE_DIR instead. The release gate blocks a missing storage/key setup. Live PostgreSQL connectivity has not been verified without deployment credentials.
- Assign an operator to review attention/processing records and schedule daily expiry cleanup. SMTP cannot guarantee exactly-once inbox delivery after a crash or timeout; recovery is durable and intentionally avoids automatic ambiguous retries.
- Host-level IP/bot controls remain a deployment task. Database budgets protect sending quota but cannot prevent every unauthenticated denial-of-service attempt.
- F-102 remains an intentional accessibility tradeoff: the user's full-motion preference is preserved. Reduced-motion support was not silently restored.
- The business must still approve its legal identity, mailbox retention, processing/transfer arrangements, image permissions and actual service commitments.
- Public HTTPS/domain redirects, Search Console/indexing, legacy URL export, fresh browser/assistive-technology tests and field Core Web Vitals remain unverified. No new numerical score or compliance certification is asserted.

See ENQUIRY_OPERATIONS.md for deployment/recovery instructions. The earlier audit is preserved separately as the baseline.

## Gmail connection diagnosis — 17 November 2026

The OS resolver successfully resolves smtp.gmail.com. Gmail transport now uses that resolver while retaining TLS SNI and certificate validation for smtp.gmail.com; no IP address is hardcoded. Normal authenticated SMTP checks on both ports 465 and 587 were denied with EACCES before login in this execution environment. Credentials have not been rejected or verified. Run npm run check:email from an ordinary user terminal or the deployment host with approved SMTP access. No message is sent by this command. Do not disable TLS or regenerate passwords to address a network access denial.
