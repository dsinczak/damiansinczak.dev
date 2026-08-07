import { parseProfileFile } from "../src/core/parser/parseProfile";
import { validateProfile } from "../src/core/validation/validateProfile";

const result = parseProfileFile("content/profile.md");
const messages = [...result.errors, ...result.warnings];

if (result.profile) {
  messages.push(...validateProfile(result.profile));
}

for (const message of messages) {
  const location = message.location ? `${message.location.file}:${message.location.line} ` : "";
  const context = message.context ? `${message.context}: ` : "";
  console.log(`${message.severity.toUpperCase()} ${location}${context}${message.message}`);
}

if (messages.some((message) => message.severity === "error")) {
  process.exit(1);
}

console.log("Profile validation passed.");
