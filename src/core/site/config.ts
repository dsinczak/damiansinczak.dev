/**
 * Single source of truth for the site's public identity.
 *
 * Before this file existed the canonical origin was written out three times
 * (astro.config.mjs, public/.htaccess, scripts/prepare-assets.ts) and nothing
 * stopped them drifting apart. Everything that needs the origin now imports it
 * from here; `.htaccess` is the one consumer that cannot import TypeScript, so
 * a test asserts that its rewrite rules still agree with `host`.
 */

export const siteConfig = {
  /** Canonical origin, no trailing slash. */
  url: "https://www.damiansinczak.dev",
  /** Canonical host, used to verify the .htaccess rewrite rules. */
  host: "www.damiansinczak.dev",
  /** BCP 47 tag for <html lang> and hreflang. */
  lang: "en",
  /** Open Graph locale (underscore form, unlike `lang`). */
  ogLocale: "en_US",
  /** Human-readable site name for og:site_name and JSON-LD. */
  name: "Damian Sińczak",
  /** Generated share card, produced by scripts/generate-og-image.ts. */
  ogImage: {
    path: "/og-image.png",
    width: 1200,
    height: 630,
    type: "image/png"
  },
  /** Agent-facing plain-text mirrors of the profile. */
  llms: {
    index: "/llms.txt",
    full: "/llms-full.txt"
  },
  /**
   * Atom feed of the blog. Never move it: readers that do not follow the 301
   * from the old URL silently stop receiving posts.
   */
  feed: {
    path: "/blog/feed.xml",
    type: "application/atom+xml",
    /** Newest posts kept in the feed; older ones stay reachable via the sitemap. */
    limit: 20
  },
  /** Where security researchers should write. Published at /.well-known/security.txt */
  securityContact: "mailto:damian.sinczak@gmail.com"
} as const;

/** Absolute URL for a site-root-relative path. Trailing/leading slashes are normalised. */
export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${siteConfig.url}/`).toString();
}
