# Next.js migration verification — 13 November 2026

Next.js 16.4.6 App Router / React 19.3.1 production build passed. All 14 content routes and the custom not-found view export successfully. Eight automated checks pass: date boundaries, nights summary, chapter relationships/order, route headings/IDs/links, preview restrictions, truthful collection content, actual Next.js hydration bundle references and safe local HTTP boundaries.

Browser checks against the production export covered chapter selection and arrow-key navigation; gallery open/next/zoom/Escape; collection filtering and full A–Z ordering; reversed dates blocked and corrected dates accepted; eight-night/four-guest context through collection detail and Contact; guest email draft preparation; owner mode excluding guest fields; mobile menu opening and Escape dismissal; form-first mobile ordering; no horizontal overflow at desktop, 390px and 320px samples. Sampled browser error/warning logs were empty.

FAQ section/footer dimensions remained unchanged closed/open: desktop section 552px and footer offset 4761px; 390px mobile section 834px and footer offset 6516px. Animations remain automatic, without a preference control.

No live email was sent, payment taken or booking created. Copy/download paths are implemented but were not exercised in this browser pass. Physical devices were not tested. Production inventory, provider integrations, policy approval and media rights remain outstanding business inputs.

## Entry animation restoration — 14 November 2026
Restored the pre-migration word-by-word title reveal across all page H1s using a shared server-rendered React AnimatedHeading component. CSS starts the 950ms masked slide/rotation on first paint, with 85ms word staggering capped at 425ms. Original emphasis and line breaks remain React-owned; the heading exposes one accessible name. No post-hydration text replacement is used.

Restored staggered intro copy, delayed hero wipe and grouped scroll entrances, including static collection cards. No motion toggle was introduced. Build and all nine tests pass, including a new server-rendering check for heading semantics and delays.

Browser checks confirmed distinct animated transforms and delays on reload, six staggered words on About, no sampled console warnings/errors, and no overflow at desktop/390px mobile. Homepage title height stayed 140px during/after desktop entry and 110px during/after mobile entry. Mobile FAQ opening kept footer offset at 6516px. Physical devices were not tested. Business integration limitations remain unchanged.

## Current runtime update — 14 November 2026

The audit remediation described in VERIFICATION.md replaces static-only hosting, email drafts, forced full motion and blocked indexing. Use README.md and DEPLOYMENT.md for current setup. Gallery zoom remains removed. Historical browser checks above are not fresh checks of this release.

Full motion is enabled again at the owner's request (14 November 2026); see the latest VERIFICATION.md entry.
