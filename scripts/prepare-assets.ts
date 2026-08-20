import fs from "node:fs";
import path from "node:path";
import { prepareProfileAssets } from "../src/core/assets/prepareAssets";
import { filterProfileForTarget } from "../src/core/filtering/filterProfileForTarget";
import type { Profile } from "../src/core/model/profile";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { profileToLlmsIndex, profileToMarkdown } from "../src/core/seo/llms";
import { siteConfig } from "../src/core/site/config";
import { lastModified } from "../src/core/site/lastModified";
import { validateProfile } from "../src/core/validation/validateProfile";

const PROFILE_SOURCE = "content/profile.md";

const parsed = parseProfileFile(PROFILE_SOURCE);

if (!parsed.profile || parsed.errors.length > 0) {
  for (const message of parsed.errors) console.error(message.message);
  process.exit(1);
}

const validationErrors = validateProfile(parsed.profile).filter((message) => message.severity === "error");
if (validationErrors.length > 0) {
  for (const message of validationErrors) console.error(message.message);
  process.exit(1);
}

const dateModified = lastModified(PROFILE_SOURCE);

prepareProfileAssets(parsed.profile);
writeSitemap(parsed.profile.pdf.filename, dateModified);
writeLlmsFiles(parsed.profile, dateModified);
writeSecurityTxt();
console.log(`Prepared profile assets, sitemap, llms.txt and security.txt (lastmod ${dateModified}).`);

/** One page plus a handful of documents: hand-rolling the sitemap beats pulling in a plugin. */
function writeSitemap(pdfFilename: string, lastmod: string) {
  // Google has ignored <priority> and <changefreq> since ~2015; <lastmod> is the
  // only hint it still reads, and only while it stays honest. Hence git dates.
  const urls = [
    `${siteConfig.url}/`,
    `${siteConfig.url}/${encodeURIComponent(pdfFilename)}`,
    `${siteConfig.url}${siteConfig.llms.index}`,
    `${siteConfig.url}${siteConfig.llms.full}`
  ];

  const body = urls
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join("\n");

  writePublicFile(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

/**
 * Agent-facing Markdown mirrors. Generated from the same web-filtered profile the
 * page renders, so `target: pdf` and `target: hidden` content stays out of both.
 */
function writeLlmsFiles(profile: Profile, lastmod: string) {
  const webProfile = filterProfileForTarget(profile, "web");
  writePublicFile(path.basename(siteConfig.llms.index), profileToLlmsIndex(webProfile, lastmod));
  writePublicFile(path.basename(siteConfig.llms.full), profileToMarkdown(webProfile, lastmod));
}

function writePublicFile(name: string, contents: string) {
  const target = path.resolve("public", name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, "utf8");
}

/**
 * RFC 9116 security.txt. Generated rather than committed because `Expires` is
 * mandatory and must be less than a year out — a static file would silently
 * become invalid, which is worse than not publishing one at all.
 */
function writeSecurityTxt() {
  const expires = new Date();
  expires.setUTCMonth(expires.getUTCMonth() + 6);

  writePublicFile(
    ".well-known/security.txt",
    [
      `Contact: ${siteConfig.securityContact}`,
      `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, "Z")}`,
      "Preferred-Languages: en, pl",
      `Canonical: ${siteConfig.url}/.well-known/security.txt`,
      ""
    ].join("\n")
  );
}
