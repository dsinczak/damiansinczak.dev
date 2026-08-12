import { describe, expect, it } from "vitest";
import { filterProfileForTarget } from "../filtering/filterProfileForTarget";
import { parseProfileSource } from "./parseProfile";

const sample = `---
name: Test Person
title: Principal Engineer
assets:
  photo:
    src: content/profile_pic.jpg
    alt: Test Person
pdf:
  filename: Test_CV.pdf
outputs:
  sections:
    experience:
      target: all
      web: collapsed
---

# Bio

Short bio.

# Experience

## Example Inc.
<!-- target: all; web: collapsed -->

Role: Developer
Period: 2020 - Present
Unknown Field: preserved

- Shared bullet.

:::detail target="web" web="collapsed" label="More info"
Web-only detail.
:::

# Skills

## TypeScript

Category: Programming languages
Level: 90

Shared skill summary.
`;

describe("parseProfileSource", () => {
  it("parses frontmatter, sections, entries, fields, blocks, and details", () => {
    const result = parseProfileSource(sample, "sample.md");

    expect(result.errors).toEqual([]);
    expect(result.profile?.name).toBe("Test Person");
    expect(result.profile?.sections.map((section) => section.id)).toEqual(["bio", "experience", "skills"]);

    const experience = result.profile?.sections.find((section) => section.id === "experience");
    expect(experience?.metadata.web).toBe("collapsed");
    expect(experience?.entries[0].fields.Role).toBe("Developer");
    expect(experience?.entries[0].extraFields.UnknownField).toBe("preserved");
    expect(experience?.entries[0].blocks.map((block) => block.kind)).toEqual(["list", "detail"]);
    expect(experience?.entries[0].blocks[0].metadata.web).toBe("none");
    expect(experience?.entries[0].blocks[1].metadata.target).toBe("web");
    expect(experience?.entries[0].blocks[1].label).toBe("More info");
  });

  it("filters web-only detail out of the PDF profile", () => {
    const result = parseProfileSource(sample, "sample.md");
    const pdfProfile = filterProfileForTarget(result.profile!, "pdf");
    const experience = pdfProfile.sections.find((section) => section.id === "experience");

    expect(experience?.entries[0].blocks.map((block) => block.markdown)).toEqual(["- Shared bullet."]);
  });

  it("reports unsupported metadata values", () => {
    const result = parseProfileSource(`---
name: Test Person
title: Engineer
---

# Bio
<!-- target: mobile -->
Text.
`, "sample.md");

    expect(result.errors[0].message).toContain("Unknown output target");
  });
});
