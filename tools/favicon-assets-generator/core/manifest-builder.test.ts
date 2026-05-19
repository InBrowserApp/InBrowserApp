import { describe, expect, test } from "vitest"

import { DEFAULT_PWA_ICON_CONFIG, DEFAULT_SITE_CONFIG } from "./config"
import {
  buildManifest,
  buildManifestIcons,
  manifestToJsonString,
} from "./manifest-builder"

describe("buildManifestIcons", () => {
  test("returns two 'any' icons when maskable is disabled", () => {
    const icons = buildManifestIcons("/", false)

    expect(icons).toHaveLength(2)
    expect(icons.every((icon) => icon.purpose === "any")).toBe(true)
    expect(icons[0]?.src).toBe("/pwa-192x192.png")
    expect(icons[1]?.src).toBe("/pwa-512x512.png")
  })

  test("returns four icons when maskable is enabled", () => {
    const icons = buildManifestIcons("/", true)

    expect(icons).toHaveLength(4)
    expect(icons.map((icon) => icon.purpose)).toEqual([
      "any",
      "any",
      "maskable",
      "maskable",
    ])
    expect(icons[2]?.src).toBe("/pwa-maskable-192x192.png")
    expect(icons[3]?.src).toBe("/pwa-maskable-512x512.png")
  })

  test("respects the asset path prefix", () => {
    const icons = buildManifestIcons("/static/", true)

    expect(icons[0]?.src).toBe("/static/pwa-192x192.png")
    expect(icons[3]?.src).toBe("/static/pwa-maskable-512x512.png")
  })
})

describe("buildManifest", () => {
  test("uses the configured fields and normalizes the asset path", () => {
    const manifest = buildManifest({
      site: {
        ...DEFAULT_SITE_CONFIG,
        name: "Acme",
        shortName: "AC",
        description: "  A test app  ",
        assetPath: "assets",
        startUrl: "/home",
        themeColor: "#112233",
        backgroundColor: "#FFFFFF",
        display: "fullscreen",
      },
      pwa: DEFAULT_PWA_ICON_CONFIG,
    })

    expect(manifest.name).toBe("Acme")
    expect(manifest.short_name).toBe("AC")
    expect(manifest.description).toBe("A test app")
    expect(manifest.icons[0]?.src).toBe("/assets/pwa-192x192.png")
    expect(manifest.start_url).toBe("/home")
    expect(manifest.display).toBe("fullscreen")
    expect(manifest.theme_color).toBe("#112233")
    expect(manifest.background_color).toBe("#FFFFFF")
  })

  test("omits description when blank or whitespace-only", () => {
    const manifest = buildManifest({
      site: { ...DEFAULT_SITE_CONFIG, description: "   " },
      pwa: DEFAULT_PWA_ICON_CONFIG,
    })

    expect("description" in manifest).toBe(false)
  })

  test("falls back short_name to name when short name is blank", () => {
    const manifest = buildManifest({
      site: { ...DEFAULT_SITE_CONFIG, name: "Acme", shortName: "   " },
      pwa: DEFAULT_PWA_ICON_CONFIG,
    })

    expect(manifest.short_name).toBe("Acme")
  })

  test("drops maskable icons when includeMaskable is false", () => {
    const manifest = buildManifest({
      site: DEFAULT_SITE_CONFIG,
      pwa: { ...DEFAULT_PWA_ICON_CONFIG, includeMaskable: false },
    })

    expect(manifest.icons).toHaveLength(2)
    expect(manifest.icons.every((icon) => icon.purpose === "any")).toBe(true)
  })

  test("normalizes a remote start_url unchanged", () => {
    const manifest = buildManifest({
      site: { ...DEFAULT_SITE_CONFIG, startUrl: "https://example.com/" },
      pwa: DEFAULT_PWA_ICON_CONFIG,
    })

    expect(manifest.start_url).toBe("https://example.com/")
  })
})

describe("manifestToJsonString", () => {
  test("produces pretty-printed JSON with a trailing newline", () => {
    const manifest = buildManifest({
      site: { ...DEFAULT_SITE_CONFIG, name: "Acme" },
      pwa: DEFAULT_PWA_ICON_CONFIG,
    })
    const json = manifestToJsonString(manifest)

    expect(json).toMatch(/^{\n/)
    expect(json).toMatch(/\n}\n$/)
    expect(JSON.parse(json)).toMatchObject({ name: "Acme" })
  })
})
