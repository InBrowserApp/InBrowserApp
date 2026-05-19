import { describe, expect, test } from "vitest"

import { DEFAULT_SITE_CONFIG } from "./config"
import {
  buildDesktopIconMarkup,
  buildHeadHtml,
  buildThemeColorMarkup,
} from "./html-snippet"

describe("buildDesktopIconMarkup", () => {
  test("returns ico, 16x16, and 32x32 link tags with the asset path", () => {
    const lines = buildDesktopIconMarkup("/assets/")

    expect(lines).toEqual([
      `<link rel="icon" type="image/x-icon" href="/assets/favicon.ico">`,
      `<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">`,
      `<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">`,
    ])
  })
})

describe("buildThemeColorMarkup", () => {
  test("emits a single meta when dark theme color is disabled", () => {
    const lines = buildThemeColorMarkup({
      themeColor: "#FFFFFF",
      enableDarkThemeColor: false,
      darkThemeColor: "#000000",
    })

    expect(lines).toEqual([`<meta name="theme-color" content="#FFFFFF">`])
  })

  test("emits two meta tags with media queries when dark theme color is enabled", () => {
    const lines = buildThemeColorMarkup({
      themeColor: "#FFFFFF",
      enableDarkThemeColor: true,
      darkThemeColor: "#0F172A",
    })

    expect(lines).toEqual([
      `<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">`,
      `<meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)">`,
    ])
  })
})

describe("buildHeadHtml", () => {
  test("includes favicon.ico, both PNG sizes, apple-touch, manifest and theme meta", () => {
    const html = buildHeadHtml({
      site: DEFAULT_SITE_CONFIG,
      includeVectorDesktopIcon: false,
    })

    expect(html).toContain(
      `<link rel="icon" type="image/x-icon" href="/favicon.ico">`
    )
    expect(html).toContain(
      `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`
    )
    expect(html).toContain(
      `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`
    )
    expect(html).toContain(
      `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
    )
    expect(html).toContain(`<link rel="manifest" href="/site.webmanifest">`)
    expect(html).toContain(
      `<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">`
    )
    expect(html).toContain(
      `<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">`
    )
  })

  test("inserts the SVG link only when includeVectorDesktopIcon is true", () => {
    const withoutSvg = buildHeadHtml({
      site: DEFAULT_SITE_CONFIG,
      includeVectorDesktopIcon: false,
    })
    const withSvg = buildHeadHtml({
      site: DEFAULT_SITE_CONFIG,
      includeVectorDesktopIcon: true,
    })

    expect(withoutSvg).not.toContain("favicon.svg")
    expect(withSvg).toContain(
      `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
    )
  })

  test("respects a custom asset path on every reference", () => {
    const html = buildHeadHtml({
      site: { ...DEFAULT_SITE_CONFIG, assetPath: "static/icons" },
      includeVectorDesktopIcon: true,
    })

    expect(html).toContain(`href="/static/icons/favicon.ico"`)
    expect(html).toContain(`href="/static/icons/favicon.svg"`)
    expect(html).toContain(`href="/static/icons/apple-touch-icon.png"`)
    expect(html).toContain(`href="/static/icons/site.webmanifest"`)
  })

  test("emits a single theme-color meta when dark variant is disabled", () => {
    const html = buildHeadHtml({
      site: { ...DEFAULT_SITE_CONFIG, enableDarkThemeColor: false },
      includeVectorDesktopIcon: false,
    })

    expect(html).toContain(`<meta name="theme-color" content="#FFFFFF">`)
    expect(html).not.toContain("media=")
  })
})
