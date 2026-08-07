import { describe, expect, it } from "vitest";
import { parseProfileSource } from "../parser/parseProfile";
import { validateProfile } from "./validateProfile";

describe("validateProfile", () => {
  it("rejects non-numeric skill levels", () => {
    const result = parseProfileSource(`---
name: Test Person
title: Engineer
---

# Skills

## TypeScript
Level: TBD
`, "sample.md");

    const messages = validateProfile(result.profile!);

    expect(messages.map((message) => message.message)).toContain("Skill Level must be an integer from 0 to 100");
  });
});
