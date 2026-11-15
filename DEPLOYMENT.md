# Deployment

## Next.js server deployment

Use a Next.js Node-compatible host with Node 22+. Install with `npm ci`, build with `npm run build`, and run `npm start`. On Vercel use the Next.js preset. Set `NEXT_PUBLIC_SITE_URL` to the final canonical origin before building. Configure `RESEND_API_KEY`, `ENQUIRY_FROM`, `ENQUIRY_TO` and `ENQUIRY_ORIGIN` as secret runtime variables. Test delivery to an approved inbox before launch.

The server supplies the POST endpoint, image optimizer and security headers. Enforce HTTPS at the host. HSTS is emitted; confirm all headers on the final HTTPS domain. The CSP restricts framing, objects, base URLs and form destinations; it is not a complete script-src policy.

The in-memory email limiter is best effort per process. Before public promotion add a shared deployment-layer rate limit or bot protection. Confirm retention, recipients and processor terms for the final privacy policy.

## Optional Cloudflare deployment

The optional `build:worker` adapter encounters an esbuild ancestor-directory permission error in the current Windows environment. Validate its build and runtime on the target platform before deployment. A static export cannot execute the enquiry endpoint; do not deploy `out/` as the working application. The standard Next.js server build is verified.

Approve production content and verify the final host's access settings before launch.
