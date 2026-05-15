import { describe, expect, it } from "vitest"

import {
  HASH_TOOL_GROUPS,
  HASH_TOOLS,
  countHashToolsByGroup,
  filterHashTools,
  getHashToolHref,
  groupHashTools,
  isHashToolGroupFilter,
  normalizeSearchQuery,
} from "./hash-tools"

describe("hash tools core", () => {
  it("tracks every migrated hash leaf tool except the collection itself", () => {
    expect(HASH_TOOLS).toHaveLength(46)
    expect(HASH_TOOLS.map((tool) => tool.slug)).not.toContain("hash-tools")
    expect(new Set(HASH_TOOLS.map((tool) => tool.slug)).size).toBe(
      HASH_TOOLS.length
    )
  })

  it("normalizes search text", () => {
    expect(normalizeSearchQuery("  SHA-256  ")).toBe("sha-256")
  })

  it("filters by all query terms across labels, slugs, groups, kinds, and tags", () => {
    const results = filterHashTools(HASH_TOOLS, {
      query: "128 murmur",
      group: "all",
    })

    expect(results.map((tool) => tool.slug)).toEqual([
      "murmurhash3-x64-128-hash-text-or-file",
      "murmurhash3-x86-128-hash-text-or-file",
    ])
  })

  it("filters by group before applying the query", () => {
    const results = filterHashTools(HASH_TOOLS, {
      query: "sip",
      group: "keyed",
    })

    expect(results.map((tool) => tool.slug)).toEqual([
      "siphash-2-4-hash-text-or-file",
      "siphash-128-2-4-hash-text-or-file",
    ])
  })

  it("returns all group tools when the query is empty", () => {
    const checksumTools = filterHashTools(HASH_TOOLS, {
      query: " ",
      group: "checksum",
    })

    expect(checksumTools).toHaveLength(10)
    expect(checksumTools.every((tool) => tool.group === "checksum")).toBe(true)
  })

  it("groups filtered tools in display order and omits empty groups", () => {
    const grouped = groupHashTools(
      filterHashTools(HASH_TOOLS, {
        query: "bcrypt",
        group: "all",
      })
    )

    expect(grouped).toEqual([
      {
        group: "password",
        tools: [
          expect.objectContaining({ slug: "bcrypt-hash-password" }),
          expect.objectContaining({ slug: "bcrypt-hash-password-verifier" }),
        ],
      },
    ])
  })

  it("counts tools by group", () => {
    expect(countHashToolsByGroup(HASH_TOOLS)).toEqual({
      cryptographic: 25,
      password: 6,
      keyed: 5,
      checksum: 10,
    })
  })

  it("validates filter ids", () => {
    expect(isHashToolGroupFilter("all")).toBe(true)
    expect(
      HASH_TOOL_GROUPS.every((group) => isHashToolGroupFilter(group.id))
    ).toBe(true)
    expect(isHashToolGroupFilter("missing")).toBe(false)
  })

  it("builds localized tool links", () => {
    expect(getHashToolHref("sha256-hash-text-or-file", "en")).toBe(
      "/tools/sha256-hash-text-or-file"
    )
    expect(getHashToolHref("sha256-hash-text-or-file", "fr")).toBe(
      "/fr/tools/sha256-hash-text-or-file"
    )
  })
})
