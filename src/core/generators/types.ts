import type { AssetManifest } from "../assets/prepareAssets";
import type { Profile, ValidationMessage } from "../model/profile";

export type GeneratorTarget = "web" | "pdf" | string;

export type GeneratedFile = {
  path: string;
};

export type GeneratorContext = {
  profile: Profile;
  target: GeneratorTarget;
  sourcePath: string;
  outputDir: string;
  assets: AssetManifest;
  options: Record<string, unknown>;
};

export type GeneratorResult = {
  files: GeneratedFile[];
  warnings: ValidationMessage[];
};

export type ProfileGenerator = {
  name: string;
  target: GeneratorTarget;
  generate: (context: GeneratorContext) => Promise<GeneratorResult>;
};
