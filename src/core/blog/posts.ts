import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { run as renderMermaid } from "@mermaid-js/mermaid-cli";
import matter from "gray-matter";
import { z } from "zod";
import { renderMarkdown } from "../rendering/markdown";

const blogDirectory = "content/blog";
const blogAssetsDirectory = "public/blog-assets";
const browserExecutablePaths = process.platform === "win32"
  ? [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    ]
  : [process.env.PUPPETEER_EXECUTABLE_PATH];

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  draft: z.boolean().default(false)
});

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  draft: boolean;
  html: string;
};

/** Read independent blog articles from content/blog, newest first. */
export function getBlogPosts(workspaceRoot = process.cwd()): BlogPost[] {
  const directory = path.resolve(workspaceRoot, blogDirectory);
  if (!fs.existsSync(directory)) return [];

  return findMarkdownFiles(directory)
    .map((sourcePath) => parseBlogPost(sourcePath, directory))
    .sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());
}

export function getPublishedBlogPosts(workspaceRoot = process.cwd()): BlogPost[] {
  return getBlogPosts(workspaceRoot).filter((post) => !post.draft);
}

/** Copy non-Markdown files from content/blog into public/blog-assets, preserving folders. */
export async function prepareBlogAssets(workspaceRoot = process.cwd()): Promise<void> {
  const sourceDirectory = path.resolve(workspaceRoot, blogDirectory);
  const outputDirectory = path.resolve(workspaceRoot, blogAssetsDirectory);

  fs.rmSync(outputDirectory, { recursive: true, force: true });
  if (!fs.existsSync(sourceDirectory)) return;

  copyAssets(sourceDirectory, outputDirectory);
  await prepareMermaidDiagrams(sourceDirectory, outputDirectory);
}

function findMarkdownFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMarkdownFiles(entryPath);
    return entry.isFile() && path.extname(entry.name).toLowerCase() === ".md" ? [entryPath] : [];
  });
}

function copyAssets(sourceDirectory: string, outputDirectory: string): void {
  for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDirectory, entry.name);
    const outputPath = path.join(outputDirectory, entry.name);

    if (entry.isDirectory()) {
      copyAssets(sourcePath, outputPath);
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() !== ".md") {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.copyFileSync(sourcePath, outputPath);
    }
  }
}

function parseBlogPost(sourcePath: string, sourceDirectory: string): BlogPost {
  const parsed = matter(fs.readFileSync(sourcePath, "utf8"));
  const metadata = frontmatterSchema.safeParse(parsed.data);

  if (!metadata.success) {
    const filename = path.relative(process.cwd(), sourcePath);
    const issues = metadata.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid blog frontmatter in ${filename}: ${issues}`);
  }

  return {
    slug: path.relative(sourceDirectory, sourcePath).replace(/\\/g, "/").replace(/\.md$/i, ""),
    ...metadata.data,
    html: renderMarkdown(rewriteLocalLinks(replaceMermaidFences(parsed.content, sourcePath, sourceDirectory), sourcePath, sourceDirectory))
  };
}

const mermaidFence = /^\s*```mermaid\s*\r?\n([\s\S]*?)^\s*```\s*$/gm;

type MermaidDiagram = {
  code: string;
  filename: string;
};

/** Replace Mermaid code fences with the static SVG URL generated during the build. */
function replaceMermaidFences(markdown: string, sourcePath: string, sourceDirectory: string): string {
  let index = 0;
  return markdown.replace(mermaidFence, (_, code: string) => {
    const diagram = mermaidDiagram(code, sourcePath, sourceDirectory, index);
    index += 1;
    return `![Diagram](/blog-assets/diagrams/${diagram.filename})`;
  });
}

async function prepareMermaidDiagrams(sourceDirectory: string, outputDirectory: string): Promise<void> {
  for (const sourcePath of findMarkdownFiles(sourceDirectory)) {
    const content = matter(fs.readFileSync(sourcePath, "utf8")).content;
    const diagrams = diagramsIn(content, sourcePath, sourceDirectory);

    for (const diagram of diagrams) {
      const outputPath = path.join(outputDirectory, "diagrams", diagram.filename) as `${string}.svg`;
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      await renderDiagram(diagram.code, outputPath);
    }
  }
}

function diagramsIn(markdown: string, sourcePath: string, sourceDirectory: string): MermaidDiagram[] {
  let index = 0;
  return [...markdown.matchAll(mermaidFence)].map((match) => {
    const diagram = mermaidDiagram(match[1], sourcePath, sourceDirectory, index);
    index += 1;
    return diagram;
  });
}

function mermaidDiagram(code: string, sourcePath: string, sourceDirectory: string, index: number): MermaidDiagram {
  const identity = `${path.relative(sourceDirectory, sourcePath)}\0${index}\0${code}`;
  const hash = createHash("sha256").update(identity).digest("hex").slice(0, 16);
  return { code: code.trim(), filename: `${hash}.svg` };
}

/**
 * Diagrams are static SVGs shown on both the light and the dark page, so they use
 * a transparent background and mid-tone colours that stay readable on either.
 * Text inside nodes sits on the solid node fill; lines and free text sit on the page.
 */
const diagramTheme = {
  theme: "base",
  themeVariables: {
    background: "transparent",
    fontFamily: "inherit",
    primaryColor: "#d0d7de",
    primaryTextColor: "#1f2328",
    primaryBorderColor: "#6e7781",
    secondaryColor: "#b6d4f2",
    tertiaryColor: "#e6d5b8",
    lineColor: "#8b949e",
    textColor: "#8b949e",
    edgeLabelBackground: "#d0d7de",
    clusterBkg: "transparent",
    clusterBorder: "#8b949e",
    noteBkgColor: "#e6d5b8",
    noteTextColor: "#1f2328",
    actorBkg: "#d0d7de",
    actorTextColor: "#1f2328",
    actorLineColor: "#8b949e",
    signalColor: "#8b949e",
    signalTextColor: "#8b949e",
    labelTextColor: "#1f2328"
  }
} as const;

async function renderDiagram(code: string, outputPath: `${string}.svg`): Promise<void> {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "damiansinczak-mermaid-"));
  const inputPath = path.join(temporaryDirectory, "diagram.mmd");
  const executablePath = browserExecutablePaths.find((candidate) => candidate && fs.existsSync(candidate));

  try {
    fs.writeFileSync(inputPath, code, "utf8");
    await renderMermaid(inputPath, outputPath, {
      quiet: true,
      parseMMDOptions: { backgroundColor: "transparent", mermaidConfig: diagramTheme },
      ...(executablePath ? { puppeteerConfig: { executablePath } } : {})
    });
  } catch (error) {
    throw new Error(`Could not render Mermaid diagram for ${outputPath}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

/**
 * Markdown files are authored relative to their own folder. Published files live
 * under /blog-assets with the same directory structure, so the author never has
 * to learn a separate web path for images, downloads, or other attachments.
 */
function rewriteLocalLinks(markdown: string, sourcePath: string, sourceDirectory: string): string {
  return markdown.replace(/(!?\[[^\]]*\]\()([^\s)]+)([^)]*\))/g, (_, opening, href, closing) => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return `${opening}${href}${closing}`;

    const absoluteTarget = path.resolve(path.dirname(sourcePath), href);
    const absoluteSource = path.resolve(sourceDirectory);
    const relativeTarget = path.relative(absoluteSource, absoluteTarget);

    if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) return `${opening}${href}${closing}`;
    return `${opening}/blog-assets/${relativeTarget.replace(/\\/g, "/")}${closing}`;
  });
}
