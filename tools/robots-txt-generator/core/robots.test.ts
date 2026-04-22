import { describe, expect, test } from "vitest"

import {
  applyUserAgentPreset,
  buildRobotsTxt,
  createDefaultState,
  createGroup,
  getMatchingPreset,
  getPresetGroups,
  mergeUniqueEntries,
  parseLineList,
  serializeLineList,
} from "./robots"

describe("robots core helpers", () => {
  test("creates a default state", () => {
    const state = createDefaultState()

    expect(state.advanced).toBe(false)
    expect(state.host).toBe("")
    expect(state.sitemaps).toEqual(["https://example.com/sitemap.xml"])
    expect(state.groups).toHaveLength(1)
    expect(state.groups[0]?.userAgents).toEqual(["*"])
    expect(state.groups[0]?.rules).toEqual([
      { type: "disallow", path: "/admin/" },
    ])
  })

  test("creates groups with overrides and unique ids", () => {
    const first = createGroup({ userAgents: ["Googlebot"] })
    const second = createGroup()

    expect(first.userAgents).toEqual(["Googlebot"])
    expect(first.id).not.toBe(second.id)
  })

  test("parses and serializes line lists", () => {
    const lines = parseLineList("  one\n\n two \n")

    expect(lines).toEqual(["one", "two"])
    expect(serializeLineList(lines)).toBe("one\ntwo")
  })

  test("merges unique entries case-insensitively", () => {
    expect(mergeUniqueEntries(["Googlebot"], ["googlebot", "Bingbot"])).toEqual(
      ["Googlebot", "Bingbot"]
    )
  })

  test("applies user-agent presets by replacing wildcard-only groups", () => {
    expect(applyUserAgentPreset(["*"], ["Googlebot", "Bingbot"])).toEqual([
      "Googlebot",
      "Bingbot",
    ])
  })

  test("applies user-agent presets by merging with existing agents", () => {
    expect(
      applyUserAgentPreset(["Googlebot"], ["googlebot", "GPTBot"])
    ).toEqual(["Googlebot", "GPTBot"])
    expect(applyUserAgentPreset(["Googlebot"], ["", "   "])).toEqual([
      "Googlebot",
    ])
  })

  test("creates preset groups", () => {
    expect(getPresetGroups("allowAll")[0]?.rules).toEqual([])
    expect(getPresetGroups("disallowAll")[0]?.rules).toEqual([
      { type: "disallow", path: "/" },
    ])
    expect(getPresetGroups("blockAdmin")[0]?.rules).toEqual([
      { type: "disallow", path: "/admin/" },
    ])
  })

  test("matches presets from normalized groups", () => {
    expect(getMatchingPreset(getPresetGroups("allowAll"))).toBe("allowAll")
    expect(
      getMatchingPreset([
        {
          id: "group-a",
          userAgents: [],
          rules: [{ type: "disallow", path: " /admin/ " }],
          crawlDelay: 10,
        },
      ])
    ).toBe("blockAdmin")
    expect(
      getMatchingPreset([
        {
          id: "group-b",
          userAgents: ["Googlebot"],
          rules: [],
          crawlDelay: null,
        },
      ])
    ).toBeNull()
    expect(
      getMatchingPreset([
        {
          id: "group-c",
          userAgents: ["*"],
          rules: [],
          crawlDelay: null,
        },
        {
          id: "group-d",
          userAgents: ["Googlebot"],
          rules: [],
          crawlDelay: null,
        },
      ])
    ).toBeNull()
  })

  test("builds robots.txt from the default state", () => {
    expect(buildRobotsTxt(createDefaultState())).toBe(
      [
        "User-agent: *",
        "Disallow: /admin/",
        "",
        "Sitemap: https://example.com/sitemap.xml",
      ].join("\n")
    )
  })

  test("builds advanced robots.txt and ignores invalid values", () => {
    const output = buildRobotsTxt({
      advanced: true,
      host: " example.com ",
      sitemaps: [
        "https://example.com/sitemap.xml",
        "   ",
        "https://example.com/news.xml",
      ],
      groups: [
        {
          id: "group-a",
          userAgents: [],
          rules: [
            { type: "allow", path: " /public/ " },
            { type: "disallow", path: "   " },
          ],
          crawlDelay: 5,
        },
        {
          id: "group-b",
          userAgents: ["Googlebot"],
          rules: [],
          crawlDelay: Number.NaN,
        },
        {
          id: "group-c",
          userAgents: ["Bingbot"],
          rules: [],
          crawlDelay: -1,
        },
      ],
    })

    expect(output).toBe(
      [
        "Host: example.com",
        "",
        "User-agent: *",
        "Allow: /public/",
        "Crawl-delay: 5",
        "",
        "User-agent: Googlebot",
        "",
        "User-agent: Bingbot",
        "",
        "Sitemap: https://example.com/sitemap.xml",
        "Sitemap: https://example.com/news.xml",
      ].join("\n")
    )
  })

  test("returns an empty string when no sections are present", () => {
    expect(
      buildRobotsTxt({
        advanced: true,
        host: "   ",
        groups: [],
        sitemaps: [],
      })
    ).toBe("")
  })
})
