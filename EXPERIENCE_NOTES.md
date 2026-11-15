# Full animation and interaction release — 13 November 2026

This update supersedes the earlier subtle-motion settings.

## Visible movement

- Word-by-word masked headings, 950 ms with stagger capped at 425 ms.
- Hero photograph wipe and movement, 1150 ms; image responds to desktop pointer position and scroll offset within its reserved frame.
- One-time section entrances, 56 px/scale with 760 ms duration and capped stagger.
- Filters and sorting use before/after positions to animate cards into place, 620 ms, with interruption support.
- Cross-document transitions on supporting browsers; normal navigation and entrances remain the fallback.
- Existing animated FAQs, mobile menu, hover/focus feedback, plus scroll progress and a back-to-top control.

## Functional interactions

Collection and hero Quick view opens a native dialog with six representative collection photographs, previous/next buttons, arrow-key navigation, zoom, Escape/backdrop close and focus return. All images are explicitly labelled representative property-type photography, never individual verified homes. The current collection's enquiry link retains dates/guest count, including unsent search-field changes.

Search controls update a nights/guest summary using UTC date differences, without claiming availability. No bookings, payment or enquiry deliveries were added or simulated.

## Motion control and accessibility

The preview browser reported `prefers-reduced-motion: reduce`, explaining the absence of earlier animation. The top-bar **Enable motion / Reduce motion** control provides an explicit site-only override saved as `shining-motion` in localStorage. The operating-system preference is not changed. By default, the site still follows the system setting. Reduced mode keeps galleries, search, filters and native FAQs functional.

Static content is visible without JavaScript. Dialogs use native focus trapping/Escape and explicit close/previous/next/zoom controls. There is no scroll interception or full-page animation overlay that blocks pointer input.

## Verification

Build, syntax checks and seven automated tests pass, covering motion defaults/explicit overrides, reduced-motion cancellation, night calculation/date boundaries, local module MIME type, HTTP boundaries and the existing route/content checks. Browser verification includes enabling full motion (masked heading words present), disabling it (masks absent), gallery opening/navigation/zoom/Escape/focus return, contextual enquiry links, live trip summaries and animated filters/sorting. Responsive route sweep and publication details are in the release-readiness report packaged with the source.

No physical-device, screen-reader certification or Core Web Vitals score is claimed. Existing genuine-inventory/provider/policy/media-rights dependencies remain unchanged.
