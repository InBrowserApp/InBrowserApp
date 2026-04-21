import { expect, test } from "vitest"

import { tool } from "./manifest"

test("exports the expected tool manifest", () => {
  expect(tool.category).toBe("network")
  expect(tool.icon).toBe("network")
  expect(tool.tags).toContain("webrtc")
})
