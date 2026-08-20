import type { Profile, ProfileEntry, RichTextBlock } from "../model/profile";
import { siteConfig, absoluteUrl } from "../site/config";
import { buildSeoMeta, findSection, stripMarkdown } from "./meta";

/**
 * Generators for the llms.txt convention (https://llmstxt.org).
 *
 * The point is control. An LLM crawler that only has the rendered HTML has to
 * infer structure from CSS classes and `<details>` elements, and it will get
 * some of it wrong. Publishing the same content as curated Markdown means the
 * agent-facing version of this profile is the one written deliberately, not the
 * one reverse-engineered from a stylesheet.
 *
 * Two files, by convention:
 *   /llms.txt      - a short index: who, what, where to find the detail.
 *   /llms-full.txt - the entire profile as Markdown, in one request.
 *
 * Both are generated from the *web-filtered* profile, so anything marked
 * `target: pdf` or `target: hidden` stays out of them exactly as it stays out
 * of the HTML. There is one content contract, not two.
 */

/** Blocks the web target hides are also hidden from agents. */
function visibleBlocks(blocks: RichTextBlock[]): RichTextBlock[] {
  return blocks.filter((block) => block.metadata.target !== "hidden");
}

function entryFieldLines(entry: ProfileEntry): string[] {
  const order = ["Role", "Degree", "Language", "Proficiency", "Category", "Level", "Period", "Date", "Location", "Venue", "Authors", "Tech", "Link"];
  return order
    .filter((field) => entry.fields[field])
    .map((field) => `- ${field}: ${entry.fields[field]}`);
}

function renderBlocks(blocks: RichTextBlock[]): string[] {
  return visibleBlocks(blocks).map((block) => {
    // A `:::detail` block is collapsed in the browser purely as a reading aid.
    // For an agent there is no reading aid to give, so we keep the label as a
    // heading and inline the body rather than dropping it.
    if (block.kind === "detail" && block.label) {
      return `**${block.label}**\n\n${block.markdown.trim()}`;
    }
    return block.markdown.trim();
  });
}

/** Serialise the profile back to Markdown: the agent-readable mirror of the page. */
export function profileToMarkdown(profile: Profile, dateModified: string): string {
  const meta = buildSeoMeta(profile);
  const out: string[] = [];

  out.push(`# ${profile.name}`);
  out.push("");
  out.push(`> ${profile.title}`);
  out.push("");

  const facts = [
    meta.jobTitle ? `- Role: ${meta.jobTitle}` : undefined,
    meta.currentEmployer ? `- Currently at: ${meta.currentEmployer}` : undefined,
    profile.location ? `- Location: ${profile.location}` : undefined,
    profile.email ? `- Email: ${profile.email}` : undefined,
    profile.links.linkedin ? `- LinkedIn: ${profile.links.linkedin}` : undefined,
    profile.links.github ? `- GitHub: ${profile.links.github}` : undefined,
    `- Website: ${siteConfig.url}/`,
    `- CV (PDF): ${absoluteUrl(`/${profile.pdf.filename}`)}`,
    `- Last updated: ${dateModified}`
  ].filter(Boolean) as string[];

  out.push(...facts, "");

  if (profile.headlineInfo) {
    out.push(profile.headlineInfo.trim(), "");
  }

  for (const section of profile.sections) {
    if (section.blocks.length === 0 && section.entries.length === 0) continue;

    out.push(`## ${section.title}`, "");

    const sectionBlocks = renderBlocks(section.blocks);
    if (sectionBlocks.length > 0) out.push(...sectionBlocks.flatMap((block) => [block, ""]));

    for (const entry of section.entries) {
      if (entry.metadata.target === "hidden") continue;

      out.push(`### ${entry.title}`, "");

      const fields = entryFieldLines(entry);
      if (fields.length > 0) out.push(...fields, "");

      const entryBlocks = renderBlocks(entry.blocks);
      if (entryBlocks.length > 0) out.push(...entryBlocks.flatMap((block) => [block, ""]));
    }
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

/**
 * The short index file. Deliberately terse: it exists so an agent can decide
 * whether to fetch the full document, and so it knows the full document exists.
 */
export function profileToLlmsIndex(profile: Profile, dateModified: string): string {
  const meta = buildSeoMeta(profile);
  const bio = findSection(profile, "bio")?.blocks[0]?.markdown;

  const out: string[] = [];

  out.push(`# ${profile.name}`);
  out.push("");
  out.push(`> ${meta.description}`);
  out.push("");

  if (bio) out.push(stripMarkdown(bio), "");

  out.push("## Key facts", "");
  out.push(
    ...([
      meta.jobTitle ? `- **Role**: ${meta.jobTitle}` : undefined,
      meta.currentEmployer ? `- **Currently at**: ${meta.currentEmployer}` : undefined,
      profile.location ? `- **Location**: ${profile.location}` : undefined,
      meta.knowsAbout.length ? `- **Works with**: ${meta.knowsAbout.join(", ")}` : undefined,
      `- **Last updated**: ${dateModified}`
    ].filter(Boolean) as string[])
  );
  out.push("");

  out.push("## Documents", "");
  out.push(`- [Full profile as Markdown](${absoluteUrl(siteConfig.llms.full)}): the complete CV — experience, skills, education, publications — in one file. Prefer this over scraping the HTML.`);
  out.push(`- [Profile page (HTML)](${siteConfig.url}/): the same content rendered for humans, with schema.org Person structured data.`);
  out.push(`- [CV (PDF)](${absoluteUrl(`/${profile.pdf.filename}`)}): print-oriented version.`);
  out.push("");

  const contact = [
    profile.email ? `- [Email](mailto:${profile.email})` : undefined,
    profile.links.linkedin ? `- [LinkedIn](${profile.links.linkedin})` : undefined,
    profile.links.github ? `- [GitHub](${profile.links.github})` : undefined
  ].filter(Boolean) as string[];

  if (contact.length > 0) {
    out.push("## Contact", "", ...contact, "");
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}
