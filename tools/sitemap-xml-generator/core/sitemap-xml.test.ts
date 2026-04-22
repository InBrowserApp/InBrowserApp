import { describe, expect, test } from "vitest"

import { buildSitemapXml } from "./sitemap-xml"
import {
  DEFAULT_SITEMAP_GENERATOR_STATE,
  createPresetState,
  createSitemapEntryInput,
  createUrlEntryInput,
} from "./sitemap-state"

describe("buildSitemapXml", () => {
  test("builds a urlset and joins relative paths against the base URL", () => {
    const result = buildSitemapXml({
      ...DEFAULT_SITEMAP_GENERATOR_STATE,
      urlEntries: [
        createUrlEntryInput({
          loc: "/",
          lastmod: "2026-04-20",
          changefreq: "daily",
          priority: "1",
        }),
        createUrlEntryInput({
          loc: "https://docs.example.com/reference",
          priority: "0.4",
        }),
      ],
    })

    expect(result).toEqual({
      state: "success",
      entryCount: 2,
      xml: expect.stringContaining("<urlset"),
    })

    if (result.state !== "success") {
      throw new Error("expected sitemap xml")
    }

    expect(result.xml).toContain("<loc>https://example.com/</loc>")
    expect(result.xml).toContain(
      "<loc>https://docs.example.com/reference</loc>"
    )
    expect(result.xml).toContain("<priority>1.0</priority>")
    expect(result.xml).toContain("<priority>0.4</priority>")
  })

  test("escapes XML content in the generated document", () => {
    const result = buildSitemapXml({
      ...DEFAULT_SITEMAP_GENERATOR_STATE,
      urlEntries: [
        createUrlEntryInput({
          loc: "https://example.com/search?q=tea&sort=<new>",
          lastmod: '2026-04-20T08:30:00+00:00 "quoted"',
        }),
      ],
    })

    if (result.state !== "success") {
      throw new Error("expected sitemap xml")
    }

    expect(result.xml).toContain(
      "https://example.com/search?q=tea&amp;sort=&lt;new&gt;"
    )
    expect(result.xml).toContain("&quot;quoted&quot;")
  })

  test("returns an empty result when every row is blank", () => {
    expect(
      buildSitemapXml({
        ...DEFAULT_SITEMAP_GENERATOR_STATE,
        urlEntries: [createUrlEntryInput()],
      })
    ).toEqual({ state: "empty" })
  })

  test("reports an invalid base URL when relative entries cannot be joined", () => {
    expect(
      buildSitemapXml({
        ...DEFAULT_SITEMAP_GENERATOR_STATE,
        baseUrl: "not-a-url",
        urlEntries: [createUrlEntryInput({ loc: "/pricing" })],
      })
    ).toEqual({
      state: "error",
      errorCode: "invalid-base-url",
      index: 0,
    })
  })

  test("reports an invalid location when auto join is disabled", () => {
    expect(
      buildSitemapXml({
        ...DEFAULT_SITEMAP_GENERATOR_STATE,
        autoJoin: false,
        urlEntries: [createUrlEntryInput({ loc: "/pricing" })],
      })
    ).toEqual({
      state: "error",
      errorCode: "invalid-url-location",
      index: 0,
    })
  })

  test("reports an invalid location when a URL cannot be parsed", () => {
    expect(
      buildSitemapXml({
        ...DEFAULT_SITEMAP_GENERATOR_STATE,
        urlEntries: [createUrlEntryInput({ loc: "http://[" })],
      })
    ).toEqual({
      state: "error",
      errorCode: "invalid-url-location",
      index: 0,
    })
  })

  test("reports invalid priorities outside the sitemap range", () => {
    expect(
      buildSitemapXml({
        ...DEFAULT_SITEMAP_GENERATOR_STATE,
        urlEntries: [createUrlEntryInput({ loc: "/", priority: "1.2" })],
      })
    ).toEqual({
      state: "error",
      errorCode: "invalid-priority",
      index: 0,
    })
  })

  test("reports invalid priorities that are not finite numbers", () => {
    expect(
      buildSitemapXml({
        ...DEFAULT_SITEMAP_GENERATOR_STATE,
        urlEntries: [createUrlEntryInput({ loc: "/", priority: "Infinity" })],
      })
    ).toEqual({
      state: "error",
      errorCode: "invalid-priority",
      index: 0,
    })
  })

  test("builds a sitemap index", () => {
    const result = buildSitemapXml({
      ...createPresetState("index"),
      autoJoin: false,
      sitemapEntries: [
        createSitemapEntryInput({
          loc: "https://example.com/sitemaps/pages.xml",
        }),
        createSitemapEntryInput(),
      ],
    })

    expect(result).toEqual({
      state: "success",
      entryCount: 1,
      xml: expect.stringContaining("<sitemapindex"),
    })

    if (result.state !== "success") {
      throw new Error("expected sitemap xml")
    }

    expect(result.xml).not.toContain("<lastmod>")
  })

  test("includes sitemap index lastmod values when provided", () => {
    const result = buildSitemapXml({
      ...createPresetState("index"),
      autoJoin: false,
      sitemapEntries: [
        createSitemapEntryInput({
          loc: "https://example.com/sitemaps/pages.xml",
          lastmod: "2026-04-20",
        }),
      ],
    })

    if (result.state !== "success") {
      throw new Error("expected sitemap xml")
    }

    expect(result.xml).toContain("<lastmod>2026-04-20</lastmod>")
  })

  test("reports invalid sitemap index locations", () => {
    expect(
      buildSitemapXml({
        ...createPresetState("index"),
        autoJoin: false,
        sitemapEntries: [createSitemapEntryInput({ loc: "/sitemap.xml" })],
      })
    ).toEqual({
      state: "error",
      errorCode: "invalid-sitemap-location",
      index: 0,
    })
  })

  test("reports an invalid base URL for sitemap index joins", () => {
    expect(
      buildSitemapXml({
        ...createPresetState("index"),
        baseUrl: "",
        sitemapEntries: [createSitemapEntryInput({ loc: "/sitemap.xml" })],
      })
    ).toEqual({
      state: "error",
      errorCode: "invalid-base-url",
      index: 0,
    })
  })

  test("returns an empty result when every sitemap index row is blank", () => {
    expect(
      buildSitemapXml({
        ...createPresetState("index"),
        sitemapEntries: [createSitemapEntryInput()],
      })
    ).toEqual({ state: "empty" })
  })
})

describe("createPresetState", () => {
  test("creates the supported presets", () => {
    expect(createPresetState("standard").mode).toBe("urlset")
    expect(createPresetState("content").urlEntries).toHaveLength(3)
    expect(createPresetState("index").mode).toBe("sitemapindex")
  })
})
