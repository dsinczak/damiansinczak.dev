import fs from "node:fs";
import path from "node:path";
import type { Profile, ProfileAsset } from "../model/profile";

export type AssetManifest = Record<string, ProfileAsset>;

export function prepareProfileAssets(profile: Profile, workspaceRoot = process.cwd()): Profile {
  const assets = profile.assets;

  return {
    ...profile,
    assets: assets
      ? {
          photo: assets.photo ? prepareAsset(assets.photo, workspaceRoot) : undefined,
          banner: assets.banner ? prepareAsset(assets.banner, workspaceRoot) : undefined
        }
      : undefined,
    sections: profile.sections.map((section) => ({
      ...section,
      entries: section.entries.map((entry) => ({
        ...entry,
        icon: entry.icon ? prepareAsset(entry.icon, workspaceRoot) : undefined
      }))
    }))
  };
}

function prepareAsset(asset: ProfileAsset, workspaceRoot: string): ProfileAsset {
  const sourcePath = path.resolve(workspaceRoot, asset.src);
  const outputDirectory = path.resolve(workspaceRoot, "public", "assets", "profile");
  const outputName = path.basename(asset.src);
  const outputPath = path.join(outputDirectory, outputName);
  const publicPath = `/assets/profile/${outputName.replaceAll("\\", "/")}`;

  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.copyFileSync(sourcePath, outputPath);

  return {
    ...asset,
    sourcePath,
    publicPath
  };
}
