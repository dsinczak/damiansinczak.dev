# damiansinczak.dev

Personal CV website generated from one Markdown source.

The project keeps profile content in `content/profile.md` and uses it to generate both:

- a static personal web page
- a PDF CV

The goal is to keep professional content in one place and avoid duplicating biography, experience, skills, publications, and contact details across web components and PDF templates.

## Tech Stack

- **Astro** for the static website.
  Astro fits this project because the page is content-driven, mostly static, and should ship with minimal client-side JavaScript.

- **TypeScript** for the parser, validation, build scripts, and shared model.
  The Markdown profile is structured enough that a typed internal model makes validation and future generators safer.

- **gray-matter** for YAML frontmatter.
  Frontmatter stores metadata such as name, contact information, assets, links, and PDF options.

- **marked** plus **sanitize-html** for Markdown-to-HTML rendering.
  Markdown remains the authoring format, while generated HTML is sanitized before rendering.

- **pdfkit** for PDF generation.
  The PDF is generated from the parsed profile model, not from a screenshot of the website.

- **Vitest** for parser and validation tests.

## Architecture

The project is built around a simple content pipeline:

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
target filtering
        |
        +--> web generator
        +--> PDF generator
```

Important rules:

- `content/profile.md` is the source of truth.
- Renderers consume the parsed `Profile` model, not raw Markdown.
- Visibility rules such as `target: web`, `target: pdf`, and `target: all` are handled centrally.
- Web-only UI assets live under `src/assets/web`.
- Profile content assets, such as the profile photo and banner, live under `content/`.

Main folders:

```text
content/
  profile.md
  profile_pic.jpg
  banner.jpeg

src/core/
  parser/
  validation/
  filtering/
  assets/
  model/

src/pages/
  index.astro

scripts/
  build.ts
  generate-pdf.ts
  prepare-assets.ts
  validate-profile.ts
```

## Usage

Install dependencies:

```powershell
npm.cmd install
```

Validate the profile Markdown:

```powershell
npm.cmd run validate:profile
```

Run tests:

```powershell
npm.cmd test
```

Generate the PDF only:

```powershell
npm.cmd run generate:pdf
```

Build the static website and PDF:

```powershell
npm.cmd run build
```

Run the local development server:

```powershell
npm.cmd run dev
```

The generated website is written to `dist/`. The generated PDF is written to `public/` first and copied into `dist/` during the Astro build.

## Content

Edit profile data in:

```text
content/profile.md
```

The Markdown file supports metadata for output targeting, for example:

```md
:::detail target="web" web="collapsed"
Longer website-only description.
:::
```

This keeps the PDF concise while allowing the website to show richer expandable details.

