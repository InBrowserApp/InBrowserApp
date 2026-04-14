import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("prettier-code-formatter manifest", () => {
  test("declares searchable formatter metadata", () => {
    expect(tool.category).toBe("developer")
    expect(tool.icon).toBe("braces")
    expect(tool.tags).toContain("prettier")
    expect(tool.tags).toContain("formatter")
  })
})
