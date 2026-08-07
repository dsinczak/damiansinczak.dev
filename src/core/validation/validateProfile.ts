import fs from "node:fs";
import path from "node:path";
import type { Profile, ValidationMessage } from "../model/profile";

export function validateProfile(profile: Profile, workspaceRoot = process.cwd()): ValidationMessage[] {
  const messages: ValidationMessage[] = [];

  if (!profile.name.trim()) {
    messages.push(error("Profile name is required"));
  }
  if (!profile.title.trim()) {
    messages.push(error("Profile title is required"));
  }

  validateAsset(profile.assets?.photo, "assets.photo", profile, workspaceRoot, messages);
  validateAsset(profile.assets?.banner, "assets.banner", profile, workspaceRoot, messages);

  for (const [name, url] of Object.entries(profile.links)) {
    if (url && !isValidUrl(url) && !url.startsWith("mailto:")) {
      messages.push(error(`Invalid URL in links.${name}: ${url}`));
    }
  }

  if (!/^[\w .()-]+\.pdf$/i.test(profile.pdf.filename)) {
    messages.push(error(`Invalid PDF filename: ${profile.pdf.filename}`));
  }

  for (const section of profile.sections) {
    for (const entry of section.entries) {
      const context = `${section.title} > ${entry.title}`;
      const level = entry.fields.Level;
      if (section.id === "skills" && level !== undefined) {
        const parsed = Number(level);
        if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
          messages.push(
            error("Skill Level must be an integer from 0 to 100", entry.location, context)
          );
        }
      }
      if (section.id === "experience" && !entry.fields.Period) {
        messages.push(error("Experience entry is missing Period", entry.location, context));
      }
    }
  }

  return messages;
}

function validateAsset(
  asset: { src: string; alt: string } | undefined,
  field: string,
  profile: Profile,
  workspaceRoot: string,
  messages: ValidationMessage[]
) {
  if (!asset) return;
  if (/^https?:\/\//i.test(asset.src)) {
    messages.push(error(`${field}.src must be a local repository-relative path`));
    return;
  }
  if (!asset.alt.trim()) {
    messages.push(error(`${field}.alt is required when the asset is configured`));
  }

  const absoluteRoot = path.resolve(workspaceRoot);
  const absoluteAssetPath = path.resolve(absoluteRoot, asset.src);
  if (!absoluteAssetPath.startsWith(absoluteRoot)) {
    messages.push(error(`${field}.src must stay inside the project workspace`));
    return;
  }
  if (!fs.existsSync(absoluteAssetPath)) {
    messages.push(error(`${field}.src does not exist: ${asset.src}`));
  }
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function error(
  message: string,
  location?: ValidationMessage["location"],
  context?: string
): ValidationMessage {
  return { severity: "error", message, location, context };
}
