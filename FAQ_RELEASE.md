# FAQ interaction refinement — 12 November 2026

Replaced the native disclosure height animation with progressively enhanced button/region accordions. Native details remain available without JavaScript. Answers use a reversible 380ms grid expansion with text fade/slide and coordinated icon rotation. One answer opens at a time. Closed content is excluded from assistive navigation with aria-hidden and inert; native buttons support Enter and Space. Keyboard focus remains visible with an inset outline.

Each group reserves room for its longest answer and recalculates when width or fonts change. Layout measurements use unscaled dimensions and allow fractional row rounding. This prevents the following section/footer from jumping during disclosure changes.

Browser verification: desktop closed/open values were section 552px, footer offset 4751px and page height 5215px; all unchanged on opening. At 390px width, switching answers preserved section 834px, footer offset 6514px and page height 7379px with no horizontal overflow. Repeated toggles, answer exclusivity, keyboard Enter/Space and the Monthly Stays shared accordion were checked. Build, module syntax and eight automated tests passed. These are local browser checks, not physical-device measurements.

Navbar and logo styling were reviewed but not changed. Suggested directions: a warm editorial header with an approved dark logo; full-width charcoal using the existing white logo without a separate tile; or a photographic hero overlay requiring additional layout/contrast work. Warm editorial is the recommendation. The exact supplied white logo artwork remains unchanged.
