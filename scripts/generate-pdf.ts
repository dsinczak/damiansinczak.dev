import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { filterProfileForTarget } from "../src/core/filtering/filterProfileForTarget";
import type { ProfileEntry, RichTextBlock } from "../src/core/model/profile";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { validateProfile } from "../src/core/validation/validateProfile";

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

const profile = filterProfileForTarget(parsed.profile, "pdf");
const outputPath = path.resolve("public", profile.pdf.filename);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 42, bottom: 42, left: 48, right: 48 },
  info: {
    Title: `${profile.name} CV`,
    Author: profile.name
  }
});

doc.pipe(fs.createWriteStream(outputPath));

doc.font("Helvetica-Bold").fontSize(22).text(profile.name);
doc.moveDown(0.25);
doc.font("Helvetica").fontSize(11).fillColor("#333333").text(profile.title);
doc.moveDown(0.2);
doc.fontSize(9).fillColor("#666666").text(
  [profile.location, profile.email, profile.phone, profile.links.linkedin].filter(Boolean).join(" | ")
);
doc.moveDown(1);

if (profile.assets?.photo?.src) {
  const imagePath = path.resolve(profile.assets.photo.src);
  if (fs.existsSync(imagePath)) {
    const currentY = doc.y;
    doc.image(imagePath, 455, 42, { width: 72, height: 72, fit: [72, 72] });
    doc.y = Math.max(doc.y, currentY);
  }
}

for (const section of profile.sections) {
  ensureSpace(70);
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#111111").text(section.title);
  doc.moveTo(48, doc.y + 3).lineTo(547, doc.y + 3).strokeColor("#d0d0d0").stroke();
  doc.moveDown(0.5);

  writeBlocks(section.blocks);

  for (const entry of section.entries) {
    writeEntry(entry);
  }
}

doc.end();

console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);

function writeEntry(entry: ProfileEntry) {
  ensureSpace(80);
  const entryY = doc.y;
  const iconPath = entry.icon ? path.resolve(entry.icon.src) : undefined;
  const textX = iconPath && fs.existsSync(iconPath) ? 90 : 48;
  const textWidth = 547 - textX;

  if (iconPath && fs.existsSync(iconPath)) {
    doc.image(iconPath, 48, entryY, { fit: [30, 30] });
  }

  doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111111").text(entry.title, textX, entryY, { width: textWidth });
  const subtitle = [entry.fields.Role, entry.fields.Degree, entry.fields.Category, entry.fields.Language]
    .filter(Boolean)
    .join(" | ");
  if (subtitle) doc.font("Helvetica").fontSize(9).fillColor("#333333").text(subtitle, textX, doc.y, { width: textWidth });
  const meta = [entry.fields.Period, entry.fields.Location, entry.fields.Date, entry.fields.Venue, entry.fields.Proficiency]
    .filter(Boolean)
    .join(" | ");
  if (meta) doc.fontSize(8.5).fillColor("#666666").text(meta, textX, doc.y, { width: textWidth });
  if (iconPath && fs.existsSync(iconPath)) doc.y = Math.max(doc.y, entryY + 30);
  writeBlocks(entry.blocks);
  doc.moveDown(0.35);
}

function writeBlocks(blocks: RichTextBlock[]) {
  for (const block of blocks) {
    const text = markdownToText(block.markdown);
    if (!text) continue;
    if (block.kind === "list") {
      for (const bullet of text.split("\n").filter(Boolean)) {
        ensureSpace(24);
        doc.font("Helvetica").fontSize(8.8).fillColor("#222222").text(`- ${bullet.replace(/^- /, "")}`, {
          indent: 10
        });
      }
      doc.moveDown(0.2);
    } else {
      ensureSpace(34);
      doc.font("Helvetica").fontSize(8.8).fillColor("#222222").text(text, {
        lineGap: 1.5
      });
      doc.moveDown(0.35);
    }
  }
}

function markdownToText(markdown: string): string {
  return markdown
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*-\s+/gm, "- ")
    .trim();
}

function ensureSpace(height: number) {
  if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}
