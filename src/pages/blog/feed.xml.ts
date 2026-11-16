import type { APIRoute } from "astro";
import { getPublishedBlogPosts } from "../../core/blog/posts";
import { buildFeed } from "../../core/seo/feed";
import { buildBlogIndexMeta } from "../../core/seo/meta";
import { siteConfig } from "../../core/site/config";

/** Prerendered to dist/blog/feed.xml on every build; nothing to regenerate by hand. */
export const GET: APIRoute = () => {
  const meta = buildBlogIndexMeta(siteConfig.name);
  const feed = buildFeed(getPublishedBlogPosts(), { title: meta.pageTitle, description: meta.description });
  return new Response(feed, { headers: { "Content-Type": `${siteConfig.feed.type}; charset=utf-8` } });
};
