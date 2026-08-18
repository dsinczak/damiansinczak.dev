import fs from "node:fs";
import path from "node:path";
import { prepareProfileAssets } from "../src/core/assets/prepareAssets";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { validateProfile } from "../src/core/validation/validateProfile";

const SITE_URL = "https://www.damiansinczak.dev";

const parsed = parseProfileFile("content/profile.md");

if (!parsed.profile || parsed.errors.length > 0) {
  for (const message of parsed.errors) console.error(message.message);
  process.exit(1);
}

const validationErrors = validateProfile(parsed.profile).filter((message) => message.severity === "error");
if (validationErrors.length > 0) {
  for (const message of validationErrors) console.error(message.message);
  process.exit(1);
}

prepareProfileAssets(parsed.profile);
writeSitemap(parsed.profile.pdf.filename);
console.log("Prepared profile assets.");

/** One page and one PDF: hand-rolling the sitemap beats pulling in a plugin. */
function writeSitemap(pdfFilename: string) {
  const lastmod = fs.statSync(path.resolve("content/profile.md")).mtime.toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    { loc: `${SITE_URL}/${encodeURIComponent(pdfFilename)}`, priority: "0.5" }
  ];

  const body = urls
    .map(({ loc, priority }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`)
    .join("\n");

  fs.writeFileSync(
    path.resolve("public/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    "utf8"
  );
}
