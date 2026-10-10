import fs from "node:fs";
import path from "node:path";
import { prepareProfileAssets } from "../src/core/assets/prepareAssets";
import { getPublishedBlogPosts, prepareBlogAssets } from "../src/core/blog/posts";
import { filterProfileForTarget } from "../src/core/filtering/filterProfileForTarget";
import type { Profile } from "../src/core/model/profile";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { blogToLlmsSection, profileToLlmsIndex, profileToMarkdown } from "../src/core/seo/llms";
import { blogSitemapEntries, buildSitemap, type BlogListing } from "../src/core/seo/sitemap";
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
const posts = getPublishedBlogPosts();

prepareProfileAssets(parsed.profile);
await prepareBlogAssets();
writeSitemap(parsed.profile.pdf.filename, dateModified, posts);
writeLlmsFiles(parsed.profile, dateModified, posts);
writeSecurityTxt();
console.log(`Prepared profile and blog assets, sitemap (${posts.length} posts), llms.txt and security.txt (lastmod ${dateModified}).`);

/** A profile, a few documents and the blog: hand-rolling the sitemap beats pulling in a plugin. */
function writeSitemap(pdfFilename: string, lastmod: string, blogPosts: BlogListing[]) {
  // Google has ignored <priority> and <changefreq> since ~2015; <lastmod> is the
  // only hint it still reads, and only while it stays honest. Profile documents
  // use the git date of profile.md; blog entries use their frontmatter dates.
  const profileEntries = [
    "/",
    `/${encodeURIComponent(pdfFilename)}`,
    siteConfig.llms.index,
    siteConfig.llms.full
  ].map((entryPath) => ({ path: entryPath, lastmod }));

  writePublicFile("sitemap.xml", buildSitemap([...profileEntries, ...blogSitemapEntries(blogPosts)]));
}

/**
 * Agent-facing Markdown mirrors. Generated from the same web-filtered profile the
 * page renders, so `target: pdf` and `target: hidden` content stays out of both.
 * The blog is listed in llms.txt only; llms-full.txt stays profile-only.
 */
function writeLlmsFiles(profile: Profile, lastmod: string, blogPosts: BlogListing[]) {
  const webProfile = filterProfileForTarget(profile, "web");
  const blogSection = blogToLlmsSection(blogPosts);
  const index = profileToLlmsIndex(webProfile, lastmod);
  writePublicFile(path.basename(siteConfig.llms.index), blogSection ? `${index}\n${blogSection}` : index);
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
