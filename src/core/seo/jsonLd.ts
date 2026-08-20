import type { Profile, ProfileEntry } from "../model/profile";
import { siteConfig, absoluteUrl } from "../site/config";
import { currentExperienceEntry, findSection, stripMarkdown, type SeoMeta } from "./meta";

/**
 * schema.org JSON-LD for the profile page.
 *
 * Why this matters more here than on most pages: search engines use `Person`
 * plus `sameAs` to reconcile a page with a real-world entity. Without it, a
 * crawler sees the string "Damian Sińczak"; with it, it sees a node it can link
 * to the LinkedIn and GitHub accounts it already knows about. Everything below
 * is derived from content/profile.md — nothing is hardcoded.
 */

const PERSON_ID = `${siteConfig.url}/#person`;
const PAGE_ID = `${siteConfig.url}/#profilepage`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

type JsonLdNode = Record<string, unknown>;

/** ISO 3166-1 alpha-2 for the countries that actually appear in the content. */
const countryCodes: Record<string, string> = {
  poland: "PL",
  pl: "PL",
  latvia: "LV",
  lv: "LV",
  germany: "DE",
  de: "DE",
  france: "FR",
  fr: "FR",
  austria: "AT",
  at: "AT",
  netherlands: "NL",
  nl: "NL",
  "united states": "US",
  usa: "US",
  us: "US",
  "united kingdom": "GB",
  uk: "GB"
};

/**
 * "Łódź, Poland" -> a PostalAddress.
 *
 * Two traps the content walks straight into. First, `Location: King of Prussia,
 * PA / Remote` — naively taking the segment after the last comma yields
 * `addressCountry: "PA / Remote"`, which is not a country and makes the whole
 * node untrustworthy. Structured data that lies is worse than structured data
 * that is merely incomplete, so `addressCountry` is emitted only when the
 * segment actually resolves to a country. Second, working-arrangement suffixes
 * like "/ Remote" are employment metadata, not geography, and are dropped.
 */
function toPostalAddress(location?: string): JsonLdNode | undefined {
  if (!location) return undefined;

  const cleaned = location
    .replace(/\s*[/|]\s*(remote|hybrid|on-?site)\s*$/i, "")
    .trim();
  if (!cleaned) return undefined;

  const parts = cleaned.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return undefined;

  const last = parts[parts.length - 1].toLowerCase();
  const country = countryCodes[last];

  const locality = (country ? parts.slice(0, -1) : parts).join(", ");

  if (!locality && !country) return undefined;

  return {
    "@type": "PostalAddress",
    ...(locality ? { addressLocality: locality } : {}),
    ...(country ? { addressCountry: country } : {})
  };
}

/** "June 2021 - Present" -> { start: "2021-06", end: undefined }. */
function parsePeriod(period?: string): { start?: string; end?: string } {
  if (!period) return {};
  const [rawStart, rawEnd] = period.split(/\s+[-–—]\s+/);
  return { start: toIsoDate(rawStart), end: toIsoDate(rawEnd) };
}

const months: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
  july: "07", august: "08", september: "09", october: "10", november: "11", december: "12"
};

/** Accepts "2024-01-23", "June 2021", "2004". Returns undefined for "Present". */
function toIsoDate(value?: string): string | undefined {
  const text = value?.trim();
  if (!text || /^(present|current|now|today)$/i.test(text)) return undefined;

  const iso = text.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (iso) return text;

  const monthYear = text.match(/^([A-Za-z]+)\s+(\d{4})$/);
  const month = monthYear && months[monthYear[1].toLowerCase()];
  return month ? `${monthYear[2]}-${month}` : undefined;
}

/** The first paragraph of an entry, used as a node description. */
function entryDescription(entry: ProfileEntry): string | undefined {
  const paragraph = entry.blocks.find((block) => block.kind === "paragraph");
  return paragraph ? stripMarkdown(paragraph.markdown) : undefined;
}

function organisation(name: string, entry?: ProfileEntry): JsonLdNode {
  return {
    "@type": "Organization",
    name,
    ...(entry?.fields.Location ? { address: toPostalAddress(entry.fields.Location) } : {})
  };
}

function alumniOf(profile: Profile): JsonLdNode[] {
  return (findSection(profile, "education")?.entries ?? []).map((entry) => {
    const { start, end } = parsePeriod(entry.fields.Period);
    return {
      "@type": "CollegeOrUniversity",
      name: entry.title,
      ...(start ? { startDate: start } : {}),
      ...(end ? { endDate: end } : {})
    };
  });
}

function hasCredential(profile: Profile): JsonLdNode[] {
  return (findSection(profile, "education")?.entries ?? [])
    .filter((entry) => entry.fields.Degree)
    .map((entry) => ({
      "@type": "EducationalOccupationalCredential",
      name: entry.fields.Degree,
      recognizedBy: { "@type": "CollegeOrUniversity", name: entry.title }
    }));
}

/** Employment history as schema.org OrganizationRole nodes. */
function hasOccupation(profile: Profile, meta: SeoMeta): JsonLdNode[] {
  return (findSection(profile, "experience")?.entries ?? []).map((entry) => {
    const { start, end } = parsePeriod(entry.fields.Period);
    return {
      "@type": "OrganizationRole",
      roleName: entry.fields.Role ?? meta.jobTitle ?? entry.title,
      ...(start ? { startDate: start } : {}),
      ...(end ? { endDate: end } : {}),
      worksFor: organisation(entry.title, entry)
    };
  });
}

/** "- Polish (native)" -> { name: "Polish", proficiency: "native" }. */
function knowsLanguage(profile: Profile): JsonLdNode[] {
  const section = findSection(profile, "languages");
  if (!section) return [];

  const lines = section.blocks
    .flatMap((block) => block.markdown.split("\n"))
    .map((line) => line.replace(/^\s*[-*+]\s+/, "").trim())
    .filter(Boolean);

  const fromEntries = section.entries.map((entry) =>
    entry.fields.Proficiency ? `${entry.title} (${entry.fields.Proficiency})` : entry.title
  );

  return [...lines, ...fromEntries].map((raw) => {
    const match = raw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    return {
      "@type": "Language",
      name: (match ? match[1] : raw).trim(),
      ...(match ? { alternateName: match[2].trim() } : {})
    };
  });
}

/** Talks and articles, authored by the person node. */
function creativeWorks(profile: Profile): JsonLdNode[] {
  return (findSection(profile, "publications")?.entries ?? []).map((entry) => {
    const description = entryDescription(entry);
    return {
      "@type": "CreativeWork",
      "@id": `${siteConfig.url}/#publication-${slug(entry.title)}`,
      name: entry.title,
      author: { "@id": PERSON_ID },
      ...(toIsoDate(entry.fields.Date) ? { datePublished: toIsoDate(entry.fields.Date) } : {}),
      ...(entry.fields.Link ? { url: entry.fields.Link } : {}),
      ...(entry.fields.Venue ? { publisher: { "@type": "Organization", name: entry.fields.Venue } } : {}),
      ...(description ? { description } : {}),
      isPartOf: { "@id": PAGE_ID }
    };
  });
}

export function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function person(profile: Profile, meta: SeoMeta): JsonLdNode {
  const current = currentExperienceEntry(profile);
  const bio = findSection(profile, "bio")?.blocks[0]?.markdown;

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    url: `${siteConfig.url}/`,
    ...(meta.jobTitle ? { jobTitle: meta.jobTitle } : {}),
    description: bio ? stripMarkdown(bio) : meta.description,
    ...(profile.assets?.photo?.publicPath
      ? { image: absoluteUrl(profile.assets.photo.publicPath) }
      : {}),
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    ...(profile.phone ? { telephone: profile.phone.replace(/\s+/g, "") } : {}),
    ...(toPostalAddress(profile.location) ? { address: toPostalAddress(profile.location) } : {}),
    ...(current ? { worksFor: organisation(current.title, current) } : {}),
    ...(meta.sameAs.length ? { sameAs: meta.sameAs } : {}),
    ...(meta.knowsAbout.length ? { knowsAbout: meta.knowsAbout } : {}),
    ...(knowsLanguage(profile).length ? { knowsLanguage: knowsLanguage(profile) } : {}),
    ...(alumniOf(profile).length ? { alumniOf: alumniOf(profile) } : {}),
    ...(hasCredential(profile).length ? { hasCredential: hasCredential(profile) } : {}),
    ...(hasOccupation(profile, meta).length ? { hasOccupation: hasOccupation(profile, meta) } : {}),
    mainEntityOfPage: { "@id": PAGE_ID }
  };
}

/**
 * @param dateModified ISO-8601 date of the last content change. Passed in rather
 *   than read from the filesystem, because git does not preserve mtimes and a
 *   fresh clone would otherwise claim the content changed today.
 */
export function buildJsonLd(profile: Profile, meta: SeoMeta, dateModified: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${siteConfig.url}/`,
        name: `${profile.name} — CV`,
        inLanguage: siteConfig.lang,
        publisher: { "@id": PERSON_ID }
      },
      {
        "@type": "ProfilePage",
        "@id": PAGE_ID,
        url: `${siteConfig.url}/`,
        name: meta.pageTitle,
        description: meta.description,
        inLanguage: siteConfig.lang,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
        dateModified,
        primaryImageOfPage: absoluteUrl(siteConfig.ogImage.path),
        // Points crawlers at the machine-readable mirror of this page.
        significantLink: absoluteUrl(siteConfig.llms.full),
        ...(profile.pdf.filename
          ? {
              associatedMedia: {
                "@type": "MediaObject",
                name: `${profile.name} — CV (PDF)`,
                encodingFormat: "application/pdf",
                contentUrl: absoluteUrl(`/${profile.pdf.filename}`)
              }
            }
          : {})
      },
      person(profile, meta),
      ...creativeWorks(profile)
    ]
  };
}
