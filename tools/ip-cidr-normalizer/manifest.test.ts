import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("ip-cidr-normalizer manifest", () => {
  test("defines the network tool metadata", () => {
    expect(tool.category).toBe("network")
    expect(tool.icon).toBe("network")
    expect(tool.tags).toContain("cidr")
    expect(tool.tags).toContain("ipv6")
  })
})
