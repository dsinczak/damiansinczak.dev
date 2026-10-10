import { describe, expect, it } from "vitest";
import { blogToLlmsSection } from "./llms";
import { blogPostPath, blogSitemapEntries, buildSitemap, type BlogListing } from "./sitemap";

const posts: BlogListing[] = [
  {
    slug: "edited",
    title: "Edited later",
    description: "Has an updatedAt.",
    publishedAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-03-01")
  },
  {
    slug: "series/part-one",
    title: "Nested",
    description: "Lives in a folder.",
    publishedAt: new Date("2026-02-15")
  }
];

describe("blogSitemapEntries", () => {
  it("advertises nothing when there are no posts", () => {
    expect(blogSitemapEntries([])).toEqual([]);
  });

  it("dates each post by updatedAt, falling back to publishedAt", () => {
    expect(blogSitemapEntries(posts)).toContainEqual({ path: "/blog/edited/", lastmod: "2026-03-01" });
    expect(blogSitemapEntries(posts)).toContainEqual({ path: "/blog/series/part-one/", lastmod: "2026-02-15" });
  });

  it("dates the blog index by its most recently changed post", () => {
    expect(blogSitemapEntries(posts)[0]).toEqual({ path: "/blog/", lastmod: "2026-03-01" });
  });
});

describe("blogPostPath", () => {
  it("matches the trailing-slash URLs Astro builds, keeping folders", () => {
    expect(blogPostPath("series/part-one")).toBe("/blog/series/part-one/");
  });

  it("encodes unsafe characters per segment", () => {
    expect(blogPostPath("a b&c")).toBe("/blog/a%20b%26c/");
  });
});

describe("buildSitemap", () => {
  it("emits absolute, XML-escaped locations with their lastmod", () => {
    const xml = buildSitemap([{ path: "/blog/a&b/", lastmod: "2026-01-01" }]);
    expect(xml).toContain("<loc>https://www.damiansinczak.dev/blog/a&amp;b/</loc>");
    expect(xml).toContain("<lastmod>2026-01-01</lastmod>");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});

describe("blogToLlmsSection", () => {
  it("is empty when there are no posts, so llms.txt does not announce an empty blog", () => {
    expect(blogToLlmsSection([])).toBe("");
  });

  it("lists posts as llms.txt link entries with descriptions", () => {
    const section = blogToLlmsSection(posts);
    expect(section.startsWith("## Blog\n\n")).toBe(true);
    expect(section).toContain("- [Edited later](https://www.damiansinczak.dev/blog/edited/): Has an updatedAt.");
    expect(section).toContain("- [Nested](https://www.damiansinczak.dev/blog/series/part-one/): Lives in a folder.");
  });
});
