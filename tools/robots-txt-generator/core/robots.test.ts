import { afterEach, describe, expect, test, vi } from "vitest"

import {
  AI_CRAWLER_USER_AGENTS,
  SEARCH_ENGINE_USER_AGENTS,
  appendUniqueUserAgents,
  applyPreset,
  buildRobotsTxt,
  createDefaultState,
  createGroup,
} from "./robots"

describe("robots core", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test("creates the default state", () => {
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

  test("builds robots.txt with advanced directives and trimmed values", () => {
    const content = buildRobotsTxt({
      advanced: true,
      host: " example.com ",
      sitemaps: [" https://example.com/sitemap.xml ", "   "],
      groups: [
        {
          id: "group-1",
          userAgents: [" GPTBot ", " "],
          rules: [
            { type: "allow", path: " /public/ " },
            { type: "disallow", path: " /private/ " },
            { type: "disallow", path: "   " },
          ],
          crawlDelay: 1.5,
        },
      ],
    })

    expect(content).toBe(
      [
        "Host: example.com",
        "User-agent: GPTBot\nAllow: /public/\nDisallow: /private/\nCrawl-delay: 1.5",
        "Sitemap: https://example.com/sitemap.xml",
      ].join("\n\n")
    )
  })

  test("falls back to wildcard user agent and omits empty sections", () => {
    const content = buildRobotsTxt({
      advanced: false,
      host: "example.com",
      sitemaps: [],
      groups: [
        {
          id: "group-1",
          userAgents: ["  ", ""],
          rules: [],
          crawlDelay: 2,
        },
      ],
    })

    expect(content).toBe("User-agent: *")
  })

  test("returns an empty file when every section is blank", () => {
    const content = buildRobotsTxt({
      advanced: true,
      host: "   ",
      sitemaps: ["   "],
      groups: [],
    })

    expect(content).toBe("")
  })

  test("creates a fallback id when crypto.randomUUID is unavailable", () => {
    vi.stubGlobal("crypto", undefined)

    const group = createGroup()

    expect(group.id).toMatch(/^\d+-[0-9a-f]+$/)
  })

  test("applies presets without touching site settings", () => {
    const baseState = {
      ...createDefaultState(),
      advanced: true,
      host: "example.com",
      sitemaps: ["https://example.com/sitemap.xml"],
    }

    expect(applyPreset(baseState, "allowAll").groups[0]?.rules).toEqual([])
    expect(applyPreset(baseState, "disallowAll").groups[0]?.rules).toEqual([
      { type: "disallow", path: "/" },
    ])
    expect(applyPreset(baseState, "blockAdmin").groups[0]?.rules).toEqual([
      { type: "disallow", path: "/admin/" },
    ])
    expect(applyPreset(baseState, "blockAdmin").host).toBe("example.com")
  })

  test("appends unique user agents and replaces a wildcard-only list", () => {
    expect(appendUniqueUserAgents(["*"], SEARCH_ENGINE_USER_AGENTS)).toEqual([
      ...SEARCH_ENGINE_USER_AGENTS,
    ])

    expect(appendUniqueUserAgents(["Googlebot"], [" ", "\n"])).toEqual([
      "Googlebot",
    ])

    expect(appendUniqueUserAgents([" * "], [" GPTBot ", "ClaudeBot"])).toEqual([
      "GPTBot",
      "ClaudeBot",
    ])

    expect(
      appendUniqueUserAgents(["Googlebot"], ["googlebot", "GPTBot", "  "])
    ).toEqual(["Googlebot", "GPTBot"])

    expect(appendUniqueUserAgents(["GPTBot"], AI_CRAWLER_USER_AGENTS)).toEqual([
      "GPTBot",
      "ChatGPT-User",
      "OAI-SearchBot",
      "ClaudeBot",
      "Claude-Web",
      "PerplexityBot",
      "CCBot",
      "Google-Extended",
      "Applebot-Extended",
    ])
  })
})
