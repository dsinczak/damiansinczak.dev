import { describe, expect, it } from "vitest";
import { filterProfileForTarget } from "../filtering/filterProfileForTarget";
import { parseProfileSource } from "../parser/parseProfile";
import { profileToLlmsIndex, profileToMarkdown } from "./llms";

const source = `---
name: Ada Lovelace
title: Making analytical engines useful
location: London, United Kingdom
email: ada@example.com
links:
  github: https://github.com/ada
pdf:
  filename: Ada_CV.pdf
---

# Bio

Mathematician and writer.

# Experience

## Analytical Engine Co.

Role: Principal Engineer
Period: January 2020 - Present

Built the first published algorithm.

:::detail target="web" web="collapsed" label="What that involved"
The detail an agent should still receive even though a browser hides it behind a summary element.
:::

## Secret Consultancy
<!-- target: hidden -->

Role: Should never be published
Period: 2018 - 2019

## Print Only Ltd.
<!-- target: pdf -->

Role: Only on the printed CV
Period: 2014 - 2015

# Skills

## Algorithms
Level: 90
`;

function webProfile() {
  const parsed = parseProfileSource(source, "test.md");
  return filterProfileForTarget(parsed.profile!, "web");
}

describe("profileToMarkdown", () => {
  const markdown = () => profileToMarkdown(webProfile(), "2026-01-15");

  it("leads with the name and tagline", () => {
    expect(markdown().startsWith("# Ada Lovelace\n\n> Making analytical engines useful")).toBe(true);
  });

  it("honours the same visibility contract as the HTML", () => {
    expect(markdown()).not.toContain("Should never be published");
    expect(markdown()).not.toContain("Only on the printed CV");
  });

  it("inlines collapsed detail blocks, since an agent has nothing to collapse", () => {
    expect(markdown()).toContain("**What that involved**");
    expect(markdown()).toContain("even though a browser hides it");
  });

  it("keeps entry fields as a readable list", () => {
    expect(markdown()).toContain("### Analytical Engine Co.");
    expect(markdown()).toContain("- Role: Principal Engineer");
    expect(markdown()).toContain("- Period: January 2020 - Present");
  });

  it("never leaves more than one blank line, so the output stays diffable", () => {
    expect(markdown()).not.toMatch(/\n{3,}/);
  });
});

describe("profileToLlmsIndex", () => {
  const index = () => profileToLlmsIndex(webProfile(), "2026-01-15");

  it("opens with the llms.txt shape: H1 then a blockquote summary", () => {
    const [heading, blank, summary] = index().split("\n");

    expect(heading).toBe("# Ada Lovelace");
    expect(blank).toBe("");
    expect(summary.startsWith("> ")).toBe(true);
  });

  it("points agents at the full markdown mirror in preference to the HTML", () => {
    expect(index()).toContain("https://www.damiansinczak.dev/llms-full.txt");
    expect(index()).toContain("Prefer this over scraping the HTML");
  });

  it("advertises the PDF and the last-updated date", () => {
    expect(index()).toContain("https://www.damiansinczak.dev/Ada_CV.pdf");
    expect(index()).toContain("2026-01-15");
  });

  it("stays an index and does not inline the detail prose", () => {
    // The whole point of two files is that an agent can read the cheap one
    // first and only fetch llms-full.txt when it needs the substance.
    expect(index()).not.toContain("even though a browser hides it");
    expect(index()).not.toContain("### Analytical Engine Co.");
  });
});
