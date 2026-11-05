import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getBlogPosts } from "./posts";

const frontmatter = "---\ntitle: T\ndescription: D\npublishedAt: 2026-01-01\n---\n";
let workspace: string;

function writePost(markdown: string, assets: string[] = []): string {
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), "blog-test-"));
  const blog = path.join(workspace, "content/blog");
  fs.mkdirSync(path.join(blog, "post"), { recursive: true });
  for (const asset of assets) fs.writeFileSync(path.join(blog, "post", asset), "");
  fs.writeFileSync(path.join(blog, "post.md"), frontmatter + markdown);
  return getBlogPosts(workspace)[0].html;
}

afterEach(() => fs.rmSync(workspace, { recursive: true, force: true }));

describe("themed images", () => {
  it("renders a light/dark pair when the dark sibling exists", () => {
    const html = writePost("![Goose](./post/goose-light.webp)", ["goose-light.webp", "goose-dark.webp"]);

    expect(html).toContain('<img class="themed-img themed-img--light" src="/blog-assets/post/goose-light.webp" alt="Goose" />');
    expect(html).toContain('<img class="themed-img themed-img--dark" src="/blog-assets/post/goose-dark.webp" alt="Goose" />');
  });

  it("leaves the image alone when there is no dark sibling", () => {
    const html = writePost("![Goose](./post/goose-light.webp)", ["goose-light.webp"]);

    expect(html).toContain('<img src="/blog-assets/post/goose-light.webp" alt="Goose" />');
    expect(html).not.toContain("themed-img");
  });

  it("does not touch ordinary images", () => {
    const html = writePost("![Goose](./post/goose.webp)", ["goose.webp", "goose-dark.webp"]);

    expect(html).toContain('<img src="/blog-assets/post/goose.webp" alt="Goose" />');
  });
});

describe("image width", () => {
  it.each([
    ["50%", "50%"],
    ["320px", "320px"],
    ["320", "320px"],
    ["20rem", "20rem"]
  ])("applies width=%s", (input, expected) => {
    const html = writePost(`![Goose](./post/goose.webp){width=${input}}`, ["goose.webp"]);

    expect(html).toContain(`<img src="/blog-assets/post/goose.webp" alt="Goose" style="width:${expected}" />`);
  });

  it("applies the width to both themed variants", () => {
    const html = writePost("![Goose](./post/goose-light.webp){width=60%}", ["goose-light.webp", "goose-dark.webp"]);

    expect(html.match(/style="width:60%"/g)).toHaveLength(2);
  });

  it("works for external images", () => {
    const html = writePost("![Goose](https://example.com/goose.png){width=100px}");

    expect(html).toContain('<img src="https://example.com/goose.png" alt="Goose" style="width:100px" />');
  });

  it.each(["width=big", "width=50%;color:red", "height=10px"])("rejects {%s}", (attributes) => {
    expect(() => writePost(`![Goose](./post/goose.webp){${attributes}}`, ["goose.webp"])).toThrow();
  });
});

describe("image alignment and margin", () => {
  const styleOf = (attributes: string) =>
    writePost(`![Goose](./post/goose.webp){${attributes}}`, ["goose.webp"]).match(/style="([^"]*)"/)?.[1];

  it.each([
    ["align=center", "display:block;margin-left:auto;margin-right:auto"],
    ["align=left", "display:block;margin-right:auto"],
    ["align=right", "display:block;margin-left:auto"]
  ])("applies %s", (attributes, expected) => {
    expect(styleOf(attributes)).toBe(expected);
  });

  it("applies margin to all sides and to single sides", () => {
    expect(styleOf("margin=16px margin-top=0 margin-bottom=2rem")).toBe("margin:16px;margin-top:0;margin-bottom:2rem");
  });

  it("combines width, margin and alignment, alignment winning horizontally", () => {
    expect(styleOf("width=60% margin=24 align=center")).toBe(
      "width:60%;margin:24px;display:block;margin-left:auto;margin-right:auto"
    );
  });

  it("keeps the margin on the side an aligned image sticks to", () => {
    expect(styleOf("align=right margin-right=32px")).toBe("margin-right:32px;display:block;margin-left:auto");
  });

  it.each(["align=middle", "margin=auto", "margin=-10px", "margin-top=1px;color:red"])("rejects {%s}", (attributes) => {
    expect(() => styleOf(attributes)).toThrow();
  });
});
