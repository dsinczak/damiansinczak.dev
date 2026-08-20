import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { buildSeoMeta } from "../src/core/seo/meta";
import { siteConfig } from "../src/core/site/config";

/**
 * Generates the social share card and the favicon set.
 *
 * Satori renders a flexbox layout straight to SVG with no browser involved, and
 * resvg rasterises it. That keeps the card in lockstep with content/profile.md:
 * change your headline and the next build produces a matching card, instead of
 * a hand-made PNG quietly going stale.
 */

// Matches src/styles/global.css :root
const palette = {
  accent: "#0a66c2",
  accentDark: "#004182",
  surface: "#ffffff",
  text: "#191919",
  muted: "#8ba9cc"
};

const publicDir = path.resolve("public");
const fontsDir = path.resolve("assets/fonts");

function font(file: string) {
  return fs.readFileSync(path.join(fontsDir, file));
}

/** Satori has no filesystem access, so images must be inlined. */
function dataUri(relativePath: string): string | undefined {
  const absolute = path.resolve(relativePath);
  if (!fs.existsSync(absolute)) return undefined;

  const mime = path.extname(absolute).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(absolute).toString("base64")}`;
}

async function main() {
  const parsed = parseProfileFile("content/profile.md");
  if (!parsed.profile) {
    for (const message of parsed.errors) console.error(message.message);
    process.exit(1);
  }

  const profile = parsed.profile;
  const meta = buildSeoMeta(profile);
  const photo = profile.assets?.photo?.src ? dataUri(profile.assets.photo.src) : undefined;

  await writeOgImage(profile.name, meta.jobTitle ?? profile.title, profile.title, profile.location, photo);
  writeFavicons();

  console.log("Generated og-image.png and favicon set.");
}

async function writeOgImage(
  name: string,
  jobTitle: string,
  tagline: string,
  location: string | undefined,
  photo: string | undefined
) {
  const { width, height } = siteConfig.ogImage;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: palette.accentDark,
          backgroundImage: `linear-gradient(135deg, ${palette.accentDark} 0%, ${palette.accent} 100%)`,
          fontFamily: "Open Sans"
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: "40px" },
              children: [
                photo
                  ? {
                      type: "img",
                      props: {
                        src: photo,
                        width: 180,
                        height: 180,
                        style: {
                          borderRadius: "90px",
                          border: `6px solid ${palette.surface}`,
                          objectFit: "cover"
                        }
                      }
                    }
                  : null,
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 68,
                            fontFamily: "Archivo Black",
                            color: palette.surface,
                            lineHeight: 1.1
                          },
                          children: name
                        }
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: 34, color: palette.surface, opacity: 0.92, marginTop: 12 },
                          children: jobTitle
                        }
                      }
                    ]
                  }
                }
              ].filter(Boolean)
            }
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: 30,
                color: palette.surface,
                opacity: 0.88,
                lineHeight: 1.35,
                maxWidth: 940
              },
              children: tagline
            }
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: `2px solid rgba(255,255,255,0.25)`,
                paddingTop: 28,
                fontSize: 26,
                color: palette.muted
              },
              children: [
                { type: "div", props: { children: siteConfig.host } },
                { type: "div", props: { children: location ?? "" } }
              ]
            }
          }
        ]
      }
    },
    {
      width,
      height,
      fonts: [
        { name: "Open Sans", data: font("OpenSans-Regular.ttf"), weight: 400, style: "normal" },
        { name: "Open Sans", data: font("OpenSans-SemiBold.ttf"), weight: 600, style: "normal" },
        { name: "Archivo Black", data: font("ArchivoBlack-Regular.ttf"), weight: 900, style: "normal" }
      ]
    }
  );

  fs.writeFileSync(path.join(publicDir, path.basename(siteConfig.ogImage.path)), renderPng(svg, width));
}

/**
 * The `ds` monogram already lives in src/assets/web/ds-mark.svg and was, until
 * now, imported by nothing at all. Rasterising it here gives the whole icon set
 * from one source of truth.
 */
function writeFavicons() {
  const markSvg = fs.readFileSync(path.resolve("src/assets/web/ds-mark.svg"), "utf8");

  fs.writeFileSync(path.join(publicDir, "favicon.svg"), markSvg, "utf8");

  const sizes: Array<[string, number]> = [
    ["favicon-32.png", 32],
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512]
  ];

  for (const [file, size] of sizes) {
    fs.writeFileSync(path.join(publicDir, file), renderPng(markSvg, size));
  }

  // Crawlers and older browsers still request /favicon.ico by hard-coded path.
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoFromPng(renderPng(markSvg, 32), 32));
}

function renderPng(svg: string, width: number): Buffer {
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}

/**
 * Wrap a PNG in an ICO container. The ICO format has allowed a raw PNG payload
 * since Vista, so this is a 22-byte header rather than a bitmap encoder.
 */
function icoFromPng(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette size
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12); // payload offset

  return Buffer.concat([header, entry, png]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
