# MSD Professional

The MSD marketing site, converted from a single static `index.html` to a Next.js 15 App Router
app. Products are pulled live from the Barber Syndicate API.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Data

All product data comes from `https://barbersyndicate.in/api`:

| Endpoint | Used by |
| --- | --- |
| `GET /products/brand/msd` | homepage best sellers, `/products` catalogue, `generateStaticParams` |
| `GET /products/{slug}` | `/products/[slug]` detail pages |
| `GET /categories` | category slugs and CMS images, joined onto the brand's products |
| `GET /products/search?q=` | keyword matches for search (spans all brands, so results are scoped to MSD) |

Fetching lives in [lib/api.ts](lib/api.ts). Responses are cached and revalidated every 10 minutes
(ISR), so pages are served as static HTML and refresh in the background. `getProducts()` walks
`meta.last_page`, so it keeps working if the catalogue grows past one page.

## Routes

- `/` — the original landing page, section for section, with the best-seller grid now driven by the API.
- `/products` — the full catalogue with client-side search and sort. Accepts `?q=` (the footer links use it).
- `/api/search?q=&limit=` — the site's own search endpoint, used by the header search and the catalogue.
- `/category/[slug]` — every MSD product in one category, under a hero showing the category image.
- `/products/[slug]` — detail page: image gallery, price/MRP/saving, SKU, stock, and the CMS description.

## Notes

- **Fonts.** Bricolage Grotesque (display) and Instrument Sans (text), self-hosted via `next/font`
  — no render-blocking Google Fonts request and no layout shift. Prices and stats use tabular numerals.
- **Images.** Local art moved to `public/assets/` with readable filenames and is statically imported so
  `next/image` can optimise it. Remote product images are allow-listed in `next.config.mjs`.
- **Categories.** The navbar, homepage grid, `/products` tiles and footer all come from
  [lib/categories.ts](lib/categories.ts): only categories that hold MSD products are shown, largest first.
  Category image order is: the CMS image → brand art mapped by slug → a product photo from that category.
  Uploading an image in the CMS replaces the fallback automatically.
- **Search.** The header search (click the icon or press `/`) shows live results; Enter or "See all results"
  opens `/products?q=`. Results are name matches first — every word must match the start of a word in
  the name or category, plurals included, ranked in [lib/search.ts](lib/search.ts) — then keyword matches
  from the API that aren't in the name (e.g. "callus" finds foot files), labelled "Keyword match".
- **CMS HTML.** Product descriptions are rendered through [lib/sanitize.ts](lib/sanitize.ts), which strips
  scripts and inline event handlers before `dangerouslySetInnerHTML`.
- The original `index.html` is kept at the repo root for reference only. Its `assets/…` image paths no
  longer resolve, since those files moved into `public/assets/`.
