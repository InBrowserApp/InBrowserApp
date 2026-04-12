import { describe, expect, test } from "vitest"

import {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
  DEFAULT_SITE_CONFIG,
  calculateSquareDrawLayout,
  clampPercentage,
  clampRadius,
  createHeadMarkup,
  createManifestObject,
  createManifestText,
  listGeneratedAssetNames,
  normalizeAssetPath,
  shouldIncludeVectorDesktopIcon,
} from "./favicon-assets"

describe("normalizeAssetPath", () => {
  test("normalizes blank paths to the site root", () => {
    expect(normalizeAssetPath("")).toBe("/")
    expect(normalizeAssetPath(" / ")).toBe("/")
  })

  test("keeps existing trailing slashes", () => {
    expect(normalizeAssetPath("/icons/")).toBe("/icons/")
  })

  test("appends a trailing slash when needed", () => {
    expect(normalizeAssetPath("icons")).toBe("icons/")
    expect(normalizeAssetPath("/icons")).toBe("/icons/")
  })
})

describe("clamp helpers", () => {
  test("clamps percentages into range", () => {
    expect(clampPercentage(-10)).toBe(0)
    expect(clampPercentage(25)).toBe(25)
    expect(clampPercentage(120)).toBe(100)
    expect(clampPercentage(Number.NaN, 18)).toBe(18)
  })

  test("clamps radii into range", () => {
    expect(clampRadius(-4)).toBe(0)
    expect(clampRadius(64)).toBe(64)
    expect(clampRadius(160)).toBe(100)
  })
})

describe("shouldIncludeVectorDesktopIcon", () => {
  test("requires both an svg source and the original-svg option", () => {
    expect(
      shouldIncludeVectorDesktopIcon("image/svg+xml", {
        ...DEFAULT_DESKTOP_ICON_CONFIG,
        useOriginalSvg: true,
      })
    ).toBe(true)

    expect(
      shouldIncludeVectorDesktopIcon("image/png", {
        ...DEFAULT_DESKTOP_ICON_CONFIG,
        useOriginalSvg: true,
      })
    ).toBe(false)

    expect(
      shouldIncludeVectorDesktopIcon("image/svg+xml", {
        ...DEFAULT_DESKTOP_ICON_CONFIG,
        useOriginalSvg: false,
      })
    ).toBe(false)
  })
})

describe("calculateSquareDrawLayout", () => {
  test("fits a landscape image inside a square target", () => {
    expect(
      calculateSquareDrawLayout({
        sourceWidth: 1200,
        sourceHeight: 600,
        targetSize: 100,
        margin: 0,
      })
    ).toEqual({ x: 0, y: 25, width: 100, height: 50 })
  })

  test("fits a portrait image with margins", () => {
    expect(
      calculateSquareDrawLayout({
        sourceWidth: 600,
        sourceHeight: 1200,
        targetSize: 100,
        margin: 20,
      })
    ).toEqual({ x: 30, y: 10, width: 40, height: 80 })
  })

  test("guards against invalid sizes", () => {
    expect(
      calculateSquareDrawLayout({
        sourceWidth: 0,
        sourceHeight: 0,
        targetSize: 0,
        margin: 200,
      })
    ).toEqual({ x: 0, y: 0, width: 1, height: 1 })
  })
})

describe("listGeneratedAssetNames", () => {
  test("returns vector desktop outputs for svg sources", () => {
    expect(
      listGeneratedAssetNames("image/svg+xml", DEFAULT_DESKTOP_ICON_CONFIG, {
        includeMaskable: true,
      })
    ).toEqual([
      "favicon.ico",
      "favicon.svg",
      "apple-touch-icon.png",
      "pwa-192x192.png",
      "pwa-512x512.png",
      "pwa-maskable-192x192.png",
      "pwa-maskable-512x512.png",
      "site.webmanifest",
    ])
  })

  test("returns raster desktop outputs and omits maskable files when disabled", () => {
    expect(
      listGeneratedAssetNames(
        "image/png",
        { ...DEFAULT_DESKTOP_ICON_CONFIG, useOriginalSvg: false },
        { includeMaskable: false }
      )
    ).toEqual([
      "favicon.ico",
      "favicon-32x32.png",
      "favicon-16x16.png",
      "apple-touch-icon.png",
      "pwa-192x192.png",
      "pwa-512x512.png",
      "site.webmanifest",
    ])
  })
})

describe("manifest builders", () => {
  test("creates a manifest object with optional description and maskable icons", () => {
    expect(
      createManifestObject(
        {
          ...DEFAULT_SITE_CONFIG,
          name: "Starter",
          shortName: "Start",
          description: "Launch fast",
          assetPath: "/assets/icons",
        },
        DEFAULT_PWA_ICON_CONFIG
      )
    ).toEqual({
      name: "Starter",
      short_name: "Start",
      description: "Launch fast",
      icons: [
        {
          src: "/assets/icons/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/assets/icons/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/assets/icons/pwa-maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/assets/icons/pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      start_url: "/",
      display: "standalone",
      background_color: "#FFFFFF",
      theme_color: "#FFFFFF",
    })
  })

  test("omits empty descriptions and maskable icons when disabled", () => {
    expect(
      createManifestText(
        {
          ...DEFAULT_SITE_CONFIG,
          assetPath: "icons",
          description: "   ",
        },
        { includeMaskable: false }
      )
    ).toBe(`{
  "name": "App",
  "short_name": "App",
  "icons": [
    {
      "src": "icons/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#FFFFFF"
}`)
  })
})

describe("createHeadMarkup", () => {
  test("renders raster desktop tags and a single theme color by default", () => {
    expect(
      createHeadMarkup(
        "image/png",
        {
          ...DEFAULT_SITE_CONFIG,
          enableDarkThemeColor: false,
          assetPath: "/icons",
        },
        { ...DEFAULT_DESKTOP_ICON_CONFIG, useOriginalSvg: false }
      )
    ).toBe(`<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="icon" href="/icons/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/icons/favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="manifest" href="/icons/site.webmanifest">
<meta name="theme-color" content="#FFFFFF">`)
  })

  test("renders vector desktop tags and light/dark theme colors for svg inputs", () => {
    expect(
      createHeadMarkup(
        "image/svg+xml",
        {
          ...DEFAULT_SITE_CONFIG,
          themeColor: "#eeeeee",
          darkThemeColor: "#111111",
        },
        DEFAULT_DESKTOP_ICON_CONFIG
      )
    ).toBe(`<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#eeeeee" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111111" media="(prefers-color-scheme: dark)">`)
  })
})
