# Warm editorial header — 12 November 2026

Applied the selected warm editorial direction to the shared header across all generated pages: transparent logo treatment on the cream canvas, stronger navigation, a light divider and a blue Find your stay CTA linking to the collection page. Mobile navigation uses the same canvas, includes the stay CTA and retains the contact link, keyboard focus and Escape dismissal.

The new ink SVG is a colour-only derivative of the supplied white logo. All SVG geometry, viewBox and luminance masks are unchanged; the original white artwork remains intact. No replacement artwork was generated.

Build and eight existing automated checks passed. Browser checks covered the normal desktop layout, 901px breakpoint, 390px and 320px widths with no horizontal overflow or logo/menu collision; mobile menu opening, Escape dismissal and CTA navigation; the Stays active-link state and logo home link. Physical devices were not tested. Existing preview, booking and enquiry limitations remain unchanged.

## Mobile menu refinement — 14 November 2026
Fixed hero text showing over the mobile dropdown by giving the shared header an explicit isolated stacking layer above page animations. Replaced display toggling with a reversible 320ms clipped slide, opaque cream panel and staggered links. The button now transitions between Menu/two-line icon and Close/X.

Closed mobile links are inert and aria-hidden throughout closing; desktop links remain accessible. Escape closes with button focus restored, outside pointer clicks dismiss, navigation closes the panel, and crossing the 900px breakpoint resets the state. Short screens can scroll within the menu.

Production build and all nine existing tests passed. Browser checks covered the supplied approximately 517px layout, 390px mobile, 320x400 short viewport and 1000px desktop. Confirmed opaque menu layering, opening and closing transition values, hidden final state, Tab skipping closed links, Escape focus return, outside dismissal, breakpoint reset and Monthly Stays navigation. At 320x400 the panel scrolls within its 286px height limit without horizontal overflow. Sampled console error/warning logs were empty. Physical devices were not tested.

## Menu hover contrast and focus ring — 14 November 2026
The mobile stay CTA now explicitly keeps white text/arrow on hover, keyboard focus and active states, with a darker blue background. Its colour/background transitions start immediately instead of inheriting the opening stagger delay. The Menu button uses a 2px inset focus outline, removing the gap outside its border while retaining keyboard visibility.

Production build passed. Browser verification exercised actual pointer hover: CTA text and arrow remained rgb(255,255,255), with zero delay on colour/background. Keyboard verification confirmed focus-visible with outline-offset -2px. These are scoped CSS changes; physical devices were not tested.
