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

## Deploy To OVH Shared Hosting

The build is fully static, so deployment is a file copy. Everything the server
needs is inside `dist/` after `npm run build`, including `.htaccess`.

Canonical address is `https://www.damiansinczak.dev`. It is set in three places
that must stay in agreement: `astro.config.mjs` (`site`), `public/.htaccess`
(redirect target) and `scripts/prepare-assets.ts` (`SITE_URL`, used for the
sitemap).

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
    ├── index.html   from dist/
    ├── robots.txt
    ├── sitemap.xml
    ├── Damian_Sinczak_CV.pdf
    ├── _astro/
    └── assets/
```

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

Once all four behave, the site is live. `public/.htaccess` sends HSTS with a
one-day `max-age` and no `includeSubDomains`, because the apex and `www` hold
separate Let's Encrypt certificates that renew independently. After a renewal
cycle has passed without incident, raise `max-age` to `31536000`.

HSTS instructs browsers to refuse plain HTTP for the whole `max-age` window, so
a broken certificate under a long policy locks visitors out until it expires.
That is why the value starts small.



```text
content/profile.md       Canonical CV/profile content
assets/fonts/            Fonts embedded into the PDF (Open Sans, Archivo Black)
public/.htaccess         Apache config shipped to OVH with the build
src/core/                Parser, model, validation, filtering, asset preparation
src/pages/index.astro    Static website renderer
scripts/generate-pdf.ts  PDF renderer
scripts/build.ts         Full build orchestration
docs/                    Content and web design specifications
```

Generated files under `dist/`, profile assets under `public/assets/profile/`,
`public/sitemap.xml`, and PDFs under `public/` are intentionally ignored by Git.
