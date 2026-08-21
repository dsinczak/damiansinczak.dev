import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { absoluteUrl, siteConfig } from "./config";

/**
 * Drift guards.
 *
 * `public/.htaccess` and `public/robots.txt` cannot import TypeScript, so they
 * are the two places where the canonical origin still has to be written out by
 * hand. These tests are what stops a domain change from being applied in three
 * files and forgotten in the fourth — which previously would have produced a
 * redirect loop or a sitemap nobody could find.
 */

function readPublic(name: string): string {
  return fs.readFileSync(path.resolve("public", name), "utf8");
}

describe("absoluteUrl", () => {
  it("resolves root-relative paths against the canonical origin", () => {
    expect(absoluteUrl("/og-image.png")).toBe("https://www.damiansinczak.dev/og-image.png");
  });

  it("is tolerant of a missing leading slash", () => {
    expect(absoluteUrl("llms.txt")).toBe("https://www.damiansinczak.dev/llms.txt");
  });
});

describe(".htaccess", () => {
  const htaccess = readPublic(".htaccess");

  it("redirects to the host declared in siteConfig", () => {
    const escapedHost = siteConfig.host.replace(/\./g, "\\.");

    expect(htaccess).toContain(`RewriteRule ^ ${siteConfig.url}%{REQUEST_URI} [R=301,L]`);
    expect(htaccess).toContain(`RewriteCond %{HTTP_HOST} !^${escapedHost}$ [NC]`);
  });

  it("answers 404 rather than 403 for directories with no index file", () => {
    // Options -Indexes makes Apache send 403 for a bare directory request.
    // Googlebot truncates URLs to probe parent paths, so /assets/ and /_astro/
    // would otherwise be reported in Search Console as access-forbidden errors.
    expect(htaccess).toContain("RewriteCond %{REQUEST_FILENAME} -d");
    expect(htaccess).toContain("RewriteCond %{REQUEST_FILENAME}/index.html !-f");
    expect(htaccess).toContain("RewriteRule ^ - [R=404,L]");
  });

  it("does not let the directory rule fire before the canonical host redirect", () => {
    // Both rules end in [L]. If the 404 came first, a request to the apex for a
    // directory path would 404 instead of redirecting to www.
    const hostRedirect = htaccess.indexOf("RewriteCond %{HTTP_HOST}");
    const directory404 = htaccess.indexOf("RewriteCond %{REQUEST_FILENAME} -d");

    expect(hostRedirect).toBeGreaterThan(-1);
    expect(directory404).toBeGreaterThan(hostRedirect);
  });

  it("grants manifest-src, which default-src 'none' does not imply", () => {
    // Without this the browser blocks /site.webmanifest outright.
    expect(htaccess).toMatch(/Content-Security-Policy "[^"]*manifest-src 'self'/);
  });

  it("still ships no JavaScript", () => {
    // The JSON-LD block is data, not code, so this property survives it.
    expect(htaccess).toMatch(/Content-Security-Policy "[^"]*script-src 'none'/);
  });

  it("declares a charset for .txt, so diacritics in llms-full.txt survive", () => {
    expect(htaccess).toMatch(/AddCharset UTF-8\s+.*\.txt/);
  });

  it("does not block the web app manifest, which is why it is not called manifest.json", () => {
    const lockout = htaccess.match(/<FilesMatch "\(\^\\\.\|([^"]+)\)">/);

    expect(lockout).not.toBeNull();
    expect(lockout![1]).toContain("json");
    expect(htaccess).toContain("site.webmanifest".slice(5)); // ".webmanifest" is served, not denied
  });
});

describe("robots.txt", () => {
  const robots = readPublic("robots.txt");

  it("advertises the sitemap at the canonical origin", () => {
    expect(robots).toContain(`Sitemap: ${siteConfig.url}/sitemap.xml`);
  });

  it("keeps the default open", () => {
    expect(robots).toMatch(/User-agent: \*\nAllow: \//);
  });

  it("takes an explicit position on every AI crawler it names", () => {
    // The value of naming them is that the stance is a decision on record.
    // If one is ever named without a directive, that is a bug, not a default.
    const directives = robots
      .split(/\r?\n/)
      .filter((line) => !line.trimStart().startsWith("#") && line.trim().length > 0);

    for (const [index, line] of directives.entries()) {
      if (!line.startsWith("User-agent:")) continue;
      expect(directives[index + 1] ?? "").toMatch(/^(Allow|Disallow):/);
    }
  });

  it("names the tokens that are separate from Googlebot and Applebot", () => {
    // Allowing Googlebot does not allow Gemini/AI Overviews; that is Google-Extended.
    expect(robots).toContain("User-agent: Google-Extended");
    expect(robots).toContain("User-agent: Applebot-Extended");
  });

  it("lets LinkedIn fetch the page, or every shared link renders as a grey box", () => {
    expect(robots).toContain("User-agent: LinkedInBot");
  });
});

describe("site.webmanifest", () => {
  it("is valid JSON with icons that the build actually produces", () => {
    const manifest = JSON.parse(readPublic("site.webmanifest")) as {
      icons: Array<{ src: string }>;
    };

    for (const icon of manifest.icons) {
      expect(fs.existsSync(path.resolve("public", icon.src.replace(/^\//, "")))).toBe(true);
    }
  });
});
