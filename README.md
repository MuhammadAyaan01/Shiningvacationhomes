# Shining Vacation Homes

Next.js App Router and React with shared CSS and the approved warm editorial design. Node.js 26.x is the verified production target.

## Run locally

Run `npm ci`, `npm run build`, `npm test`, then `npm run preview`. The local production preview runs at http://127.0.0.1:4173/. For hot reload, use `npm run dev` instead. Stop another server on that port first.

## Enquiries

Copy `.env.example` to `.env.local`. Configure `RESEND_API_KEY`, `ENQUIRY_FROM` (a verified sender) and `ENQUIRY_TO`. Set `ENQUIRY_ORIGIN` to the exact deployed HTTPS origin behind a proxy. Restart after configuration. Never commit secrets.

The form posts JSON to `/api/enquiry/`. Controls stay disabled until hydration; without JavaScript, direct contact details remain available. Server validation, bounded request bodies, same-origin checks, a honeypot, provider idempotency, timeouts and a basic per-process limiter protect the endpoint. A 202 response means the provider accepted delivery, not confirmed inbox receipt or a reservation. Missing configuration returns 503 and explicitly reports that nothing was sent.

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
