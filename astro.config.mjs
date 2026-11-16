import { defineConfig } from "astro/config";
import { siteConfig } from "./src/core/site/config";

export default defineConfig({
  // Canonical origin lives in src/core/site/config.ts so that the page head,
  // the sitemap generator and this file cannot drift apart. Setting `site`
  // is what makes `Astro.site` available for canonical/OG URL construction.
  site: siteConfig.url,
  output: "static",
  // The production CSP is `script-src 'self'`, which blocks inline scripts.
  // Astro inlines small hoisted <script> blocks below this limit, so force
  // every script into an external file.
  vite: {
    build: { assetsInlineLimit: 0 }
  }
});
