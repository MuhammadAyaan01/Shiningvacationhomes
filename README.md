# Shining Vacation Homes

Next.js App Router and React with shared CSS and the approved warm editorial design. Node.js 22+ is required.

## Run locally

Run `npm ci`, `npm run build`, `npm test`, then `npm start`. The production Next.js server runs at http://127.0.0.1:4173/. For hot reload, use `npm run dev` instead. Stop another server on that port first.

## Enquiries

Copy `.env.example` to `.env.local`. Configure `RESEND_API_KEY`, `ENQUIRY_FROM` (a verified sender) and `ENQUIRY_TO`. Set `ENQUIRY_ORIGIN` to the exact deployed HTTPS origin behind a proxy. Restart after configuration. Never commit secrets.

The form posts JSON to `/api/enquiry/`. Controls stay disabled until hydration; without JavaScript, direct contact details remain available. Server validation, bounded request bodies, same-origin checks, a honeypot, provider idempotency, timeouts and a basic per-process limiter protect the endpoint. A 202 response means the provider accepted delivery, not confirmed inbox receipt or a reservation. Missing configuration returns 503 and explicitly reports that nothing was sent.

## Architecture

Content routes are prerendered; enquiry delivery runs on the server. Internal navigation uses Next Link. Collection images use Next Image, responsive sizes and local source photographs. Fonts are served locally with their licenses. Full motion stays enabled automatically without a toggle, as requested. The gallery intentionally has no zoom.

`out/` is a generated HTML test snapshot, not a deployable backend. See DEPLOYMENT.md.

## Remaining launch inputs

Reference collections are not verified individual homes. Inventory, pricing, media rights, approved policies, delivery account and booking/payment contracts still need owner verification. No live booking or payment is implemented.

Audit scores require fresh deployed measurements. Source fixes alone do not establish WCAG certification, field Core Web Vitals, inbox delivery or legal compliance.
