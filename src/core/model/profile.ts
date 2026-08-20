export type OutputTarget = "all" | "web" | "pdf" | "hidden";

export type WebDisclosure = "expanded" | "collapsed" | "none";

export type Metadata = {
  target: OutputTarget;
  web: WebDisclosure;
};

export type SourceLocation = {
  file: string;
  line: number;
};

export type ValidationSeverity = "error" | "warning";

export type ValidationMessage = {
  severity: ValidationSeverity;
  message: string;
  location?: SourceLocation;
  context?: string;
};

export type ProfileAsset = {
  src: string;
  alt: string;
  position?: string;
  sourcePath?: string;
  publicPath?: string;
};

export type ProfileAssets = {
  photo?: ProfileAsset;
  banner?: ProfileAsset;
};

export type ProfileLinks = {
  linkedin?: string;
  github?: string;
  website?: string;
  email?: string;
  [key: string]: string | undefined;
};

export type PdfOptions = {
  filename: string;
  /** Rendered in the PDF contact block only; the web page never reads `pdf.*`. */
  website?: string;
};

/**
 * Optional overrides for what search engines, social cards and AI crawlers see.
 *
 * Every field has a fallback derived from the profile itself (see
 * `src/core/seo/meta.ts`), so omitting this block entirely still produces a
 * complete, valid head. Set a field only when the derived value is wrong.
 */
export type SeoOptions = {
  /**
   * Occupation as a person would search for it, e.g. "Senior Software Engineer".
   * Distinct from `Profile.title`, which is a positioning tagline and makes a
   * poor `jobTitle` in structured data.
   */
  jobTitle?: string;
  /** <meta name="description">. Keep under ~155 characters. */
  description?: string;
  /** <title>. Overrides the derived "Name - Job Title | CV" form. */
  pageTitle?: string;
  /** Extra schema.org Person.sameAs URLs beyond the ones already in `links`. */
  sameAs?: string[];
  /** Topics for schema.org Person.knowsAbout, merged with the Skills section. */
  knowsAbout?: string[];
};

export type RichTextBlock = {
  kind: "paragraph" | "list" | "detail";
  markdown: string;
  metadata: Metadata;
  label?: string;
  location?: SourceLocation;
};

export type ProfileEntry = {
  title: string;
  metadata: Metadata;
  icon?: ProfileAsset;
  fields: Record<string, string>;
  extraFields: Record<string, string>;
  blocks: RichTextBlock[];
  location?: SourceLocation;
};

export type ProfileSection = {
  id: SectionId;
  title: string;
  metadata: Metadata;
  entries: ProfileEntry[];
  blocks: RichTextBlock[];
  location?: SourceLocation;
};

export type SectionId =
  | "bio"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "publications"
  | "languages"
  | "interests";

export type Profile = {
  name: string;
  title: string;
  headlineInfo?: string;
  location?: string;
  email?: string;
  phone?: string;
  assets?: ProfileAssets;
  links: ProfileLinks;
  pdf: PdfOptions;
  seo?: SeoOptions;
  sections: ProfileSection[];
  sourcePath: string;
};

export type ProfileParseResult = {
  profile?: Profile;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
};

export const defaultMetadata: Metadata = {
  target: "all",
  web: "none"
};

export const sectionIdsByTitle: Record<string, SectionId> = {
  bio: "bio",
  experience: "experience",
  projects: "projects",
  skills: "skills",
  education: "education",
  publications: "publications",
  languages: "languages",
  interests: "interests"
};

export const knownFieldNames = new Set([
  "role",
  "period",
  "location",
  "category",
  "level",
  "tech",
  "link",
  "authors",
  "venue",
  "date",
  "degree",
  "language",
  "proficiency"
]);
