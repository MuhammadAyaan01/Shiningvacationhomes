# Release fixes — 24 November 2026

These changes are prepared for both Shiningvacationhomes repositories. Public deployment readiness must be checked separately from Git publication.

## Final verification — 25 November 2026

- Unit/integration suite: 57 passed.
- Browser suite: 69 passed, including all 42 page/viewport accessibility checks under the strict CSP.
- Adapter-mode build with a deployment ID: passed, with 14 recovered routes and 57 regression tests.
- Existing private environment values were not found in the publication candidate files; local environment and enquiry data remain ignored.

## Implemented

- Test snapshots support standalone and actual Next adapter route-cache layouts. Every required page, custom 404, robots and sitemap must exist before replacing the generated snapshot.
- A secret-free isolated real adapter build with a deployment ID passed all 57 unit/integration tests and recovered all 14 content routes.
- The production build computes SHA-256 hashes from the actual prerendered scripts and installs them in Next and any Vercel build-output routing configuration. Script unsafe-inline is removed; inline styles remain permitted for the existing design and full motion.
- Browser regression verifies legitimate hydration/controls and rejection of an unapproved inline script. Accessibility scanning now uses Playwright's test-only initialization rather than injecting an unapproved inline script into the page. The site policy is not bypassed or weakened.
- Next Image serves existing responsive WebP photographs without request-time conversion. Media responses use a one-day browser cache.
- Vercel enquiries have a shared network quota of ten accepted submissions per 15-minute bucket, alongside email/global budgets. Network identifiers use HMAC; raw addresses are not included in enquiry payloads or email.
- Added npm run check:live -- https://your-approved-domain. This read-only check sends no enquiry and validates public routes, document policy, canonicals, sitemap and the POST boundary.
- Privacy and booking information pages have a shared editorial layout and a contents list that tracks the reading position. Full motion, menu transitions and gallery focus/closing behavior are preserved.

## Fresh lab samples

Localhost, cold cache, 150ms simulated latency, approximately 1.6Mbps download and 4x CPU throttling, without a parallel build/browser suite:

| Viewport | Route | LCP | CLS | Image-conversion requests |
|---|---|---:|---:|---:|
| 390px | Homepage | 1.560s | 0.0002 | 0 |
| 390px | Contact | 0.904s | 0.0005 | 0 |
| 1440px | Homepage | 1.352s | 0.0001 | 0 |
| 1440px | Contact | 0.904s | 0.0006 | 0 |

These are single directional laboratory samples, not field Core Web Vitals. The earlier audit samples had concurrent browser activity, so the difference is not a controlled estimate of the code changes' individual effect.

## Remaining external checks

The public Vercel address last returned HTTP 402 / DEPLOYMENT_DISABLED. Automatic approval review rejected project unpause because it could change production availability or resume paid activity. No hosting plan, billing, deployment-protection or account settings were changed.

Production PostgreSQL connectivity, an approved inbox test, anonymous access on the final domain and client approval of policy/media details remain separate launch checks. Git publication does not establish any of these facts. See DEPLOYMENT.md for the required build and verification commands.
