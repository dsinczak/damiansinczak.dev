import { describe, expect, it } from "vitest";
import { buildFeed, entryId, feedHtml, type FeedPost } from "./feed";
import { renderMarkdown } from "../rendering/markdown";

const posts: FeedPost[] = [
  {
    slug: "older",
    title: "Older",
    description: "First one.",
    publishedAt: new Date("2026-01-10"),
    html: "<p>Old</p>"
  },
  {
    slug: "series/newer",
    title: "Tom & <Jerry>",
    description: "Edited later.",
    publishedAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-03-01"),
    html: "<p>New</p>"
  }
];

const options = { title: "Blog", description: "Words." };

describe("buildFeed", () => {
  const feed = buildFeed(posts, options);

  it("lists entries newest first", () => {
    expect(feed.indexOf("/blog/series/newer/")).toBeLessThan(feed.indexOf("/blog/older/"));
  });

  it("dates the feed by the newest change, not the build clock", () => {
    expect(feed).toContain("<updated>2026-03-01T00:00:00.000Z</updated>\n  <author>");
    expect(buildFeed(posts, options)).toBe(feed);
  });

  it("keeps published and updated apart", () => {
    expect(feed).toContain("<published>2026-02-15T00:00:00.000Z</published>\n    <updated>2026-03-01T00:00:00.000Z</updated>");
  });

  it("escapes titles", () => {
    expect(feed).toContain("<title>Tom &amp; &lt;Jerry&gt;</title>");
  });

  it("points self at the canonical feed URL", () => {
    expect(feed).toContain(`<link rel="self" type="application/atom+xml" href="https://www.damiansinczak.dev/blog/feed.xml"/>`);
  });

  it("caps the number of entries", () => {
    expect(buildFeed(posts, { ...options, limit: 1 }).match(/<entry>/g)).toHaveLength(1);
  });
});

describe("entryId", () => {
  it("is a tag URI pinned to the publish date", () => {
    expect(entryId(posts[1])).toBe("tag:www.damiansinczak.dev,2026-02-15:/blog/series/newer/");
  });
});

describe("feedHtml", () => {
  it("absolutizes root-relative URLs but leaves others alone", () => {
    const html = feedHtml(`<img src="/blog-assets/a.png"><a href="//cdn.example/x">x</a><a href="https://e.com">e</a><a href="#h">h</a>`);
    expect(html).toContain(`src="https://www.damiansinczak.dev/blog-assets/a.png"`);
    expect(html).toContain(`href="//cdn.example/x"`);
    expect(html).toContain(`href="https://e.com"`);
    expect(html).toContain(`href="#h"`);
  });

  it("keeps only the light image of a themed pair", () => {
    const html = feedHtml(`<img class="themed-img themed-img--light" src="/a-light.png" alt=""><img class="themed-img themed-img--dark" src="/a-dark.png" alt="">`);
    expect(html).toContain("a-light.png");
    expect(html).not.toContain("a-dark.png");
  });

  it("drops the copy buttons", () => {
    expect(feedHtml(`<div><button type="button" data-copy-code>Copy</button><pre>x</pre></div>`)).toBe("<div><pre>x</pre></div>");
  });

  it("reduces a rendered code block to a plain pre/code without line numbers", () => {
    const html = feedHtml(`<p>a</p>${renderMarkdown("```java\nint a = 1;\nint b = 2;\n```")}<p>b</p>`);
    expect(html).toMatch(/^<p>a<\/p><pre><code class="hljs language-java">[\s\S]*int[\s\S]*<\/code><\/pre>\s*<p>b<\/p>$/);
    expect(html).not.toContain("code-block");
    expect(html).not.toContain("JAVA");
  });
});
