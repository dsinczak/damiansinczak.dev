# Damian Sińczak CV Site

> This project was fully vibecoded.

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

Generate only the share card and favicon set:

```sh
npm run generate:images
```

Build the full release output:

```sh
npm run build
```

The release build validates the profile, generates the PDF, renders the share card
and favicons, copies web assets, writes `sitemap.xml`, `llms.txt`, `llms-full.txt`
and `security.txt`, and creates the static site in `dist/`.

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

## Discoverability

Everything a search engine, a social card renderer or an AI crawler sees is derived
from `content/profile.md` at build time. There is no second copy of the CV in a
template to keep in sync.

### What the build produces

| Artefact | Source | Purpose |
| --- | --- | --- |
| `<head>` meta, Open Graph, Twitter card | `src/components/Seo.astro` | Title, description, share card. Fixes the blank grey box on LinkedIn. |
| JSON-LD `Person` + `ProfilePage` | `src/core/seo/jsonLd.ts` | Lets search engines treat the profile as an entity rather than a string. `sameAs` links it to the LinkedIn and GitHub accounts they already know. |
| `og-image.png` (1200×630) | `scripts/generate-images.ts` | Share card, rendered from the profile with Satori. Regenerated on every build, so it cannot go stale. |
| `favicon.*`, `icon-*.png`, `apple-touch-icon.png` | `src/assets/web/ds-mark.svg` | Icon set, rasterised from the one monogram. |
| `llms.txt`, `llms-full.txt` | `src/core/seo/llms.ts` | Curated Markdown mirror for LLM crawlers. |
| `sitemap.xml` | `scripts/prepare-assets.ts` | `lastmod` comes from the git commit date of `content/profile.md`, not the file mtime, which git does not preserve. |
| `.well-known/security.txt` | `scripts/prepare-assets.ts` | Regenerated because RFC 9116 requires a non-expired `Expires` field. |
| `robots.txt` | committed in `public/` | Crawler policy. Kept in git rather than generated, because it is a decision that should show up in a diff. |

### Tuning what search engines show

Override the derived values with an optional `seo:` block in the frontmatter of
`content/profile.md`. Every field is optional and falls back to something sensible:

```yaml
seo:
  jobTitle: Senior Software Engineer & Architect   # <title>, og:title, Person.jobTitle
  description: Under ~155 characters.              # <meta name="description">
  pageTitle: Full override for <title>
  sameAs: [https://example.com/profile]            # extra Person.sameAs URLs
  knowsAbout: [Software architecture]              # merged ahead of the Skills section
```

Without a `seo:` block the build derives `jobTitle` from the Experience entry whose
`Period` ends in "Present", and `description` from `headlineInfo`.

### AI crawler policy

`public/robots.txt` allows every named AI crawler — search bots, answer engines and
training crawlers alike — because the point of a public CV is to be found, including
by the models people now ask instead of a search engine. Each agent is listed
explicitly so the stance is a decision on record; flipping one to `Disallow: /` is a
one-line change.

Two tokens are easy to miss: `Google-Extended` governs Gemini and AI Overviews
independently of `Googlebot`, and `Applebot-Extended` does the same for Apple
Intelligence. Allowing the crawler does not allow the AI use.

### Manual steps, once

These cannot be done from the repository:

1. **Google Search Console** — add `https://www.damiansinczak.dev` as a *Domain*
   property and verify with the DNS TXT record OVH gives you. Use DNS rather than the
   HTML-file or meta-tag method: the site sends `script-src 'none'`, and DNS
   verification avoids touching the CSP at all. Then submit
   `https://www.damiansinczak.dev/sitemap.xml`.
2. **Bing Webmaster Tools** — import the Search Console property rather than
   re-verifying from scratch.
3. **Validate the structured data** once after the first deploy:
   - <https://validator.schema.org/> — schema correctness
   - <https://search.google.com/test/rich-results> — what Google actually parses
4. **Check the share card** with the
   [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/). LinkedIn
   caches Open Graph data aggressively; the inspector is how you force a refetch
   after changing the headline.

## Deploy To OVH Shared Hosting

The build is fully static, so deployment is a file copy. Everything the server
needs is inside `dist/` after `npm run build`, including `.htaccess`.

Canonical address is `https://www.damiansinczak.dev`, declared once in
[src/core/site/config.ts](src/core/site/config.ts). `astro.config.mjs` and the
sitemap generator import it. `public/.htaccess` cannot import TypeScript, so a test
in `src/core/site/config.test.ts` asserts its redirect rules still agree with
`siteConfig.host` — a domain change that misses that file fails the build.

### One-time setup in the OVH control panel

1. **Web Cloud → Hosting plans → your hosting → Multisite.** Point both
   `damiansinczak.dev` and `www.damiansinczak.dev` at the same folder, `www`.
   Without the apex entry the `.htaccess` redirect never runs, because the
   request does not reach your hosting at all.
2. **SSL certificates.** Request the free Let's Encrypt certificate and wait
   until it covers both names. Issuance can take up to an hour.
3. **FTP-SSH.** Note the SFTP host, user and password. Prefer SFTP on port 22
   over plain FTP; OVH supports both, and FTP sends the password in clear text.

### Every release

```sh
npm run build
```

Upload the **contents** of `dist/` into the document root. On OVH shared hosting
the FTP root is *not* the document root; `www/` is:

```text
/                    FTP root - leave alone
├── .htaccess        OVH's own file, not read for web requests
├── .ovhconfig       runtime settings (PHP version, engine)
├── cgi-bin/
└── www/             document root - deploy here
    ├── .htaccess    from dist/
    ├── .well-known/ security.txt
    ├── index.html   from dist/
    ├── robots.txt
    ├── sitemap.xml
    ├── llms.txt
    ├── llms-full.txt
    ├── og-image.png
    ├── site.webmanifest
    ├── favicon.ico  favicon.svg, icon-*.png, apple-touch-icon.png
    ├── Damian_Sinczak_CV.pdf
    ├── _astro/
    └── assets/
```

Two directories are easy to lose in an FTP client: `.well-known/` and `.htaccess`
both start with a dot and stay hidden until you enable "show hidden files".

Apache only reads `.htaccess` from the document root downwards, so the file at
the FTP root has no effect on the site. Do not overwrite it, and do not touch
`.ovhconfig`.

If the Multisite entry points the domain at a folder other than `www`, deploy
into that folder instead.

With FileZilla or Cyberduck: connect over SFTP, open `www/`, remove the previous
contents, drag everything from `dist/` across. Confirm that `.htaccess` came
with it — most FTP clients hide dotfiles until you enable "show hidden files".

### After the first upload

Verify in this order, because each step depends on the previous one:

```sh
curl -sI http://damiansinczak.dev        | head -n 3   # expect 301 -> https://www...
curl -sI https://damiansinczak.dev       | head -n 3   # expect 301 -> https://www...
curl -sI https://www.damiansinczak.dev   | head -n 3   # expect 200
curl -sI https://www.damiansinczak.dev/Damian_Sinczak_CV.pdf | head -n 3
```

Then check the crawler-facing surface, which is served by different rules:

```sh
curl -sI https://www.damiansinczak.dev/robots.txt      | grep -i 'content-type'  # text/plain; charset=UTF-8
curl -sI https://www.damiansinczak.dev/sitemap.xml     | head -n 1
curl -sI https://www.damiansinczak.dev/llms-full.txt   | grep -i 'content-type'
curl -sI https://www.damiansinczak.dev/og-image.png    | head -n 1               # LinkedIn must be able to fetch this
curl -sI https://www.damiansinczak.dev/site.webmanifest| head -n 1
curl -sI https://www.damiansinczak.dev/.well-known/security.txt | head -n 1
curl -s  https://www.damiansinczak.dev/llms-full.txt   | head -n 1               # expect "# Damian Sińczak", not mojibake
```

A missing `charset=UTF-8` on the `.txt` responses is the failure that turns every
Polish diacritic into mojibake for clients that trust the header over the bytes.

Once all four behave, the site is live. `public/.htaccess` sends HSTS with a
one-day `max-age` and no `includeSubDomains`, because the apex and `www` hold
separate Let's Encrypt certificates that renew independently. After a renewal
cycle has passed without incident, raise `max-age` to `31536000`.

HSTS instructs browsers to refuse plain HTTP for the whole `max-age` window, so
a broken certificate under a long policy locks visitors out until it expires.
That is why the value starts small.

## Repository Layout

```text
content/profile.md          Canonical CV/profile content
assets/fonts/               Fonts embedded into the PDF and the share card
public/.htaccess            Apache config shipped to OVH with the build
public/robots.txt           Crawler policy, including the AI-crawler stance
src/core/                   Parser, model, validation, filtering, asset preparation
src/core/site/config.ts     Canonical origin and site identity - single source of truth
src/core/seo/               Meta derivation, schema.org JSON-LD, llms.txt generation
src/components/Seo.astro    Document head: meta, Open Graph, favicons, JSON-LD
src/pages/index.astro       Static website renderer
scripts/generate-pdf.ts     PDF renderer
scripts/generate-images.ts  Share card and favicon set
scripts/prepare-assets.ts   Profile images, sitemap, llms.txt, security.txt
scripts/build.ts            Full build orchestration
docs/                       Content and web design specifications
```

Generated files are intentionally ignored by Git: everything under `dist/`, profile
assets under `public/assets/profile/`, the PDF, and the derived discoverability
artefacts (`sitemap.xml`, `llms*.txt`, `og-image.png`, the favicon set,
`.well-known/`). Committing them would let them drift from the content they are
derived from.
