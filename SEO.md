# Search strategy and launch checks

Reviewed 16 November 2026. This website introduces accommodation that Shining can help arrange. It does not publish individual available properties or accept instant bookings.

## Page intent

These are editorial search-intent choices, not measured keyword volumes or ranking forecasts.

| Page | Primary intent | Useful next step |
| --- | --- | --- |
| Home | Shining Vacation Homes; Dubai holiday and monthly stays | Share stay requirements |
| Accommodation | Dubai holiday apartments, townhouses and villas | Compare styles; enquire |
| Monthly stays | Monthly apartment and villa stays in Dubai | Compare total cost and practical needs; enquire |
| Six accommodation guides | Specific accommodation style in Dubai | Review layout and suitability questions; request actual options |
| Property management | Holiday home property management in Dubai | Discuss owner requirements and proposed scope |
| About | Brand background and approach | Choose guest or owner enquiry |
| Contact | Brand contact and accommodation enquiries | Send requirements or contact the team directly |
| Privacy / booking information | Understand data use and the enquiry process | Review before submitting or confirming |

## Implemented

- Unique titles and descriptions across all 14 content routes, including Dubai and the relevant service where appropriate.
- Server-rendered page content and metadata; canonical URLs, Open Graph URLs and sitemap entries share the configured public origin. Enquiry parameters do not create separate canonical pages.
- Page-specific social images for accommodation guides, monthly stays and property management. Photographs remain explicitly illustrative.
- Stable Organization identity with the existing business logo, published telephone/email and Dubai service area. WebSite markup on the homepage identifies the brand; page markup references that same identity.
- Breadcrumb markup and visible accommodation-guide navigation agree. Descriptive guide links and monthly-stay links support exploration between related pages.
- Monthly-stay guidance covers complete quotes, everyday facilities, extensions and cancellation questions without inventing inclusions or contractual terms.
- Index/follow directives, large image preview permission, public sitemap, API exclusion in robots, native responsive image optimization and local fonts.

No invented inventory, prices, guest ratings, street address, opening hours, licences or service guarantees were added. There is no VacationRental, Product, Offer or rating markup. General Organization/WebPage markup is descriptive and does not promise a special search result. FAQs remain useful visible content; a commercial accommodation site should not expect Google's restricted FAQ rich results.

## Before publishing

1. Set NEXT_PUBLIC_SITE_URL to the final HTTPS canonical origin and ENQUIRY_ORIGIN to the same origin. Rebuild after changes. Redirect alternate hosts and HTTP to that origin in the hosting/domain settings. Keep staging and duplicate preview deployments behind access protection or host-level noindex; do not block production assets needed for rendering.
2. Inventory the original site's actual indexed URLs through Search Console and a source export. Preserve useful paths or add individual permanent redirects to equivalent pages. Do not send every old URL to the homepage. Current guide URLs are retained; a complete legacy URL export has not been supplied.
3. Verify domain ownership in Google Search Console and Bing Webmaster Tools using the account owner's DNS records. Submit /sitemap.xml. Inspect the homepage, monthly stays and a guide to confirm Google's rendered content and chosen canonical. No account access or verification token is currently available.
4. Validate deployed structured data with Schema Markup Validator and breadcrumb markup with Google's Rich Results Test. Local tests validate JSON, identity references and generated HTML; these do not substitute for Google's live inspection.
5. Confirm the business contact information, image rights, privacy details and proposed service wording with the company. If eligible, maintain an owner-controlled Google Business Profile with accurate business details; do not create a fictitious office location.
6. Measure actual mobile LCP, INP and CLS after deployment, then use Search Console queries, impressions, clicks and completed enquiries to refine content. No field metrics, keyword volumes or rankings have been measured in this change.

## Research

- Original business site: https://shiningvacationhomes.com/ — confirms the published contact details, six accommodation categories and short/mid-term management positioning. Old advertised prices and income claims were not imported because current commercial terms are unverified.
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide — useful content, descriptive titles and crawlable links.
- https://developers.google.com/search/docs/appearance/structured-data/organization — factual business identity and logo information.
- https://developers.google.com/search/docs/appearance/site-names — homepage WebSite markup and consistent brand naming.
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb — hierarchy markup consistent with navigation.
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls — canonical URLs, redirects and sitemap consistency.
- https://developers.google.com/search/blog/2023/08/howto-faq-changes — FAQ rich results restricted to authoritative government/health sites.

Search visibility depends on deployment, crawlability, useful verified content, competition and ongoing measurement. These improvements cannot guarantee indexing or rankings.
