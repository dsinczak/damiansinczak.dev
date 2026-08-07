import { spawnSync } from "node:child_process";
import { parseProfileFile } from "../src/core/parser/parseProfile";
import { validateProfile } from "../src/core/validation/validateProfile";

const parsed = parseProfileFile("content/profile.md");
const messages = [...parsed.errors, ...(parsed.profile ? validateProfile(parsed.profile) : [])];

for (const message of [...messages, ...parsed.warnings]) {
  const location = message.location ? `${message.location.file}:${message.location.line} ` : "";
  const context = message.context ? `${message.context}: ` : "";
  console.log(`${message.severity.toUpperCase()} ${location}${context}${message.message}`);
}

if (messages.some((message) => message.severity === "error")) {
  process.exit(1);
}

const pdf = runNpmScript("generate:pdf");
if (pdf !== 0) process.exit(pdf);

const web = runNpmScript("build:web");
if (web !== 0) process.exit(web);

function runNpmScript(script: string): number {
  const command = process.platform === "win32" ? "cmd.exe" : "npm";
  const args = process.platform === "win32" ? ["/c", "npm.cmd", "run", script] : ["run", script];
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status ?? 1;
}
