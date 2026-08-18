import { defineConfig } from "astro/config";

export default defineConfig({
  // Canonical origin. Must match the redirect target in public/.htaccess
  // and SITE_URL in scripts/prepare-assets.ts.
  site: "https://www.damiansinczak.dev",
  output: "static"
});
