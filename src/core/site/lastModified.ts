import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Last-modified date (YYYY-MM-DD) for a tracked file.
 *
 * Reads the git commit date, not the filesystem mtime. Git does not store
 * mtimes, so a fresh clone or a CI checkout gives every file the checkout
 * timestamp — which would make `lastmod` in the sitemap claim the content
 * changed today, on every single clean build. Search engines that notice a
 * `lastmod` is lying start ignoring it altogether, so the lie is not free.
 *
 * Falls back to mtime when git is unavailable or the file is untracked, which
 * is the correct answer in those cases anyway.
 */
export function lastModified(relativePath: string): string {
  const absolutePath = path.resolve(relativePath);

  try {
    const committed = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", absolutePath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();

    // Empty output means the file is tracked-but-uncommitted or git is not a repo.
    if (committed) {
      // Uncommitted local edits are newer than the last commit; prefer mtime then,
      // so a local preview build does not advertise a stale date.
      const dirty = execFileSync("git", ["status", "--porcelain", "--", absolutePath], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
      }).trim();

      if (!dirty) return committed.slice(0, 10);
    }
  } catch {
    // git missing, not a repository, or the file is untracked: fall through.
  }

  return fs.statSync(absolutePath).mtime.toISOString().slice(0, 10);
}
