# SEO & Environment Configuration

Covers the SEO files added in Sprint 2 and the environment variables they depend on.

## Canonical site URL

Every SEO surface (sitemap, robots, and the metadata added in SEO-01) needs to know the
site's real public address. It is **not hardcoded** — it is resolved at build time in
[`devcon/lib/site-config.ts`](../devcon/lib/site-config.ts), in this order:

| Priority | Source | Notes |
|---|---|---|
| 1 | `NEXT_PUBLIC_SITE_URL` | Set this explicitly to the production domain. Takes priority. |
| 2 | `VERCEL_PROJECT_PRODUCTION_URL` | Supplied automatically by Vercel; no setup needed. |
| 3 | `http://localhost:3000` | Development fallback. |

> ⚠️ **Deployment action required.** Until `NEXT_PUBLIC_SITE_URL` is set in the Vercel
> project (or the deployment relies on Vercel's own variable), the sitemap and robots files
> will publish `localhost` URLs, which search engines will ignore. Set it once in
> **Vercel → Project → Settings → Environment Variables**.

Trailing slashes are stripped automatically, so both `https://example.com` and
`https://example.com/` are safe.

## Files

### `app/sitemap.ts` → `/sitemap.xml`

Generates the sitemap using the Next.js `MetadataRoute.Sitemap` convention.

The site is currently a **single landing page**. In-page anchors (`#about`, `#events`, …)
are deliberately *not* listed as separate entries — crawlers treat them as the same
document, and listing them would be misleading. Add entries here when real routes appear
(for example the Terms and Privacy pages from LEGAL-01).

### `app/robots.ts` → `/robots.txt`

Allows crawling of everything except `/api/`, which holds no indexable content (such as the
contact submission endpoint from CON-01). It advertises the sitemap location and the
canonical host, both derived from the same resolved site URL.

## Verifying locally

```bash
cd devcon && pnpm build
```

The build output should list `/robots.txt` and `/sitemap.xml` as static routes. To check the
production values, build with the variable set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com pnpm build
```

You can also run `pnpm dev` and open `http://localhost:3000/robots.txt` and
`http://localhost:3000/sitemap.xml` directly.

## Icons — partially complete

`app/favicon.ico` is present and serves as the browser tab icon. A **full app-icon set**
(Apple touch icon and the 192px/512px PNGs used by Android and PWA installs) still needs
source assets from the designer. Once provided, place them in `app/` using the Next.js
metadata file convention (`icon.png`, `apple-icon.png`) and they are picked up
automatically — no code change required.
