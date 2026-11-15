# Subtle motion update — 13 November 2026

The approved visual direction is preserved. Motion is shared across every route through `app.js` and two small native browser modules/stylesheets, without new dependencies.

Page entrances: 480 ms with 65 ms stagger capped at 240 ms; homepage image 650 ms. Scroll entrances: 16 px, once per element, with a maximum 165 ms group stagger. Buttons and arrows: 180–220 ms. Collection results: 240 ms, stagger capped at 105 ms. Mobile menu: 180 ms. FAQ opening: 260 ms; closing: 190 ms, with repeated activation cancelling/reversing the previous transition.

No page-exit delays, scroll interception, continuous background motion, automatic carousel or permanent hidden reveal styles. Web Animations API drives entrances; IntersectionObserver triggers scroll reveals. Unsupported browsers retain visible content and native disclosure behaviour.

Reduced motion: automatic preference detection skips entrances and observers; a preference change cancels tracked animations; CSS suppresses transforms/transitions. Native FAQ behaviour remains available. No operating-system setting was changed during verification.

Validation: build and five automated tests pass, including reduced-motion no-op and cancellation checks. Browser checks cover FAQ opening/closing, double activation, keyboard Enter, filter/reset and alphabetical sorting with no errors in the sampled console. Final route/viewport results and publication outcome are recorded in the release-readiness report included with the downloadable source package.

Existing production dependencies (inventory, booking/payment, delivered enquiries, approved policies and media rights) remain unchanged.
