import type { OutputTarget, Profile, ProfileEntry, ProfileSection, RichTextBlock } from "../model/profile";

export function filterProfileForTarget(profile: Profile, target: OutputTarget | string): Profile {
  if (target === "all" || target === "hidden") {
    throw new Error(`filterProfileForTarget expects a concrete render target, got: ${target}`);
  }

  return {
    ...profile,
    sections: profile.sections
      .filter((section) => isVisible(section.metadata.target, target))
      .map((section) => filterSection(section, target))
      .filter((section) => section.blocks.length > 0 || section.entries.length > 0)
  };
}

function filterSection(section: ProfileSection, target: string): ProfileSection {
  return {
    ...section,
    blocks: filterBlocks(section.blocks, target),
    entries: section.entries
      .filter((entry) => isVisible(entry.metadata.target, target))
      .map((entry) => filterEntry(entry, target))
      .filter((entry) => entry.blocks.length > 0 || Object.keys(entry.fields).length > 0)
  };
}

function filterEntry(entry: ProfileEntry, target: string): ProfileEntry {
  return {
    ...entry,
    blocks: filterBlocks(entry.blocks, target)
  };
}

function filterBlocks(blocks: RichTextBlock[], target: string): RichTextBlock[] {
  return blocks.filter((block) => isVisible(block.metadata.target, target));
}

function isVisible(contentTarget: string, renderTarget: string): boolean {
  return contentTarget === "all" || contentTarget === renderTarget;
}
