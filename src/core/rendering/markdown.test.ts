import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./markdown";

describe("aside blocks", () => {
  it("renders a titled aside with nested markdown", () => {
    const html = renderMarkdown("Before\n\n:::aside Case study\nFirst **bold**\n\nSecond\n:::\n\nAfter");

    expect(html).toContain('<aside class="post-aside"><p class="post-aside__title">Case study</p>');
    expect(html).toContain("<p>First <strong>bold</strong></p>");
    expect(html).toContain("<p>Second</p>\n</aside>");
    expect(html).toContain("<p>After</p>");
  });

  it("renders an aside without a title", () => {
    expect(renderMarkdown(":::aside\nText\n:::")).toBe('<aside class="post-aside"><p>Text</p>\n</aside>\n');
  });

  it("escapes the title", () => {
    expect(renderMarkdown(":::aside <b>x</b>\nText\n:::")).toContain("&lt;b&gt;x&lt;/b&gt;");
  });
});
