# Content-Driven Personal CV Site Specification

## Purpose

Build a personal website that also acts as an online CV. The website content and generated PDF CV must come from one canonical Markdown source, so profile updates are made once and reused everywhere.

## Core Principle

The project has a single source of truth:

```text
content/profile.md
```

The website and PDF generator both consume this file through a shared parser. Components, pages, and PDF templates define presentation only. They must not duplicate biography, experience, project, skill, education, or contact content.

```text
content/profile.md
        |
        v
shared parser and validation
        |
        +--> generated static website
        |
        +--> generated PDF CV
```

The initial implementation should use build-time generation. Visitors should receive prebuilt website assets and a pregenerated PDF. The browser should not fetch the Markdown source or generate the CV PDF at runtime.

## Goals

- Store professional profile and CV content in one Markdown file.
- Generate the personal website from that Markdown file before deployment.
- Generate a PDF CV from the same Markdown file before deployment.
- Keep the Markdown readable and editable without needing to touch application code.
- Validate the Markdown structure before building the website or PDF.
- Allow the website and PDF to have different layouts while sharing the same content.
- Make it easy to add or remove CV sections later.
- Serve static generated output in production with no client-side Markdown parsing or PDF generation.

## First Implementation Decisions

These decisions are fixed for the first implementation so parser and website work can start without revisiting architecture:

- Use TypeScript for the parser, validation, website data model, and PDF generation scripts.
- Keep the content parser framework-independent.
- Use build-time static generation for the website.
- Use Astro as the preferred first web framework unless a later implementation constraint forces a different static framework.
- Generate the PDF from the parsed profile model through a dedicated PDF template, not from a browser screenshot of the website.
- Treat `content/profile.md` and referenced local assets as source files.
- Copy or transform required image assets into the generated public output during the build.

## Non-Goals

- Do not define final biography, project, or employment content in this specification.
- Do not require a CMS for the initial version.
- Do not duplicate the same CV content in page components, PDF templates, or configuration files.
- Do not make the PDF a screenshot of the website for the first implementation.
- Do not fetch or parse `content/profile.md` in the visitor's browser for the initial version.
- Do not generate the PDF in the visitor's browser for the initial version.

## Content Source

The canonical content file should use Markdown with frontmatter:

```text
content/profile.md
```

The frontmatter should hold structured metadata that is awkward to infer from prose. The Markdown body should hold human-readable CV content.

See [profile-md-example.md](profile-md-example.md) for a complete example `content/profile.md` file.

## Markdown Schema

The first implementation should use a predictable Markdown structure rather than free-form Markdown.

Required frontmatter fields:

- `name`
- `title`

Optional frontmatter fields:

- `location`
- `email`
- `phone`
- `assets.photo.src`
- `assets.photo.alt`
- `assets.photo.position`
- `assets.banner.src`
- `assets.banner.alt`
- `assets.banner.position`
- `links.linkedin`
- `links.github`
- `links.website`
- `links.email`
- `pdf.filename`

Supported top-level sections:

- `# Bio`
- `# Experience`
- `# Projects`
- `# Skills`
- `# Education`
- `# Publications`
- `# Languages`
- `# Interests`

Top-level section names should be stable because they are used by the parser. Individual sections may be omitted if they have no content.

### Profile Assets

Profile image information should live in frontmatter so the website and PDF renderer can use the same asset metadata.

Recommended structure:

```yaml
assets:
  photo:
    src: content/profile_pic.jpg
    alt: Damian Sińczak
    position: center
  banner:
    src: content/banner.jpeg
    alt: Code editor close-up
    position: center
```

Asset rules:

- `assets.photo.src` should point to a local project asset using a repository-relative path.
- The first implementation should reject remote image URLs.
- The build should copy or process local image assets into a public output path for the website.
- The PDF generator should read the same local source asset, not the copied web URL.
- `assets.photo.alt` should describe the person in the image for web accessibility.
- `assets.photo.position` is optional and may use CSS-like object positioning such as `center`, `top`, or `50% 35%`.
- `assets.banner` is optional and web-oriented. PDF generation may ignore it unless a future PDF design needs a banner.
- If `assets.photo` is missing, the website may render initials and the PDF may omit the photo.
- Renderers should not fetch profile images from LinkedIn or another remote service during production rendering.

### Markdown Parsing Contract

The first parser should use this structure:

- frontmatter is YAML between the opening and closing `---`
- one `#` heading starts each top-level profile section
- one `##` heading starts each repeated section entry
- heading text is the display title unless a structured field overrides it later
- known key-value fields use `Field: value` lines directly below an entry heading
- bullet lists immediately following fields become concise CV/web summary bullets
- `:::detail ... :::` containers become structured detail blocks
- HTML metadata comments apply to the next section, entry, paragraph, list, or detail block

The parser should preserve rich Markdown for prose and bullet text instead of flattening everything to plain strings too early. Renderers can then choose whether to render rich text as HTML, plain text, or PDF text.

### Entry Field Grammar

The first implementation should recognize these key-value fields case-insensitively:

- `Role`
- `Period`
- `Location`
- `Category`
- `Level`
- `Tech`
- `Link`
- `Authors`
- `Venue`
- `Date`
- `Degree`
- `Language`
- `Proficiency`

Unknown key-value fields should not fail validation at first. They should be preserved in an `extraFields` map and reported as warnings so the schema can evolve without losing content.

Recommended section-specific fields:

- Experience: `Role`, `Period`, `Location`, optional `Tech`
- Projects: optional `Period`, `Tech`, `Link`
- Skills: optional `Category`, `Level`
- Education: optional `Degree`, `Period`, `Location`
- Publications: optional `Authors`, `Venue`, `Date`, `Link`
- Languages: optional `Language`, `Proficiency`

For skills, `Level` should be parsed as an integer from `0` to `100` when provided. Invalid numeric levels should be validation errors.

### Section IDs And Ordering

The parser should assign stable section IDs from supported section names:

- `Bio` -> `bio`
- `Experience` -> `experience`
- `Projects` -> `projects`
- `Skills` -> `skills`
- `Education` -> `education`
- `Publications` -> `publications`
- `Languages` -> `languages`
- `Interests` -> `interests`

The website should render sections in the order they appear in `content/profile.md`, unless a later explicit ordering field is added. Top navigation should use the same rendered section order.

## Output Targeting And Web Disclosure

The Markdown source should support two separate kinds of metadata:

- output targeting: whether content is rendered on the website, in the PDF CV, in both, or nowhere
- web disclosure state: whether richer web-only details are expanded or collapsed by default

These concerns should remain separate. Output targeting controls which renderer receives content. Disclosure state controls how the website initially presents content that is already allowed to render on the website.

### Output Targets

Supported output targets:

- `all` means render on both the website and PDF CV.
- `web` means render only on the website.
- `pdf` means render only in the generated PDF CV.
- `hidden` means keep the content in the source file but render it nowhere.

The default target should be `all` when no targeting metadata is provided.

### Web Disclosure Values

Supported web disclosure values:

- `expanded` means show the content by default on the website.
- `collapsed` means hide the detail behind an expandable control by default.
- `none` means render normally with no expand/collapse behavior.

The default disclosure value should be `none` unless a section type defines a more useful default later.

Disclosure metadata is web-only. It must not affect PDF generation.

### Metadata Comment Syntax

Markdown body metadata should use HTML comments because they are valid Markdown, easy to scan, and can be ignored by normal Markdown preview tools.

```md
<!-- target: web -->
<!-- web: collapsed -->
```

The two values may also be combined:

```md
<!-- target: web; web: collapsed -->
```

The parser should support the combined form as the preferred authoring style.

### Section-Level Metadata

Top-level sections may define metadata directly below the heading:

```md
# Publications
<!-- target: all; web: none -->

## Article Title

Standard publication details.
```

Section-level metadata applies to all entries in the section unless an entry or block defines a more specific value.

### Entry-Level Metadata

Repeated entries such as experience items, publications, projects, education items, certifications, and skills may define metadata below the entry heading:

```md
# Experience

## Company Name
<!-- target: all; web: collapsed -->

Role: Senior Developer
Period: 2022 - Present

- Concise achievement shown in both website and PDF.
- Another concise achievement shown in both website and PDF.

<!-- target: web; web: collapsed -->
Longer narrative description for the website. This can explain context, responsibilities, decision-making, collaboration, technical depth, and impact in a more expressive way than the PDF should contain.
```

Entry-level metadata should override section-level metadata.

### Block-Level Metadata

The initial version should support block-level metadata for paragraphs and grouped Markdown blocks. This is needed for richer web-only descriptions inside otherwise shared entries.

```md
# Publications

## Publication Title
<!-- target: all -->

Authors, venue, year, DOI or URL.

<!-- target: web; web: collapsed -->
Additional explanation of the work, motivation, contribution, relevance, and practical impact. This text appears on the website only and is collapsed by default.
```

A metadata comment applies to the Markdown block that immediately follows it. For a web-only detail area that contains multiple paragraphs or lists, use an explicit detail block:

```md
:::detail target="web" web="collapsed"
This longer description appears only on the website.

- It may contain paragraphs.
- It may contain bullet lists.
- It may contain links.
:::
```

The `:::detail` container should be the preferred syntax for multi-paragraph expandable content because it gives the parser a clear start and end boundary.

### Skills Metadata

Skills need both concise CV representation and richer website explanation.

Recommended skill format:

```md
# Skills

## TypeScript
<!-- target: all; web: collapsed -->

Level: 90
Category: Programming languages

Concise CV-facing skill summary.

:::detail target="web" web="collapsed"
Longer website-only description explaining how the skill was acquired, how it is used in practice, examples of relevant work, and current depth of experience.
:::
```

For PDF output, the renderer should use compact fields such as skill name, category, level, and the concise summary. For web output, the renderer may show the same compact fields plus an expandable detail area.

Skill levels should be treated as presentation hints, not exact objective measurements. The first version may support numeric levels such as `Level: 90`, but the visual representation can be decided later.

### Experience And Publications Metadata

Experience and publications should support concise shared content plus richer web-only detail.

Expected pattern:

```md
## Entry Title
<!-- target: all; web: collapsed -->

Role: Example role
Period: 2020 - 2024

- Short CV-friendly point.
- Short CV-friendly point.

:::detail target="web" web="collapsed"
Longer narrative for the website only.
:::
```

This keeps the PDF concise while allowing the website to provide depth when a visitor chooses to expand the entry.

### Frontmatter Defaults

Frontmatter may define global output and disclosure defaults for known sections:

```yaml
outputs:
  sections:
    bio:
      target: all
      web: none
    experience:
      target: all
      web: collapsed
    publications:
      target: all
      web: collapsed
    skills:
      target: all
      web: collapsed
    interests:
      target: web
      web: collapsed
```

Markdown body metadata should override frontmatter defaults.

### Parser Behavior

The parser should attach output and disclosure metadata to parsed sections, entries, and supported detail blocks. Renderers should then filter the shared profile model based on the requested output:

```ts
const webProfile = filterProfileForTarget(profile, "web");
const pdfProfile = filterProfileForTarget(profile, "pdf");
```

Filtering rules:

- `all` content appears in every output.
- `web` content appears only in the website output.
- `pdf` content appears only in the PDF output.
- `hidden` content appears in no output.
- missing target metadata is treated as `all`.
- web disclosure metadata is preserved only for website rendering.
- PDF rendering ignores `web` disclosure metadata.

Validation should reject unknown target values and unknown web disclosure values.

### Parser Output Requirements

The parser should return:

- normalized frontmatter values
- a list of parsed sections
- each section's stable ID, title, target metadata, web disclosure metadata, and entries or rich text
- each entry's title, metadata, recognized fields, extra fields, summary blocks, detail blocks, and source location when practical
- warnings for recoverable issues

Validation should return structured errors with enough context for an editor:

```text
content/profile.md:42 Experience > Vertex Inc.: missing Period
```

The parser should not silently drop content. Unsupported but readable content should be preserved as generic rich text and surfaced as a warning.
## Internal Data Model

The Markdown file should be parsed into a typed internal model before being used by the website or PDF renderer.

Example conceptual model:

```ts
type ProfileAsset = {
  src: string;
  alt: string;
  position?: string;
};

type ProfileAssets = {
  photo?: ProfileAsset;
  banner?: ProfileAsset;
};

type Profile = {
  name: string;
  title: string;
  location?: string;
  email?: string;
  phone?: string;
  assets?: ProfileAssets;
  links: ProfileLinks;
  bio?: RichTextBlock;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  education: EducationItem[];
  publications: PublicationItem[];
  languages: LanguageItem[];
  interests: string[];
  pdf: PdfOptions;
};
```

The concrete model should include additional internal fields as needed:

- `sourcePath` for local assets after path resolution
- `publicPath` for copied web assets after build processing
- `sections` as an ordered collection used by generic website navigation
- source line information for validation messages when the Markdown parser exposes it

The exact TypeScript names can change during implementation, but the separation between source content, parsed data, and presentation should remain.

## Pluggable Generator Architecture

The application should be built as a content pipeline with pluggable generators. The Markdown file is parsed and validated once into a normalized profile model, and each output generator receives that model instead of reading or interpreting `content/profile.md` directly.

Conceptual pipeline:

```text
content/profile.md
        |
        v
parser + validation
        |
        v
normalized Profile model
        |
        v
target filtering + shared transforms
        |
        +--> web generator
        +--> pdf generator
        +--> future generators
```

The core application should own:

- loading the source Markdown file
- parsing frontmatter, Markdown sections, metadata comments, and detail blocks
- validating profile structure and asset references
- building the typed profile model
- applying output target filtering
- resolving and preparing shared asset metadata
- invoking configured generators

Generators should own presentation and output writing only. A generator must not parse `content/profile.md` directly, duplicate Markdown schema rules, or implement its own incompatible target filtering behavior.

### Generator Contract

Each output type should be represented by a generator module with a small common interface.

Conceptual TypeScript shape:

```ts
type GeneratorTarget = "web" | "pdf" | string;

type ProfileGenerator = {
  name: string;
  target: GeneratorTarget;
  generate: (context: GeneratorContext) => Promise<GeneratorResult>;
};

type GeneratorContext = {
  profile: Profile;
  target: GeneratorTarget;
  sourcePath: string;
  outputDir: string;
  assets: AssetManifest;
  options: Record<string, unknown>;
};

type GeneratorResult = {
  files: GeneratedFile[];
  warnings: ValidationMessage[];
};
```

The concrete implementation may adjust names and fields, but the boundary should stay stable: generators receive a validated, target-filtered `Profile` and return generated files plus warnings.

### Central Filtering

Target filtering should happen in shared core code before generator execution:

```ts
const filteredProfile = filterProfileForTarget(profile, generator.target);
```

This prevents output-specific bugs such as the PDF accidentally including `target: web` detail blocks. Generators may still decide layout details, but they should not redefine what `all`, `web`, `pdf`, or `hidden` mean.

Recommended precedence:

- parse the complete source profile
- validate source-level structure and metadata
- resolve assets
- filter the profile for a specific generator target
- run target-specific validation when needed
- invoke the generator with the filtered profile

### Build Orchestrator

A build orchestrator should coordinate generator execution. It should be responsible for selecting generators, preparing common context, collecting warnings, and failing the build when required outputs cannot be generated.

Conceptual structure:

```text
src/core/
  parser/
  model/
  validation/
  filtering/
  assets/
  generators/

src/generators/
  web/
  pdf/
```

The first implementation should register `web` and `pdf` explicitly. Later implementations may add discovery or configuration for optional generators such as `json`, `docx`, `plain-text`, or external profile exports.

### Generator Requirements

Generator modules should follow these rules:

- They receive a parsed `Profile`, not raw Markdown.
- They write their generated artifacts to explicit output paths.
- They may emit multiple files.
- They may report warnings, but unrecoverable generation failures should fail the build.
- They should use shared asset metadata instead of resolving source paths independently.
- They should avoid hardcoded profile content.
- They should be removable without breaking the parser or other generators.

## Website Requirements

The website visual design is specified separately in [web-page-design-spec.md](web-page-design-spec.md).

The website should:

- Render its main content from the parsed profile data.
- Use the profile header as the first landing view.
- Include CV-style sections generated from the Markdown file.
- Link to the generated PDF CV.
- Render the profile photo from profile asset metadata when provided.
- Render well on mobile, tablet, and desktop.
- Be accessible with semantic headings, keyboard-friendly links, and sufficient color contrast.
- Avoid hardcoded CV content in UI components.

The first version may be a single-page website. Additional routes can be added later if the content grows.

## PDF Requirements

The PDF generator should:

- Read the same parsed profile data as the website.
- Generate a CV PDF with a clean print layout.
- Render the profile photo from profile asset metadata when provided and when the PDF layout supports it.
- Output the generated PDF into a public or build artifact directory.
- Use a stable filename from frontmatter or a sensible default.
- Be reproducible through a package script.

Expected command:

```bash
npm run generate:pdf
```

Expected output example:

```text
public/Damian_Sinczak_CV.pdf
```

The PDF layout may omit website-only visual elements. It should prioritize readability, print behavior, and concise professional presentation.

The first PDF implementation should include:

- name, title, location, email, phone, and links when present
- profile photo when present and supported by the template
- Bio
- Experience
- Skills
- Publications
- Education
- Languages

The PDF should exclude `target: web` content and should ignore collapsed/expanded state.

## Validation Requirements

The project should provide validation for the Markdown source.

Expected command:

```bash
npm run validate:profile
```

Validation should check:

- required frontmatter fields are present
- unsupported top-level sections are reported
- required fields inside structured entries are present where applicable
- referenced local assets exist
- referenced local assets are inside the project workspace
- image asset metadata has usable `src` and `alt` values where required
- links are valid URLs where possible
- skill levels are numeric and between `0` and `100`
- detail blocks have valid opening and closing markers
- metadata comments have valid keys and values
- generated PDF filename is valid

Validation errors should be written for the person editing the Markdown file, not only for developers.

## Build Workflow

Expected development commands:

```bash
npm run dev
npm run build
npm run validate:profile
npm run generate:pdf
```

Recommended build behavior:

- `npm run build` should validate `content/profile.md`.
- `npm run build` should parse the profile once and use the parsed model for static website generation.
- `npm run build` should copy/process referenced website assets.
- PDF generation may run separately at first.
- Later, the production build can generate or verify the PDF automatically.

Expected generated outputs:

```text
dist/
  index.html
  assets/
    profile/
      profile_pic.[hash].jpg
      banner.[hash].jpeg

public/
  Damian_Sinczak_CV.pdf
```

Exact asset filenames may differ if the chosen framework fingerprints assets.

## First Implementation Acceptance Criteria

The first implementation is complete when:

- `content/profile.md` parses into a typed profile model.
- `npm run validate:profile` reports actionable errors and warnings.
- `npm run build` generates a static single-page website from the parsed profile.
- The website renders profile photo, banner, top navigation, profile header, and content sections.
- Website-only detail blocks are available on the website and excluded from the PDF model.
- Collapsed detail blocks are collapsed by default on the website.
- The top navigation contains only sections rendered on the website.
- `npm run generate:pdf` produces a PDF from the same parsed profile.
- The generated PDF excludes `target: web` content.
- At least parser unit tests cover frontmatter, metadata comments, detail blocks, filtering, assets, and validation failures.

## Suggested Project Structure

```text
content/
  profile.md
  profile_pic.jpg
  banner.jpeg

public/
  Damian_Sinczak_CV.pdf

docs/
  content-driven-cv-site-spec.md
  profile-md-example.md
  web-page-design-spec.md

src/
  content/
    parseProfile.ts
    profileSchema.ts
    profileTypes.ts

  components/
    BioSection.tsx
    ExperienceSection.tsx
    ProjectsSection.tsx
    SkillsSection.tsx

scripts/
  generate-pdf.ts
  validate-profile.ts
```

The exact structure can follow the framework chosen for the website, but the content parser should remain shared between web rendering and PDF generation.

## Open Decisions

- Should the Markdown file support multiple languages from the start?
- Should there be one Markdown file for all content or separate Markdown files imported into one profile model?

## Recommended Initial Approach

Start with one structured Markdown file and a strict parser. Build the website and PDF generator around the same typed profile model. Keep the first version single-page unless there is a clear reason to split routes.

This approach keeps editing simple while still making future automation, validation, redesigns, and PDF generation predictable.

