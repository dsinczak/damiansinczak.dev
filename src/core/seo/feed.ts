import { absoluteUrl, siteConfig } from "../site/config";
import { blogIndexPath, blogPostPath, type BlogListing } from "./sitemap";
import { escapeXml } from "./xml";

/**
 * Atom feed of the blog, kept free of filesystem access so it can be tested.
 * Atom over RSS 2.0: it has distinct `published`/`updated` dates (matching the
 * frontmatter), mandatory stable ids, and an unambiguous content model.
 */

export type FeedPost = BlogListing & { html: string };

export type FeedOptions = {
  title: string;
  description: string;
  limit?: number;
};

export function buildFeed(posts: FeedPost[], options: FeedOptions): string {
  const entries = [...posts]
    .sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime())
    .slice(0, options.limit ?? siteConfig.feed.limit);
  // Derived from content, not the clock, so a rebuild without new posts yields a byte-identical feed.
  const updated = entries.map(lastChange).sort().at(-1) ?? new Date(0).toISOString();

  const body = entries.map((post) => [
    "  <entry>",
    `    <id>${escapeXml(entryId(post))}</id>`,
    `    <title>${escapeXml(post.title)}</title>`,
    `    <link rel="alternate" type="text/html" href="${escapeXml(absoluteUrl(blogPostPath(post.slug)))}"/>`,
    `    <published>${post.publishedAt.toISOString()}</published>`,
    `    <updated>${lastChange(post)}</updated>`,
    `    <summary>${escapeXml(post.description)}</summary>`,
    `    <content type="html">${escapeXml(feedHtml(post.html))}</content>`,
    "  </entry>"
  ].join("\n"));

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${siteConfig.lang}">`,
    `  <id>${escapeXml(absoluteUrl(blogIndexPath))}</id>`,
    `  <title>${escapeXml(options.title)}</title>`,
    `  <subtitle>${escapeXml(options.description)}</subtitle>`,
    `  <link rel="self" type="${siteConfig.feed.type}" href="${escapeXml(absoluteUrl(siteConfig.feed.path))}"/>`,
    `  <link rel="alternate" type="text/html" href="${escapeXml(absoluteUrl(blogIndexPath))}"/>`,
    `  <updated>${updated}</updated>`,
    `  <author>\n    <name>${escapeXml(siteConfig.name)}</name>\n    <uri>${escapeXml(absoluteUrl("/"))}</uri>\n  </author>`,
    `  <icon>${escapeXml(absoluteUrl("/icon-192.png"))}</icon>`,
    ...body,
    "</feed>",
    ""
  ].join("\n");
}

/**
 * tag: URI (RFC 4151) pinned to the publish date, so the id survives a domain
 * or URL-scheme change; a changed id makes every reader re-announce the post.
 */
export function entryId(post: BlogListing): string {
  return `tag:${siteConfig.host},${post.publishedAt.toISOString().slice(0, 10)}:${blogPostPath(post.slug)}`;
}

/**
 * Readers drop the site CSS and resolve relative URLs unreliably, so:
 * - only the light half of a themed image pair is kept (both would show);
 * - the code-block "Copy" buttons are removed (they need the site script);
 * - root-relative src/href become absolute.
 */
export function feedHtml(html: string): string {
  return html
    .replace(/<img\b[^>]*\bthemed-img--dark\b[^>]*>/g, "")
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/g, "")
    .replace(/\b(src|href)="\/(?!\/)([^"]*)"/g, (_, attribute: string, rest: string) => `${attribute}="${absoluteUrl(`/${rest}`)}"`);
}

function lastChange(post: BlogListing): string {
  return (post.updatedAt ?? post.publishedAt).toISOString();
}
