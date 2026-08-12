import type { Metadata, OutputTarget, ValidationMessage, WebDisclosure } from "../model/profile";
import { defaultMetadata } from "../model/profile";

const validTargets = new Set<OutputTarget>(["all", "web", "pdf", "hidden"]);
const validWebValues = new Set<WebDisclosure>(["expanded", "collapsed", "none"]);

export function mergeMetadata(base?: Partial<Metadata>, override?: Partial<Metadata>): Metadata {
  return {
    target: override?.target ?? base?.target ?? defaultMetadata.target,
    web: override?.web ?? base?.web ?? defaultMetadata.web
  };
}

export function parseMetadataComment(
  line: string,
  file: string,
  lineNumber: number
): { metadata?: Partial<Metadata>; message?: ValidationMessage } {
  const match = line.trim().match(/^<!--\s*([^>]+?)\s*-->$/);
  if (!match) return {};

  const metadata: Partial<Metadata> = {};
  const parts = match[1].split(";").map((part) => part.trim()).filter(Boolean);

  for (const part of parts) {
    const [rawKey, rawValue] = part.split(":").map((value) => value?.trim());
    if (!rawKey || !rawValue) {
      return {
        message: {
          severity: "error",
          message: `Invalid metadata comment segment: ${part}`,
          location: { file, line: lineNumber }
        }
      };
    }

    const key = rawKey.toLowerCase();
    const value = rawValue.toLowerCase();

    if (key === "target") {
      if (!validTargets.has(value as OutputTarget)) {
        return {
          message: {
            severity: "error",
            message: `Unknown output target: ${rawValue}`,
            location: { file, line: lineNumber }
          }
        };
      }
      metadata.target = value as OutputTarget;
      continue;
    }

    if (key === "web") {
      if (!validWebValues.has(value as WebDisclosure)) {
        return {
          message: {
            severity: "error",
            message: `Unknown web disclosure value: ${rawValue}`,
            location: { file, line: lineNumber }
          }
        };
      }
      metadata.web = value as WebDisclosure;
      continue;
    }

    return {
      message: {
        severity: "error",
        message: `Unknown metadata key: ${rawKey}`,
        location: { file, line: lineNumber }
      }
    };
  }

  return { metadata };
}

export function parseDirectiveAttributes(value: string): Partial<Metadata> & { label?: string } {
  const metadata: Partial<Metadata> & { label?: string } = {};
  const attributePattern = /(\w+)="([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = attributePattern.exec(value)) !== null) {
    const key = match[1].toLowerCase();
    const attrValue = match[2];
    const normalizedValue = attrValue.toLowerCase();
    if (key === "target" && validTargets.has(normalizedValue as OutputTarget)) {
      metadata.target = normalizedValue as OutputTarget;
    }
    if (key === "web" && validWebValues.has(normalizedValue as WebDisclosure)) {
      metadata.web = normalizedValue as WebDisclosure;
    }
    if (key === "label") {
      metadata.label = attrValue;
    }
  }

  return metadata;
}
