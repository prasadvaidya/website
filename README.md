# Personal Website

## Product and idea landing pages

The `/products/` section is driven by MDX files in `src/content/products/`. It uses one stable URL and automatically changes the page CTA based on `mode`:

- `mode: "waitlist"` renders an email waitlist form.
- `mode: "live"` renders the product’s primary action.

Start by duplicating one of these files:

- `_idea-waitlist-template.mdx` for validation and early-access pages.
- `_live-product-template.mdx` for products people can use or buy now.

Rename the copy to the desired URL slug—for example, `meeting-memory.mdx` becomes `/products/meeting-memory/`. Replace all instructional copy and placeholder URLs, then set `draft: false`.

Keep the same filename when an idea launches. Change `mode` from `waitlist` to `live`, remove the `waitlist` block, and add `primaryCta`. The canonical URL stays unchanged, preserving campaign links and accumulated search value.

### Product use-case pages

Use-case pages can live beneath a core product URL. Place the MDX file in a folder matching the parent slug—for example, `mental-offloading/work-context-switching.mdx`—and set:

- `parentProduct` to the core product slug.
- `listingAudience`, `listingTitle`, and `listingDescription` for the cross-link card.

The core page automatically links to its use cases, use-case pages link to their siblings and parent, and only the core product appears in the `/products/` index. Every waitlist form submits its full page path through the `source` field so registrations can be compared by audience and intent.

### Waitlist form connection

Waitlist forms submit to Web3Forms. Set `PUBLIC_WEB3FORMS_ACCESS_KEY` locally and in the hosting environment; Web3Forms access keys are designed to be included in public HTML forms. Until the key is present, the submit button remains safely disabled.

Every registration sends the stable `product` identifier, human-readable `funnel` name, exact `source` route, `cta_location`, full `landing_page`, browser `referrer`, and the five standard UTM fields. This makes the core, work-continuity, creative-continuity, and evening-reset funnels directly comparable in Web3Forms exports.

### SEO checklist before publishing

- Give each page a unique `seoTitle` and 140–160 character `description`.
- Use one primary search phrase plus two or more close use-case phrases in `keywords`.
- Write a specific headline, audience, problem, and outcome; avoid generic product claims.
- Replace every placeholder FAQ with real buying or adoption questions.
- Add only verifiable proof and remove the `proof` entries when evidence is not available.
- Add a 1200 × 630 social image through `ogImage` when the product has its own visual identity.
- Set `draft: false`, run the production build, and test the form endpoint before sharing the URL.
