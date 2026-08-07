import { prepareProfileAssets } from "../src/core/assets/prepareAssets";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { validateProfile } from "../src/core/validation/validateProfile";

const parsed = parseProfileFile("content/profile.md");

if (!parsed.profile || parsed.errors.length > 0) {
  for (const message of parsed.errors) console.error(message.message);
  process.exit(1);
}

const validationErrors = validateProfile(parsed.profile).filter((message) => message.severity === "error");
if (validationErrors.length > 0) {
  for (const message of validationErrors) console.error(message.message);
  process.exit(1);
}

prepareProfileAssets(parsed.profile);
console.log("Prepared profile assets.");
