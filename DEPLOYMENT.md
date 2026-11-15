# Deployment

## Next.js server deployment

Use a Next.js Node-compatible host with Node 22+. Install with `npm ci`, build with `npm run build`, and run `npm start`. On Vercel use the Next.js preset. Set `NEXT_PUBLIC_SITE_URL` to the final canonical origin before building. Configure `RESEND_API_KEY`, `ENQUIRY_FROM`, `ENQUIRY_TO` and `ENQUIRY_ORIGIN` as secret runtime variables. Test delivery to an approved inbox before launch.

The server supplies the POST endpoint, image optimizer and security headers. Enforce HTTPS at the host. HSTS is emitted; confirm all headers on the final HTTPS domain. The CSP restricts framing, objects, base URLs and form destinations; it is not a complete script-src policy.

The in-memory email limiter is best effort per process. Before public promotion add a shared deployment-layer rate limit or bot protection. Confirm retention, recipients and processor terms for the final privacy policy.

## Sites hosting limitation

The previous hosted version was a static export. It cannot execute the new endpoint. The optional `build:worker` adapter was attempted on Windows and is blocked by an esbuild ancestor-directory permission error. It is not a validated deployment target. Do not deploy `out/` or claim the hosted site has the new backend. A successful Worker build and runtime validation are required before updating that deployment; alternatively deploy to a normal Next.js host.

Removing noindex does not change the hosting audience. Preserve existing owner-private access. Approved production content and public access remain separate launch decisions.
