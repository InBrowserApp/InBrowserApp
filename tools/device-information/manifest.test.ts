import { expect, test } from "vitest"

import { tool } from "./manifest"

test("exports the expected tool manifest", () => {
  expect(tool.category).toBe("misc")
  expect(tool.icon).toBe("wrench")
  expect(tool.tags).toContain("device")
})
