import { describe, expect, test } from "vitest"

import { addXDefaultHreflang } from "../apps/web/src/lib/sitemap-serialize"

type SitemapItem = Parameters<typeof addXDefaultHreflang>[0]

describe("addXDefaultHreflang", () => {
  test("appends x-default pointing to the default-locale variant", () => {
    const item: SitemapItem = {
      url: "https://inbrowser.app/zh-CN/tools/foo",
      links: [
        { url: "https://inbrowser.app/tools/foo", lang: "en" },
        { url: "https://inbrowser.app/zh-CN/tools/foo", lang: "zh-CN" },
      ],
    }

    const result = addXDefaultHreflang(item)

    expect(result.links).toEqual([
      { url: "https://inbrowser.app/tools/foo", lang: "en" },
      { url: "https://inbrowser.app/zh-CN/tools/foo", lang: "zh-CN" },
      { url: "https://inbrowser.app/tools/foo", lang: "x-default" },
    ])
  })

  test("returns the same item when no links are present", () => {
    const item: SitemapItem = {
      url: "https://inbrowser.app/standalone",
    }

    expect(addXDefaultHreflang(item)).toBe(item)
  })

  test("returns the same item when no default-locale variant exists", () => {
    const item: SitemapItem = {
      url: "https://inbrowser.app/zh-CN/tools/foo",
      links: [
        { url: "https://inbrowser.app/zh-CN/tools/foo", lang: "zh-CN" },
        { url: "https://inbrowser.app/ja/tools/foo", lang: "ja" },
      ],
    }

    expect(addXDefaultHreflang(item)).toBe(item)
  })

  test("is idempotent when x-default is already present", () => {
    const item: SitemapItem = {
      url: "https://inbrowser.app/tools/foo",
      links: [
        { url: "https://inbrowser.app/tools/foo", lang: "en" },
        { url: "https://inbrowser.app/tools/foo", lang: "x-default" },
      ],
    }

    expect(addXDefaultHreflang(item)).toBe(item)
  })
})
