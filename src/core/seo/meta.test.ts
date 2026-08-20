import { describe, expect, it } from "vitest";
import { parseProfileSource } from "../parser/parseProfile";
import { buildSeoMeta, truncateAtWord } from "./meta";

const source = `---
name: Ada Lovelace
title: Making analytical engines useful
headlineInfo: A long first-person paragraph that exists so the description fallback has something realistic to shorten, and it keeps going well past any sensible search-result limit so truncation is actually exercised.
location: London, United Kingdom
links:
  linkedin: https://www.linkedin.com/in/ada
  github: https://github.com/ada
  website: https://example.com
---

# Bio

Mathematician and writer.

# Experience

## Analytical Engine Co.

Role: Principal Engineer
Period: January 2020 - Present

## Difference Engine Ltd.

Role: Engineer
Period: March 2015 - December 2019

# Skills

## Algorithms
Level: 90

## Mathematics
Level: 95
`;

function parse(text = source) {
  const result = parseProfileSource(text, "test.md");
  if (!result.profile) throw new Error(result.errors.map((message) => message.message).join("\n"));
  return result.profile;
}

describe("truncateAtWord", () => {
  it("leaves short text untouched", () => {
    expect(truncateAtWord("Short enough", 155)).toBe("Short enough");
  });

  it("cuts on a word boundary and marks the cut", () => {
    const result = truncateAtWord("alpha beta gamma delta epsilon", 20);

    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(20);
    // The point of a word-boundary cut is that no word is left mangled.
    expect(result.replace("…", "").trim().split(" ").pop()).toBe("gamma");
  });

  it("collapses whitespace so multi-line markdown does not leak into meta tags", () => {
    expect(truncateAtWord("one\n\n  two   three")).toBe("one two three");
  });
});

describe("buildSeoMeta", () => {
  it("takes the job title from the entry whose period is open-ended", () => {
    expect(buildSeoMeta(parse()).jobTitle).toBe("Principal Engineer");
    expect(buildSeoMeta(parse()).currentEmployer).toBe("Analytical Engine Co.");
  });

  it("prefers an explicit seo.jobTitle over the derived one", () => {
    const profile = parse(source.replace("---\n\n# Bio", "seo:\n  jobTitle: Countess of Computing\n---\n\n# Bio"));

    expect(buildSeoMeta(profile).jobTitle).toBe("Countess of Computing");
  });

  it("leads the page title with the name, because that is what people search for", () => {
    expect(buildSeoMeta(parse()).pageTitle).toBe("Ada Lovelace — Principal Engineer | CV");
  });

  it("falls back to the tagline when no role is open-ended", () => {
    const profile = parse(source.replace("January 2020 - Present", "January 2020 - March 2021"));

    expect(buildSeoMeta(profile).pageTitle).toBe("Ada Lovelace — Making analytical engines useful | CV");
  });

  it("derives a description from headlineInfo, within the search-result limit", () => {
    const meta = buildSeoMeta(parse());

    expect(meta.description.startsWith("A long first-person paragraph")).toBe(true);
    expect(meta.description.length).toBeLessThanOrEqual(155);
  });

  it("keeps non-profile links out of sameAs", () => {
    // `website` is this site itself; listing it as sameAs would claim the page
    // is the same entity as the person, which is not what sameAs means.
    expect(buildSeoMeta(parse()).sameAs).toEqual([
      "https://www.linkedin.com/in/ada",
      "https://github.com/ada"
    ]);
  });

  it("builds knowsAbout from the skills section", () => {
    expect(buildSeoMeta(parse()).knowsAbout).toEqual(["Algorithms", "Mathematics"]);
  });

  it("puts explicit seo.knowsAbout ahead of the derived skills and deduplicates", () => {
    const profile = parse(
      source.replace("---\n\n# Bio", "seo:\n  knowsAbout:\n    - Computing\n    - Algorithms\n---\n\n# Bio")
    );

    expect(buildSeoMeta(profile).knowsAbout).toEqual(["Computing", "Algorithms", "Mathematics"]);
  });
});
