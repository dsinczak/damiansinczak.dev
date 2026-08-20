import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  defaultMetadata,
  knownFieldNames,
  type Metadata,
  type Profile,
  type ProfileEntry,
  type ProfileParseResult,
  type ProfileSection,
  type RichTextBlock,
  sectionIdsByTitle,
  type SectionId,
  type ValidationMessage
} from "../model/profile";
import { mergeMetadata, parseDirectiveAttributes, parseMetadataComment } from "./metadata";

const frontmatterSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  headlineInfo: z.string().min(1).optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  assets: z
    .object({
      photo: assetSchema().optional(),
      banner: assetSchema().optional()
    })
    .optional(),
  links: z.record(z.string()).default({}),
  pdf: z
    .object({
      filename: z.string().min(1).default("CV.pdf"),
      // Contact details that belong on the printed CV only. The web page never
      // reads `pdf.*`, so anything here is structurally excluded from the site.
      website: z.string().url().optional()
    })
    .default({ filename: "CV.pdf" }),
  seo: z
    .object({
      jobTitle: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      pageTitle: z.string().min(1).optional(),
      sameAs: z.array(z.string().url()).optional(),
      knowsAbout: z.array(z.string().min(1)).optional()
    })
    .optional(),
  outputs: z
    .object({
      sections: z.record(
        z.object({
          target: z.enum(["all", "web", "pdf", "hidden"]).optional(),
          web: z.enum(["expanded", "collapsed", "none"]).optional()
        })
      ).optional()
    })
    .optional()
});

function assetSchema() {
  return z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
    position: z.string().optional()
  });
}

export function parseProfileFile(sourcePath = "content/profile.md"): ProfileParseResult {
  const absolutePath = path.resolve(sourcePath);
  const source = fs.readFileSync(absolutePath, "utf8");
  return parseProfileSource(source, absolutePath);
}

export function parseProfileSource(source: string, sourcePath = "content/profile.md"): ProfileParseResult {
  const warnings: ValidationMessage[] = [];
  const errors: ValidationMessage[] = [];
  const parsed = matter(source);
  const frontmatter = frontmatterSchema.safeParse(parsed.data);

  if (!frontmatter.success) {
    for (const issue of frontmatter.error.issues) {
      errors.push({
        severity: "error",
        message: `Invalid frontmatter ${issue.path.join(".")}: ${issue.message}`,
        location: { file: sourcePath, line: 1 }
      });
    }
    return { errors, warnings };
  }

  const profile: Profile = {
    name: frontmatter.data.name,
    title: frontmatter.data.title,
    headlineInfo: frontmatter.data.headlineInfo,
    location: frontmatter.data.location,
    email: frontmatter.data.email,
    phone: frontmatter.data.phone,
    assets: frontmatter.data.assets,
    links: frontmatter.data.links,
    pdf: frontmatter.data.pdf,
    seo: frontmatter.data.seo,
    sections: [],
    sourcePath
  };

  const lines = parsed.content.replace(/\r\n/g, "\n").split("\n");
  let currentSection: ProfileSection | undefined;
  let currentEntry: ProfileEntry | undefined;
  let pendingMetadata: Partial<Metadata> | undefined;

  const consumePending = (base?: Partial<Metadata>): Metadata => {
    const metadata = mergeMetadata(base, pendingMetadata);
    pendingMetadata = undefined;
    return metadata;
  };

  const addBlock = (block: RichTextBlock) => {
    if (currentEntry) {
      currentEntry.blocks.push(block);
      return;
    }
    currentSection?.blocks.push(block);
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;
    const trimmed = line.trim();

    if (!trimmed) continue;

    const comment = parseMetadataComment(trimmed, sourcePath, lineNumber);
    if (comment.message) {
      errors.push(comment.message);
      continue;
    }
    if (comment.metadata) {
      if (currentEntry && currentEntry.blocks.length === 0 && Object.keys(currentEntry.fields).length === 0) {
        currentEntry.metadata = mergeMetadata(currentEntry.metadata, comment.metadata);
        continue;
      }
      if (
        currentSection &&
        !currentEntry &&
        currentSection.blocks.length === 0 &&
        currentSection.entries.length === 0
      ) {
        currentSection.metadata = mergeMetadata(currentSection.metadata, comment.metadata);
        continue;
      }
      pendingMetadata = mergeMetadata(pendingMetadata, comment.metadata);
      continue;
    }

    const sectionMatch = line.match(/^#\s+(.+)$/);
    if (sectionMatch) {
      const title = sectionMatch[1].trim();
      const id = sectionIdsByTitle[title.toLowerCase()];

      if (!id) {
        errors.push({
          severity: "error",
          message: `Unsupported top-level section: ${title}`,
          location: { file: sourcePath, line: lineNumber }
        });
        currentSection = undefined;
        currentEntry = undefined;
        continue;
      }

      const defaults = frontmatter.data.outputs?.sections?.[id] ?? {};
      currentSection = {
        id,
        title,
        metadata: consumePending(defaults),
        entries: [],
        blocks: [],
        location: { file: sourcePath, line: lineNumber }
      };
      currentEntry = undefined;
      profile.sections.push(currentSection);
      continue;
    }

    const entryMatch = line.match(/^##\s+(.+)$/);
    if (entryMatch) {
      if (!currentSection) {
        errors.push({
          severity: "error",
          message: `Entry found before a supported top-level section: ${entryMatch[1].trim()}`,
          location: { file: sourcePath, line: lineNumber }
        });
        continue;
      }

      currentEntry = {
        title: entryMatch[1].trim(),
        metadata: consumePending(currentSection.metadata),
        fields: {},
        extraFields: {},
        blocks: [],
        location: { file: sourcePath, line: lineNumber }
      };
      currentSection.entries.push(currentEntry);
      continue;
    }

    if (!currentSection) continue;

    if (trimmed.startsWith(":::detail")) {
      const startLine = lineNumber;
      const content: string[] = [];
      const attributes = parseDirectiveAttributes(trimmed);
      const { label, ...detailMetadata } = attributes;
      const metadata = mergeMetadata(currentEntry?.metadata ?? currentSection.metadata, {
        ...pendingMetadata,
        ...detailMetadata
      });
      pendingMetadata = undefined;

      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") {
        content.push(lines[index]);
        index += 1;
      }

      if (index >= lines.length) {
        errors.push({
          severity: "error",
          message: "Unclosed detail block",
          location: { file: sourcePath, line: startLine }
        });
      }

      addBlock({
        kind: "detail",
        markdown: content.join("\n").trim(),
        metadata,
        label,
        location: { file: sourcePath, line: startLine }
      });
      continue;
    }

    const fieldMatch = line.match(/^([A-Za-z][A-Za-z ]{1,40}):\s*(.+)$/);
    if (fieldMatch && currentEntry) {
      const fieldName = normalizeFieldName(fieldMatch[1]);
      const value = fieldMatch[2].trim();
      if (fieldName === "Icon") {
        currentEntry.icon = { src: value, alt: `${currentEntry.title} logo` };
        continue;
      }
      if (knownFieldNames.has(fieldName.toLowerCase())) {
        currentEntry.fields[fieldName] = value;
      } else {
        currentEntry.extraFields[fieldName] = value;
        warnings.push({
          severity: "warning",
          message: `Unknown entry field preserved: ${fieldName}`,
          location: { file: sourcePath, line: lineNumber },
          context: `${currentSection.title} > ${currentEntry.title}`
        });
      }
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const startLine = lineNumber;
      const bullets = [line];
      while (index + 1 < lines.length && lines[index + 1].trim().startsWith("- ")) {
        index += 1;
        bullets.push(lines[index]);
      }
      addBlock({
        kind: "list",
        markdown: bullets.join("\n"),
        metadata: consumePending(),
        location: { file: sourcePath, line: startLine }
      });
      continue;
    }

    const startLine = lineNumber;
    const paragraph = [line];
    while (
      index + 1 < lines.length &&
      lines[index + 1].trim() &&
      !lines[index + 1].match(/^#{1,2}\s+/) &&
      !lines[index + 1].trim().startsWith("<!--") &&
      !lines[index + 1].trim().startsWith(":::detail") &&
      !lines[index + 1].trim().startsWith("- ") &&
      !lines[index + 1].match(/^([A-Za-z][A-Za-z ]{1,40}):\s*(.+)$/)
    ) {
      index += 1;
      paragraph.push(lines[index]);
    }

    addBlock({
      kind: "paragraph",
      markdown: paragraph.join("\n").trim(),
      metadata: consumePending(),
      location: { file: sourcePath, line: startLine }
    });
  }

  return { profile, errors, warnings };
}

function normalizeFieldName(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}
