import { defineConfig } from "astro/config";
import { siteConfig } from "./src/core/site/config";

export default defineConfig({
  // Canonical origin lives in src/core/site/config.ts so that the page head,
  // the sitemap generator and this file cannot drift apart. Setting `site`
  // is what makes `Astro.site` available for canonical/OG URL construction.
  site: siteConfig.url,
  output: "static"
});
