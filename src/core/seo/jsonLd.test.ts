import { describe, expect, it } from "vitest";
import { parseProfileSource } from "../parser/parseProfile";
import { buildJsonLd } from "./jsonLd";
import { buildSeoMeta } from "./meta";

const source = `---
name: Ada Lovelace
title: Making analytical engines useful
location: London, United Kingdom
email: ada@example.com
phone: "+44 20 7946 0000"
links:
  linkedin: https://www.linkedin.com/in/ada
pdf:
  filename: Ada_CV.pdf
---

# Bio

Mathematician and writer.

# Experience

## Analytical Engine Co.

Role: Principal Engineer
Period: January 2020 - Present
Location: King of Prussia, PA / Remote

## Difference Engine Ltd.

Role: Engineer
Period: March 2015 - December 2019
Location: Vienna, Austria

# Education

## University of London

Degree: Master of Science, Mathematics
Period: 2010 - 2012

# Publications

## On the Analytical Engine

Date: 1843-10-01
Venue: Taylor's Scientific Memoirs
Link: https://example.com/notes

# Languages

- English (native)
- French (fluent)
`;

function graph() {
  const parsed = parseProfileSource(source, "test.md");
  const profile = parsed.profile!;
  return buildJsonLd(profile, buildSeoMeta(profile), "2026-01-15")["@graph"] as Record<string, unknown>[];
}

function node(type: string) {
  return graph().find((entry) => entry["@type"] === type)!;
}

describe("buildJsonLd", () => {
  it("emits a linked WebSite / ProfilePage / Person graph", () => {
    expect(graph().map((entry) => entry["@type"])).toEqual([
      "WebSite",
      "ProfilePage",
      "Person",
      "CreativeWork"
    ]);
  });

  it("points the page at the person as its main entity, and back again", () => {
    const page = node("ProfilePage");
    const person = node("Person");

    expect((page.mainEntity as Record<string, string>)["@id"]).toBe(person["@id"]);
    expect((person.mainEntityOfPage as Record<string, string>)["@id"]).toBe(page["@id"]);
  });

  it("uses the supplied date rather than reading the filesystem", () => {
    expect(node("ProfilePage").dateModified).toBe("2026-01-15");
  });

  describe("addresses", () => {
    it("maps a real country name to its ISO code", () => {
      expect(node("Person").address).toEqual({
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB"
      });
    });

    it("refuses to emit addressCountry when the segment is not a country", () => {
      // "King of Prussia, PA / Remote": "PA" is a US state. Claiming it is a
      // country would make the whole node untrustworthy to a consumer.
      const address = (node("Person").worksFor as Record<string, unknown>).address;

      expect(address).toEqual({ "@type": "PostalAddress", addressLocality: "King of Prussia, PA" });
    });

    it("strips working-arrangement suffixes, which are not geography", () => {
      expect(JSON.stringify(graph())).not.toContain("Remote");
    });
  });

  describe("dates", () => {
    it("converts human month-year periods to ISO", () => {
      const roles = node("Person").hasOccupation as Record<string, string>[];

      expect(roles[0].startDate).toBe("2020-01");
      expect(roles[1]).toMatchObject({ startDate: "2015-03", endDate: "2019-12" });
    });

    it("omits endDate for an open-ended period rather than inventing one", () => {
      expect(node("Person").hasOccupation as Record<string, string>[]).toSatisfy(
        (roles: Record<string, string>[]) => !("endDate" in roles[0])
      );
    });
  });

  it("splits language proficiency out of the list text", () => {
    expect(node("Person").knowsLanguage).toEqual([
      { "@type": "Language", name: "English", alternateName: "native" },
      { "@type": "Language", name: "French", alternateName: "fluent" }
    ]);
  });

  it("records education as both alumniOf and a credential", () => {
    expect(node("Person").alumniOf).toEqual([
      { "@type": "CollegeOrUniversity", name: "University of London", startDate: "2010", endDate: "2012" }
    ]);
    expect(node("Person").hasCredential).toEqual([
      {
        "@type": "EducationalOccupationalCredential",
        name: "Master of Science, Mathematics",
        recognizedBy: { "@type": "CollegeOrUniversity", name: "University of London" }
      }
    ]);
  });

  it("attributes publications to the person node by reference, not by copy", () => {
    const work = node("CreativeWork");

    expect((work.author as Record<string, string>)["@id"]).toBe(node("Person")["@id"]);
    expect(work.datePublished).toBe("1843-10-01");
  });

  it("normalises the phone number and marks the email as a mailto", () => {
    expect(node("Person").telephone).toBe("+442079460000");
    expect(node("Person").email).toBe("mailto:ada@example.com");
  });

  it("serialises to valid JSON, since it is injected into a script tag", () => {
    expect(() => JSON.parse(JSON.stringify({ "@graph": graph() }))).not.toThrow();
  });
});
