# Shining Vacation Homes

A Next.js App Router and React website for Dubai accommodation and property-management enquiries. The site showcases accommodation styles; the team follows up with actual available options. It has no live inventory, checkout or instant reservations.

## Requirements

- Node.js 26.x
- npm and the committed package-lock.json
- Gmail SMTP or Resend for enquiry notifications
- PostgreSQL for public Vercel hosting

## Local setup

Copy `.env.example` to `.env.local` and configure your private delivery settings. Keep environment files and enquiry records out of Git.

```sh
npm ci
npm run build
npm test
npm run preview
```

The local preview runs at http://127.0.0.1:4173/. For hot reload, use `npm run dev`. Run only one server on that port.

## Production configuration

Set these values directly in the Vercel project's Production environment settings:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Approved public HTTPS origin for metadata and sitemap |
| `ENQUIRY_ORIGIN` | The same origin, without a trailing slash |
| `ENQUIRY_PROVIDER` | `gmail` for the current Gmail setup |
| `SMTP_USER` | Sending Google account |
| `SMTP_APP_PASSWORD` | That account's Google App Password |
| `ENQUIRY_TO` | Recipient inbox; optional for Gmail, which otherwise uses SMTP_USER |
| `ENQUIRY_DATABASE_URL` | Managed PostgreSQL connection URL |
| `ENQUIRY_DATA_KEY` | Stable private 64-character hexadecimal encryption key |

The release check intentionally blocks production when required settings are absent. Without `ENQUIRY_PROVIDER=gmail`, the supported legacy default checks for Resend settings instead. For Resend, use the alternative variables documented in `.env.example`.

The build command is `npm run check:release && npm run build && npm test`. Keep Vercel's output directory at its Next.js default. Do not deploy `out/` as a standalone application.

## Checks and operations

| Command | Purpose |
|---|---|
| `npm test` | Unit and integration regressions after building |
| `npm run test:browser` | Responsive, accessibility, security and interaction checks in Chromium |
| `npm run test:adapter` | Secret-free real adapter-mode build and regression checks |
| `npm run check:email` | Gmail connection/authentication check; sends no message |
| `npm run check:release` | Validate production delivery, origin and storage settings |
| `npm run check:live -- https://your-domain` | Read-only public HTTP checks; sends no enquiry |
| `npm run enquiries -- list` | Review saved enquiry references and delivery states |

The browser suite uses Windows Chrome when available. Otherwise install Chromium with `npx playwright install chromium`. Generated browser and adapter reports stay in ignored `test-results/`.

## Architecture and security

Content pages are prerendered. Internal routing uses Next Link. Next Image serves local responsive WebP photographs; fonts are local. The requested full motion remains enabled and the photo viewer has no zoom.

Always use `npm run build`: it verifies standalone/adapter prerender outputs and generates the script-hash CSP. The protected JSON POST endpoint validates and encrypts enquiries before email delivery. Shared quotas and idempotency checks limit repeated submissions. A saved reference or provider acceptance does not establish inbox receipt or a reservation.

`out/` is a generated test snapshot, `.next/` is the build output, and `.data/` contains private local enquiry storage. These directories are excluded from Git. Client confirmation of media rights, privacy arrangements and booking conditions remains necessary before launch.

## Documentation

- [Deployment and production verification](DEPLOYMENT.md)
- [Enquiry delivery, recovery and retention](ENQUIRY_OPERATIONS.md)
- [Photograph provenance](MEDIA_SOURCES.md)
- [SEO configuration and launch checks](SEO.md)
