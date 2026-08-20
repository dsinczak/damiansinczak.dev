import type { Profile, ProfileEntry, ProfileSection, SectionId } from "../model/profile";

/** Everything the document head needs, derived once from the profile. */
export type SeoMeta = {
  /** <title> */
  pageTitle: string;
  /** <meta name="description"> and og:description. */
  description: string;
  /** Searchable occupation, e.g. "Senior Clojure/Java Developer". */
  jobTitle?: string;
  /** Employer of the entry whose Period is open-ended, if any. */
  currentEmployer?: string;
  /** Deduplicated profile URLs for schema.org sameAs. */
  sameAs: string[];
  /** Topics for schema.org knowsAbout, capped to keep the graph readable. */
  knowsAbout: string[];
};

/** Google truncates around 155-160 characters; anything past that is wasted. */
const DESCRIPTION_LIMIT = 155;

/** knowsAbout is a signal, not a dump. Past ~30 entries it reads as spam. */
const KNOWS_ABOUT_LIMIT = 30;

/**
 * An entry is "current" when its Period has no end date. The content convention
 * is "June 2021 - Present", so we look for the open-ended marker rather than
 * trying to parse dates that are deliberately human-readable.
 */
const OPEN_ENDED_PERIOD = /\b(present|current|now|today)\b\s*$/i;

export function findSection(profile: Profile, id: SectionId): ProfileSection | undefined {
  return profile.sections.find((section) => section.id === id);
}

export function currentExperienceEntry(profile: Profile): ProfileEntry | undefined {
  const experience = findSection(profile, "experience");
  return experience?.entries.find((entry) => OPEN_ENDED_PERIOD.test(entry.fields.Period ?? ""));
}

/**
 * Truncate on a word boundary and add an ellipsis, but only if we actually cut
 * something. A hard `slice` mid-word looks broken in a search result.
 */
export function truncateAtWord(text: string, limit = DESCRIPTION_LIMIT): string {
  const normalised = text.replace(/\s+/g, " ").trim();
  if (normalised.length <= limit) return normalised;

  const cut = normalised.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–-]+$/, "")}…`;
}

function deriveDescription(profile: Profile, jobTitle?: string): string {
  if (profile.seo?.description) return profile.seo.description;

  // headlineInfo is a long first-person paragraph: strong, specific, and already
  // written for humans. It beats anything synthesised from field values.
  if (profile.headlineInfo) return truncateAtWord(profile.headlineInfo);

  // Fall back to the bio's opening paragraph, then to the tagline.
  const bio = findSection(profile, "bio")?.blocks[0]?.markdown;
  if (bio) return truncateAtWord(stripMarkdown(bio));

  const parts = [profile.name, jobTitle, profile.title, profile.location].filter(Boolean);
  return truncateAtWord(parts.join(". "));
}

function derivePageTitle(profile: Profile, jobTitle?: string): string {
  if (profile.seo?.pageTitle) return profile.seo.pageTitle;

  // Lead with the name (that is the query people actually type), follow with the
  // occupation (that is the query that finds you when they do not know your name).
  return jobTitle ? `${profile.name} — ${jobTitle} | CV` : `${profile.name} — ${profile.title} | CV`;
}

/**
 * `sameAs` is how a search engine reconciles "this page" with "this person" across
 * the web. Order matters only for readability; duplicates would be a schema smell.
 */
function deriveSameAs(profile: Profile): string[] {
  const fromLinks = Object.entries(profile.links)
    // `website` is this site and `email` is not a profile, so neither is a
    // sameAs: that property asserts "the same entity", not "a related URL".
    .filter(([key]) => key !== "website" && key !== "email")
    .map(([, value]) => value)
    .filter((value): value is string => typeof value === "string" && /^https?:\/\//.test(value));

  return [...new Set([...fromLinks, ...(profile.seo?.sameAs ?? [])])];
}

function deriveKnowsAbout(profile: Profile): string[] {
  const skills = findSection(profile, "skills")?.entries.map((entry) => entry.title) ?? [];
  return [...new Set([...(profile.seo?.knowsAbout ?? []), ...skills])].slice(0, KNOWS_ABOUT_LIMIT);
}

/** Good enough for meta descriptions: drop link syntax, emphasis and inline code. */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/[*_~]{1,3}/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSeoMeta(profile: Profile): SeoMeta {
  const current = currentExperienceEntry(profile);
  const jobTitle = profile.seo?.jobTitle ?? current?.fields.Role;

  return {
    pageTitle: derivePageTitle(profile, jobTitle),
    description: deriveDescription(profile, jobTitle),
    jobTitle,
    currentEmployer: current?.title,
    sameAs: deriveSameAs(profile),
    knowsAbout: deriveKnowsAbout(profile)
  };
}
