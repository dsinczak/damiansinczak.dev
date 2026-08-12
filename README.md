# Damian Sińczak CV Site

A static personal website and PDF CV generated from one canonical Markdown profile:

```text
content/profile.md
```

The profile is parsed, validated, and filtered for either the website or PDF output. Do not duplicate CV content in page components or PDF scripts.

## Prerequisites

- Node.js 22 or later
- npm

Install dependencies once:

```sh
npm install
```

## Run The Website

Start the local Astro server:

```sh
npm run dev
```

This first copies the profile assets to `public/assets/profile/`, then starts Astro. The terminal prints the local URL, normally `http://localhost:4321`.

Stop the server with `Ctrl+C` in the terminal where it is running.

Restart it by running the same command again:

```sh
npm run dev
```

## Validate And Generate

Validate the profile structure, metadata, assets, URLs, and skill levels:

```sh
npm run validate:profile
```

Generate only the PDF CV:

```sh
npm run generate:pdf
```

The PDF is written to `public/<pdf.filename>`. Its name comes from the `pdf.filename` field in `content/profile.md`.

Build the full release output:

```sh
npm run build
```

The release build validates the profile, generates the PDF, copies required web assets, and creates the static site in `dist/`.

Run the automated tests:

```sh
npm test
```

## Edit Profile Content

Edit [content/profile.md](content/profile.md). Frontmatter holds identity, contacts, links, asset metadata, output defaults, and the PDF file name. The Markdown body holds profile sections and entries.

Supported top-level sections are `Bio`, `Experience`, `Projects`, `Skills`, `Education`, `Publications`, `Languages`, and `Interests`. Use `##` headings for repeated entries. Common entry fields include `Role`, `Period`, `Location`, `Category`, `Level`, `Tech`, and `Link`.

Control where a section, entry, or detail block appears with metadata comments:

```md
<!-- target: all; web: collapsed -->
```

- `target`: `all`, `web`, `pdf`, or `hidden`
- `web`: `none`, `collapsed`, or `expanded`

Use `:::detail` blocks for richer details. For example:

```md
:::detail target="web" web="collapsed"
Longer web-only context.
:::
```

See [docs/content-driven-cv-site-spec.md](docs/content-driven-cv-site-spec.md) for the full content contract and [docs/web-page-design-spec.md](docs/web-page-design-spec.md) for the site design requirements.

## Project Layout

```text
content/profile.md       Canonical CV/profile content
src/core/                Parser, model, validation, filtering, asset preparation
src/pages/index.astro    Static website renderer
scripts/generate-pdf.ts  PDF renderer
scripts/build.ts         Full build orchestration
docs/                    Content and web design specifications
```

Generated files under `dist/`, profile assets under `public/assets/profile/`, and PDFs under `public/` are intentionally ignored by Git.
