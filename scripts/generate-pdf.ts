import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { filterProfileForTarget } from "../src/core/filtering/filterProfileForTarget";
import type { Profile, ProfileEntry, ProfileSection, RichTextBlock } from "../src/core/model/profile";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { validateProfile } from "../src/core/validation/validateProfile";

/* ------------------------------------------------------------------ *
 * Layout constants, derived from the reference template:
 * A4, 36pt margins, borderless two-column grid, accent bands top-left
 * and bottom-right, circular portrait, headings with a hairline rule.
 * ------------------------------------------------------------------ */

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 36;

const SIDEBAR_X = MARGIN;
const SIDEBAR_W = 180;
const MAIN_X = 234;
const MAIN_W = PAGE_W - MARGIN - MAIN_X;

const BAND_TOP_W = 224;
const BAND_TOP_H = 46;
const BAND_BOTTOM_H = 45;
const BAND_BOTTOM_X = 217.5;

const CONTENT_TOP = MARGIN;
const CONTENT_BOTTOM = PAGE_H - BAND_BOTTOM_H - 14;
/** The top band is 224pt wide, so it covers the sidebar but not the main column. */
const SIDEBAR_TOP_REST = BAND_TOP_H + 16;

const PHOTO_D = 166;
const PHOTO_Y = 118;
const SIDEBAR_TOP_FIRST = PHOTO_Y + PHOTO_D + 22;

const ACCENT = "#365F91";
const INK = "#244061";
const TEXT = "#333333";
const MUTED = "#6B7684";

const FONTS = {
  display: "assets/fonts/ArchivoBlack-Regular.ttf",
  light: "assets/fonts/OpenSans-Light.ttf",
  body: "assets/fonts/OpenSans-Regular.ttf",
  semibold: "assets/fonts/OpenSans-SemiBold.ttf",
  bold: "assets/fonts/OpenSans-Bold.ttf",
  italic: "assets/fonts/OpenSans-Italic.ttf"
} as const;

/** Sections rendered in the narrow left column; everything else goes right. */
const SIDEBAR_SECTIONS = new Set(["skills", "languages", "education"]);

/* ------------------------------------------------------------------ *
 * Load, validate, filter
 * ------------------------------------------------------------------ */

const parsed = parseProfileFile("content/profile.md");
if (!parsed.profile || parsed.errors.length > 0) {
  for (const message of parsed.errors) console.error(message.message);
  process.exit(1);
}

const validationErrors = validateProfile(parsed.profile).filter((message) => message.severity === "error");
if (validationErrors.length > 0) {
  for (const message of validationErrors) console.error(message.message);
  process.exit(1);
}

for (const [name, file] of Object.entries(FONTS)) {
  if (!fs.existsSync(path.resolve(file))) {
    console.error(`Missing PDF font "${name}": ${file}`);
    process.exit(1);
  }
}

const profile: Profile = filterProfileForTarget(parsed.profile, "pdf");
const outputPath = path.resolve("public", profile.pdf.filename);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  bufferPages: true,
  info: { Title: `${profile.name} CV`, Author: profile.name }
});

doc.pipe(fs.createWriteStream(outputPath));

for (const [name, file] of Object.entries(FONTS)) {
  doc.registerFont(name, path.resolve(file));
}

/* ------------------------------------------------------------------ *
 * Page + column plumbing
 * ------------------------------------------------------------------ */

let pageCount = 1;

function gotoPage(index: number) {
  while (pageCount <= index) {
    doc.addPage();
    pageCount += 1;
  }
  doc.switchToPage(index);
}

type TextStyle = {
  font?: keyof typeof FONTS;
  size?: number;
  color?: string;
  lineGap?: number;
  indent?: number;
  link?: string;
};

class Column {
  page = 0;
  y: number;

  constructor(
    readonly x: number,
    readonly width: number,
    readonly topFor: (page: number) => number
  ) {
    this.y = topFor(0);
  }

  atTop() {
    return this.y <= this.topFor(this.page) + 0.5;
  }

  /** Move to the next page if `height` will not fit below the cursor. */
  reserve(height: number) {
    if (this.y + height <= CONTENT_BOTTOM) return;
    this.page += 1;
    this.y = this.topFor(this.page);
  }

  gap(height: number) {
    this.y += height;
  }

  text(value: string, style: TextStyle = {}) {
    const font = style.font ?? "light";
    const size = style.size ?? 9;
    const lineGap = style.lineGap ?? 3;
    const indent = style.indent ?? 0;
    const lineHeight = size + lineGap;
    const width = this.width - indent;

    for (const line of wrap(value, width, font, size)) {
      this.reserve(lineHeight);
      gotoPage(this.page);
      doc.font(font).fontSize(size).fillColor(style.color ?? TEXT);
      doc.text(line, this.x + indent, this.y, { width, lineBreak: false });
      if (style.link) {
        doc.link(this.x + indent, this.y, doc.widthOfString(line), lineHeight, style.link);
      }
      this.y += lineHeight;
    }
  }

  /** Bulleted line with a hanging indent, so wraps align under the text. */
  bullet(value: string, style: TextStyle = {}) {
    const size = style.size ?? 8.2;
    const lineGap = style.lineGap ?? 2.4;
    const lineHeight = size + lineGap;
    const indent = style.indent ?? 0;
    const marker = 9;
    const width = this.width - indent - marker;
    const lines = wrap(value, width, style.font ?? "light", size);

    lines.forEach((line, index) => {
      this.reserve(lineHeight);
      gotoPage(this.page);
      if (index === 0) {
        doc.font("body").fontSize(size).fillColor(ACCENT);
        doc.text("\u2022", this.x + indent, this.y, { width: marker, lineBreak: false });
      }
      doc.font(style.font ?? "light").fontSize(size).fillColor(style.color ?? TEXT);
      doc.text(line, this.x + indent + marker, this.y, { width, lineBreak: false });
      this.y += lineHeight;
    });
  }

  /** Section heading: display face, uppercase, hairline rule underneath. */
  heading(title: string, size: number) {
    const lineHeight = size + 3;
    if (!this.atTop()) this.gap(10);
    // Keep a heading with at least a couple of lines of its content.
    this.reserve(lineHeight + 32);
    gotoPage(this.page);
    doc.font("display").fontSize(size).fillColor(INK);
    doc.text(title.toUpperCase(), this.x, this.y, { width: this.width, lineBreak: false });
    this.y += lineHeight;
    doc
      .moveTo(this.x, this.y)
      .lineTo(this.x + this.width, this.y)
      .lineWidth(0.6)
      .strokeColor(INK)
      .stroke();
    this.y += 7;
  }
}

/** Greedy word wrap. PDFKit's own wrapper fights manual page control. */
function wrap(text: string, width: number, font: keyof typeof FONTS, size: number): string[] {
  doc.font(font).fontSize(size);
  const out: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (doc.widthOfString(candidate) <= width) {
        line = candidate;
      } else {
        if (line) out.push(line);
        line = word;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Page furniture
 * ------------------------------------------------------------------ */

function paintBands(pageIndex: number, totalPages: number) {
  gotoPage(pageIndex);
  doc.rect(0, 0, BAND_TOP_W, BAND_TOP_H).fill(ACCENT);
  doc.rect(BAND_BOTTOM_X, PAGE_H - BAND_BOTTOM_H, PAGE_W - BAND_BOTTOM_X, BAND_BOTTOM_H).fill(ACCENT);

  const label = totalPages > 1 ? `${profile.name}  \u00b7  ${pageIndex + 1} / ${totalPages}` : profile.name;
  doc.font("light").fontSize(8).fillColor("#FFFFFF");
  doc.text(label, BAND_BOTTOM_X, PAGE_H - BAND_BOTTOM_H / 2 - 5, {
    width: PAGE_W - BAND_BOTTOM_X - MARGIN,
    align: "right",
    lineBreak: false
  });
}

function paintMasthead() {
  gotoPage(0);

  const parts = profile.name.trim().split(/\s+/);
  const surname = parts.length > 1 ? parts.pop()! : "";
  const given = parts.join(" ");

  doc.font("display").fontSize(20).fillColor(INK);
  let y = BAND_TOP_H + 16;
  for (const line of [given, surname].filter(Boolean)) {
    doc.text(line.toUpperCase(), SIDEBAR_X, y, { width: SIDEBAR_W, lineBreak: false });
    y += 24;
  }

  const photo = profile.assets?.photo;
  if (!photo?.src) return;
  const imagePath = path.resolve(photo.src);
  if (!fs.existsSync(imagePath)) return;

  const x = SIDEBAR_X + (SIDEBAR_W - PHOTO_D) / 2;
  const radius = PHOTO_D / 2;
  doc.save();
  doc.circle(x + radius, PHOTO_Y + radius, radius).clip();
  doc.image(imagePath, x, PHOTO_Y, { cover: [PHOTO_D, PHOTO_D], align: "center", valign: "center" });
  doc.restore();
  doc
    .circle(x + radius, PHOTO_Y + radius, radius)
    .lineWidth(2.5)
    .strokeColor(ACCENT)
    .stroke();
}

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const sidebar = new Column(SIDEBAR_X, SIDEBAR_W, (page) => (page === 0 ? SIDEBAR_TOP_FIRST : SIDEBAR_TOP_REST));
const main = new Column(MAIN_X, MAIN_W, () => CONTENT_TOP);

paintMasthead();
renderContact();
for (const section of profile.sections.filter((s) => SIDEBAR_SECTIONS.has(s.id))) {
  renderSidebarSection(section);
}

if (profile.title) {
  main.text(profile.title, { font: "semibold", size: 11, color: ACCENT, lineGap: 4 });
  main.gap(6);
}
for (const section of profile.sections.filter((s) => !SIDEBAR_SECTIONS.has(s.id))) {
  renderMainSection(section);
}

const totalPages = pageCount;
for (let index = 0; index < totalPages; index += 1) {
  paintBands(index, totalPages);
}

doc.flushPages();
doc.end();

console.log(`Generated ${path.relative(process.cwd(), outputPath)} (${totalPages} page${totalPages > 1 ? "s" : ""})`);

/* ------------------------------------------------------------------ */

function renderContact() {
  const rows: Array<[string, string, string | undefined]> = [
    ["Location", profile.location ?? "", undefined],
    ["Phone", profile.phone ?? "", undefined],
    ["Email", profile.email ?? "", profile.email ? `mailto:${profile.email}` : undefined],
    ["Website", shortUrl(profile.pdf.website, { keepWww: true }), profile.pdf.website],
    ["LinkedIn", shortUrl(profile.links.linkedin), profile.links.linkedin],
    ["GitHub", shortUrl(profile.links.github), profile.links.github]
  ];
  const present = rows.filter(([, value]) => value);
  if (present.length === 0) return;

  sidebar.heading("Contact", 11);
  for (const [label, value, link] of present) {
    sidebar.text(label, { font: "semibold", size: 7.5, color: MUTED, lineGap: 1.5 });
    sidebar.text(value, { font: "light", size: 8.5, color: link ? ACCENT : TEXT, lineGap: 2.5, link });
    sidebar.gap(4);
  }
  sidebar.gap(4);
}

function renderSidebarSection(section: ProfileSection) {
  sidebar.heading(section.title, 11);

  for (const line of listLines(section.blocks)) {
    sidebar.text(line, { font: "light", size: 8.5, lineGap: 2.5 });
  }

  if (section.id === "skills") {
    renderSkills(section);
  } else {
    for (const entry of section.entries) {
      sidebar.reserve(26);
      sidebar.text(entry.title, { font: "semibold", size: 8.8, color: INK, lineGap: 2 });
      const detail = [entry.fields.Degree, entry.fields.Proficiency, entry.fields.Role].filter(Boolean).join(", ");
      if (detail) sidebar.text(detail, { font: "light", size: 8, lineGap: 2 });
      const meta = [entry.fields.Period, entry.fields.Location, entry.fields.Date].filter(Boolean).join(" \u00b7 ");
      if (meta) sidebar.text(meta, { font: "light", size: 7.5, color: MUTED, lineGap: 2 });
      sidebar.gap(6);
    }
  }
  sidebar.gap(6);
}

/** Skills are dense and repetitive: group by category, comma-join the items. */
function renderSkills(section: ProfileSection) {
  const groups = new Map<string, string[]>();
  for (const entry of section.entries) {
    const key = entry.fields.Category ?? "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry.title);
  }
  for (const [category, items] of groups) {
    sidebar.reserve(24);
    sidebar.text(category, { font: "semibold", size: 7.5, color: MUTED, lineGap: 1.5 });
    sidebar.text(items.join(", "), { font: "light", size: 8.5, lineGap: 2.5 });
    sidebar.gap(5);
  }
}

function renderMainSection(section: ProfileSection) {
  main.heading(section.title, 13);
  renderBlocks(main, section.blocks, 8.8);

  for (const entry of section.entries) {
    renderMainEntry(entry);
  }
  main.gap(4);
}

function renderMainEntry(entry: ProfileEntry) {
  const iconPath = entry.icon ? path.resolve(entry.icon.src) : undefined;
  const hasIcon = Boolean(iconPath && fs.existsSync(iconPath));
  const iconSize = 26;

  main.reserve(46);
  const headerPage = main.page;
  const headerY = main.y;

  const indent = hasIcon ? iconSize + 8 : 0;
  const inner = new Column(main.x + indent, main.width - indent, () => CONTENT_TOP);
  inner.page = main.page;
  inner.y = main.y;

  inner.text(entry.title, { font: "bold", size: 10, color: INK, lineGap: 1.5 });

  const role = [entry.fields.Role, entry.fields.Degree, entry.fields.Language].filter(Boolean).join(" \u00b7 ");
  if (role) inner.text(role, { font: "semibold", size: 8.7, color: TEXT, lineGap: 1.5 });

  const meta = [entry.fields.Period, entry.fields.Location, entry.fields.Date, entry.fields.Venue]
    .filter(Boolean)
    .join("  \u00b7  ");
  if (meta) inner.text(meta, { font: "light", size: 7.8, color: MUTED, lineGap: 1.5 });

  if (entry.fields.Link) {
    inner.text(shortUrl(entry.fields.Link), {
      font: "light",
      size: 8,
      color: ACCENT,
      lineGap: 2,
      link: entry.fields.Link
    });
  }

  // Only draw the icon if the header did not spill onto the next page.
  if (hasIcon && inner.page === headerPage) {
    gotoPage(headerPage);
    doc.image(iconPath!, main.x, headerY, { fit: [iconSize, iconSize], align: "center", valign: "center" });
    if (inner.y < headerY + iconSize) inner.y = headerY + iconSize;
  }

  main.page = inner.page;
  main.y = inner.y + 2;

  renderBlocks(main, entry.blocks, 8.2, indent);
  main.gap(5);
}

function renderBlocks(column: Column, blocks: RichTextBlock[], size: number, indent = 0) {
  for (const block of blocks) {
    const text = markdownToText(block.markdown);
    if (!text) continue;

    if (block.kind === "list") {
      for (const item of text.split("\n").filter(Boolean)) {
        column.bullet(item.replace(/^-\s*/, ""), { size, indent });
      }
      column.gap(2);
    } else {
      for (const paragraph of text.split(/\n{2,}/)) {
        if (!paragraph.trim()) continue;
        column.text(paragraph.trim(), { font: "light", size, lineGap: 2.8, indent });
        column.gap(4);
      }
    }
  }
}

function listLines(blocks: RichTextBlock[]): string[] {
  return blocks
    .filter((block) => block.kind === "list")
    .flatMap((block) => markdownToText(block.markdown).split("\n"))
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

function markdownToText(markdown: string): string {
  return markdown
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*-\s+/gm, "- ")
    .trim();
}

/** Long URLs blow out a 180pt column; show the readable part, link the full one. */
function shortUrl(url?: string, options: { keepWww?: boolean } = {}): string {
  if (!url) return "";
  const withoutScheme = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return options.keepWww ? withoutScheme : withoutScheme.replace(/^www\./, "");
}
