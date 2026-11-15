# Next.js migration verification — 13 November 2026

Next.js 16.4.6 App Router / React 19.3.1 production build passed. All 14 content routes and the custom not-found view export successfully. Eight automated checks pass: date boundaries, nights summary, chapter relationships/order, route headings/IDs/links, preview restrictions, truthful collection content, actual Next.js hydration bundle references and safe local HTTP boundaries.

Browser checks against the production export covered chapter selection and arrow-key navigation; gallery open/next/zoom/Escape; collection filtering and full A–Z ordering; reversed dates blocked and corrected dates accepted; eight-night/four-guest context through collection detail and Contact; guest email draft preparation; owner mode excluding guest fields; mobile menu opening and Escape dismissal; form-first mobile ordering; no horizontal overflow at desktop, 390px and 320px samples. Sampled browser error/warning logs were empty.

FAQ section/footer dimensions remained unchanged closed/open: desktop section 552px and footer offset 4761px; 390px mobile section 834px and footer offset 6516px. Animations remain automatic, without a preference control.

No live email was sent, payment taken or booking created. Copy/download paths are implemented but were not exercised in this browser pass. Physical devices were not tested. Production inventory, provider integrations, policy approval and media rights remain outstanding business inputs.

## Entry animation restoration — 14 November 2026
Restored the pre-migration word-by-word title reveal across all page H1s using a shared server-rendered React AnimatedHeading component. CSS starts the 950ms masked slide/rotation on first paint, with 85ms word staggering capped at 425ms. Original emphasis and line breaks remain React-owned; the heading exposes one accessible name. No post-hydration text replacement is used.

Restored staggered intro copy, delayed hero wipe and grouped scroll entrances, including static collection cards. No motion toggle was introduced. Build and all nine tests pass, including a new server-rendering check for heading semantics and delays.

Browser checks confirmed distinct animated transforms and delays on reload, six staggered words on About, no sampled console warnings/errors, and no overflow at desktop/390px mobile. Homepage title height stayed 140px during/after desktop entry and 110px during/after mobile entry. Mobile FAQ opening kept footer offset at 6516px. Physical devices were not tested. Business integration limitations remain unchanged.

## Mobile menu refinement — 14 November 2026
Fixed hero text showing over the mobile dropdown by giving the shared header an explicit isolated stacking layer above page animations. Replaced display toggling with a reversible 320ms clipped slide, opaque cream panel and staggered links. The button now transitions between Menu/two-line icon and Close/X.

Closed mobile links are inert and aria-hidden throughout closing; desktop links remain accessible. Escape closes with button focus restored, outside pointer clicks dismiss, navigation closes the panel, and crossing the 900px breakpoint resets the state. Short screens can scroll within the menu.

Production build and all nine existing tests passed. Browser checks covered the supplied approximately 517px layout, 390px mobile, 320x400 short viewport and 1000px desktop. Confirmed opaque menu layering, opening and closing transition values, hidden final state, Tab skipping closed links, Escape focus return, outside dismissal, breakpoint reset and Monthly Stays navigation. At 320x400 the panel scrolls within its 286px height limit without horizontal overflow. Sampled console error/warning logs were empty. Physical devices were not tested.

## Menu hover contrast and focus ring — 14 November 2026
The mobile stay CTA now explicitly keeps white text/arrow on hover, keyboard focus and active states, with a darker blue background. Its colour/background transitions start immediately instead of inheriting the opening stagger delay. The Menu button uses a 2px inset focus outline, removing the gap outside its border while retaining keyboard visibility.

Production build passed. Browser verification exercised actual pointer hover: CTA text and arrow remained rgb(255,255,255), with zero delay on colour/background. Keyboard verification confirmed focus-visible with outline-offset -2px. These are scoped CSS changes; physical devices were not tested.

## Shared focus treatment across the site — 14 November 2026
Consolidated keyboard focus in src/focus.css and removed competing outline declarations from the base, motion, chapter, gallery and header styles. Focus indicators are consistently 2px: flush with text links/cards/panels and inset on buttons/form controls. Filled buttons and dark regions use white indicators for contrast. Removed the extra focus shadows around search/enquiry forms. No positive outline offsets remain in application styles.

Production build and all nine automated checks passed. Browser keyboard samples confirmed 2px focus indicators with 0px or -2px offsets across mobile/desktop navigation, logo, primary CTAs, search fields, chapter tabs/panels, FAQs, gallery controls, active filters, sorting, collection cards, enquiry inputs/textarea/submit and footer links. Focus remained visible. The chapter tab test followed its keyboard-selected tab rather than the inactive starting tab. Physical devices were not tested.

## Inset focus correction verified with Tab - 14 November 2026
The shared focus rule now uses outline-offset -2px for every focusable element, including links, cards and panels. Removed the 0px link exception that left outlines outside menu rows. Keyboard visibility and contrasting white rings remain.

Rebuilt the production export; all nine tests passed. Actual Tab navigation verified all six mobile menu links/CTA, the Menu button, check-in field, guest select, FAQ trigger, desktop navigation and collection sort select. Sampled focused elements reported focus-visible with -2px offset; screenshots confirmed menu and sort borders meet the inset ring. Physical devices were not tested.

## Button-only inset focus - 14 November 2026
Revised at the user's request: links, cards, fields and panels use a 2px outward offset again. Only buttons and button-styled links use the zero-gap inset ring (-2px offset). Keyboard focus remains visible.
Production build passed. Real Tab checks confirmed Stays uses a 2px outer offset and the Close button remains focus-visible with a -2px inset offset. Screenshot captured for the button treatment.

## Unified focus reset - 14 November 2026
Removed the recent inset-button exceptions at the user's request. All keyboard targets now share a restrained 2px ring with 2px breathing room; dark sections retain a contrasting white ring. This replaces both prior all-inset and button-only variants.
Production build passed. Tab checks on desktop navigation and the header CTA confirmed the same 2px blue ring and 2px offset; the final header view was visually reviewed and captured.

## Editorial chapter selector - 14 November 2026
Added a cream segmented panel with a sliding white selection card, restrained blue accent and inline chapter numbers. Retained photo/text entrance motion and arrow/Home/End navigation. Re-selecting the active chapter avoids replaying the animation. Inactive panels reserve layout space in the same grid cell while remaining invisible, aria-hidden and inert, so different chapter lengths do not move the next section.

Production build and all nine tests passed, including an inactive-panel accessibility assertion. Browser checks covered 320px and 390px mobile and 1280px desktop, click selection, arrow/Home/End keys, Tab into the active panel, no horizontal overflow and the 420ms indicator transition. At 320px all three chapter states held a constant 458px panel height. At 390px all labels fit on one line; touch targets remained 56px high. Physical devices were not tested.

## Desktop and tablet chapter composition - 14 November 2026
Above 760px the selector is now a compact 480px strip above the complete story, with 46px buttons. Desktop image and copy start on the same row rather than floating at different heights. Between 761px and 1000px the story uses a wide 16:9 image with readable copy below and a selector capped at 520px. The approved mobile photo-first arrangement, 56px buttons and selector sizing remain.

Production build and all nine tests passed. Browser review covered 1280px desktop, 1024px landscape, 820px tablet and 390px mobile. Confirmed alignment, no horizontal overflow, preserved mobile photo-first order and 70px selector/56px buttons, arrow-key selection and Tab into the active panel. Desktop and tablet screenshots captured. Physical devices were not tested.

## Desktop editorial chapter navigation - 14 November 2026
At widths above 1000px, replaced the isolated cream selector with text tabs and a sliding blue underline beside the section heading. The image and copy occupy the next aligned grid row. Mobile and tablet rules remain unchanged. CSS-only implementation; no new dependencies.

Source and diff checks passed. Browser automation was unavailable for this revision, so the new desktop composition has not received a fresh visual or interaction check.
Production build and all nine tests passed. The existing local preview responded with HTTP 200 after the rebuild.

## Keep desktop tabs within the story column - 14 November 2026
Removed the desktop section-level grid placement that promoted the tabs beside the section heading. Restored the actual right-hand content container as a block containing both tab navigation and chapter panels. The story grid aligns the photo and this content container at the top. Retained the desktop underline treatment and existing mobile/tablet layouts.

Source and diff checks passed. Browser automation remains unavailable; no fresh visual verification is claimed.
Production build and all nine existing tests passed after the container correction.

## Tablet uses photo-first chapter container - 14 November 2026
Removed the obsolete display-contents/grid-promotion rules that placed tablet navigation above the photo. At 761–1000px, the photo now precedes the intact story content container; the cream selector spans its full width above the panels, with the shared 56px buttons and 24px panel spacing. Retained the tablet 16:9 photo and existing desktop text-tab/mobile treatments.

Source and diff checks passed. Browser automation is unavailable in this session, so a fresh tablet visual check has not been performed.
Production build and all nine existing tests passed after the tablet correction.

## Restore original photograph resolution - 14 November 2026
The original homepage exposes 2000x1121 JPEGs for all six collections. Downloaded those exact originals unchanged and replaced thumbnail-only rendering with a shared responsive image component across hero/editorial images, chapter photography, cards, collection details and the photo dialog. Browsers can choose 768px/1200px WebP derivatives or the untouched 2000px original; fallback src is the original JPEG. Townhouse photography is now local too. Existing alt text, dimensions, lazy-loading/priority choices and animation DOM refs are preserved. Source URLs and processing are recorded in MEDIA_SOURCES.md. Added WebP MIME support and restarted the local preview.

Production build and all eleven tests passed, including responsive candidate file availability and checks that exported photos no longer use 600px thumbnail sources. Verified six original dimensions using the installed image library; local homepage and image routes returned HTTP 200, with JPEG/WebP content types correct after preview restart. Browser visual/interaction verification was unavailable for this change.

## Replace scrollbar zoom with screen-fit expansion - 14 November 2026
Removed the 160%-width zoom and all is-zoomed rules. Expand photo now enlarges the dialog within the viewport; the image stays contained in a flexible stage, with no image scrolling. A dark photo background, count/loading/error status, Previous/Next, Restore view and Close remain available. Expansion persists across collection changes and resets when closing. The details panel returns on Restore view. Regular dialog horizontal overflow is suppressed; expanded dialog overflow is hidden. Existing native dialog Escape/focus-return behaviour and high-resolution responsive image sources remain.

Source/diff checks passed. Browser interaction tools were unavailable, so no fresh screen-size or keyboard interaction verification is claimed for this change.
Production build and all twelve tests passed, including the gallery's accessible expand, close and navigation controls and removal of old zoom labels.

## Direct wheel zoom and bounded panning - 14 November 2026
Removed the Expand/Restore feature. The photo toolbar now contains Zoom out, a percentage/reset-to-fit control and Zoom in. A non-passive wheel listener zooms around the pointer over the photo; drag moves a zoomed photo within its fitted-image bounds. Scaling is limited to 1–4x, with reset per collection and resize re-clamping. Plus/minus/zero keys work when the photo stage is focused, and arrow keys pan a zoomed image while gallery navigation remains available elsewhere. Single-pointer touch dragging is supported after zooming via the controls. The photo stage stays clipped with no scroll-based zoom container. Photo entry uses opacity so it does not compete with the user-controlled transform. Loading/error status and original responsive images remain.

Production build and all fifteen tests passed. New geometry tests cover pointer anchoring, fit reset, pan bounds, scale limits, letterboxing and resize bounds. The exported gallery control check now verifies the top zoom controls and absence of expansion labels. Local stays returned HTTP 200 with the new controls. Browser interaction tools were unavailable, so wheel, drag and touch have not received a fresh browser/device check.

## Remove gallery zoom entirely - 14 November 2026
Removed the PhotoViewer zoom component, wheel handler, drag/pan state, keyboard zoom shortcuts, top controls, percentage/reset and zoom hints. Deleted the now-unused geometry helper and its tests. The gallery renders a fitted high-resolution photo, Previous/Next and Close, with existing loading/error status and native dialog behaviour. Removed all gallery zoom/expand styling. Wheel input is no longer intercepted.

Production build and all twelve remaining tests passed. The gallery regression check confirms navigation remains and zoom/expand labels and instructions are absent. Browser interaction verification was unavailable for this change.

## Remove gallery image letterboxing - 14 November 2026
Removed the fixed 53dvh/550px desktop and 39dvh mobile stage heights and the old grid sizing rules. Gallery images now render as a block at width 100% with automatic height, so the stage follows the photo's actual proportions rather than adding empty bands. Added the original 2000x1121 intrinsic dimensions to reserve space before loading. The full photograph remains uncropped, with no zoom feature. The dialog retains its existing viewport maximum height and vertical scrolling for content when necessary.

Production build and all twelve tests passed. Source checks confirm no fixed photo-stage height remains. Browser visual verification was unavailable for this correction.

## Balance gallery information and actions - 14 November 2026
Removed the 360px action-area cap that forced two buttons into an uneven stack. Desktop now uses a shrinking text column and an uncapped single action row aligned vertically with the summary. Shortened labels to View collection and Enquire about a stay, reduced redundant navigation/status copy and kept the reference-photo distinction. At 761–980px actions sit below the summary; the existing full-width stacked mobile buttons remain. Both destinations retain the selected collection context.

Production build and all twelve tests passed. Source and diff checks passed. Browser visual verification was unavailable for this change.

## Audit remediation — 14 November 2026

This section supersedes earlier static-export, enquiry-draft and forced-motion descriptions. The application now uses the Next.js server runtime with a POST enquiry API, Resend delivery template, safe disabled form before hydration, server validation and explicit delivery failure feedback. No real email was sent; sender credentials and approved recipients remain unconfigured.

Internal navigation uses Next Link; the search uses Next Form. Images use the native optimizer and accurate collection-row sizes. Above-the-fold high-priority images load eagerly; other images load lazily. Fonts and licensed font files are local. All 14 content pages have unique titles/descriptions, canonical tags, indexable metadata and sitemap entries. Organization and collection breadcrumb structured data are included. No full-motion override remains; CSS and JavaScript honor reduced motion. Input borders use #788592, and helper copy is larger. The scroll progress indicator no longer updates React state on each scroll frame.

Verification: production build passed; 19 automated tests passed before the final eager-image/scroll refinements. Runtime HTTP checks passed for all 14 content routes, configured security headers, protected POST boundaries (405/403/422), genuine 404, robots and sitemap. Real optimizer responses: 256px WebP 7,498 bytes; 384px WebP 13,438 bytes. Dependency audit reported zero known vulnerabilities. See the final verification run below for the completed refinements.

Limits: no browser automation was available for this pass; keyboard, responsive rendering, screen-reader, Lighthouse/field CWV and real inbox delivery need fresh verification. No new numeric audit score is asserted. Policies, media rights and property records need owner approval. The optional Windows Worker build failed on filesystem permissions; the existing hosted static deployment has not been updated with this backend. Use the supported Node/Next deployment described in DEPLOYMENT.md.

Final run: the production build and all 19 tests passed after the image/scroll refinements. Runtime checks passed again on the restarted Next.js server at port 4173. A valid dummy local enquiry returned 503 and an explicit not-sent message, confirming safe handling of absent delivery settings. Hero image markup confirms eager loading and high priority. No email was sent.

## Full motion restored — 14 November 2026

At the owner's request, full motion is enabled automatically across the site again. This supersedes the reduced-motion behavior in the audit remediation above. Restored JavaScript entrance effects, chapter/filter transitions, hero parallax and pointer movement, smooth back-to-top scrolling, and the full CSS animation path. No motion toggle or bar was added. The backend, routing, SEO and image improvements remain in place.

Verification: production build and all 19 automated tests pass. HTTP checks confirm full-motion markup on the homepage, stays and property-management pages. No fresh browser animation timing check was available.
