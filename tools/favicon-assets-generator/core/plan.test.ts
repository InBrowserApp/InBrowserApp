import { describe, expect, test } from "vitest"

import {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
  DEFAULT_SITE_CONFIG,
} from "./config"
import {
  APPLE_TOUCH_ICON_SIZE,
  ICO_COMPONENT_SIZES,
  PWA_ANY_SIZES,
  PWA_MASKABLE_SIZES,
  buildAssetPlan,
  resolveSourceKey,
  shouldEmitVectorDesktopIcon,
} from "./plan"
import type { PlanInput } from "./plan"
import type { AssetSpec } from "./plan"

const baseInput: PlanInput = {
  desktopSourceIsSvg: false,
  site: DEFAULT_SITE_CONFIG,
  desktop: DEFAULT_DESKTOP_ICON_CONFIG,
  ios: DEFAULT_IOS_ICON_CONFIG,
  pwa: DEFAULT_PWA_ICON_CONFIG,
}

function filenamesOf(plan: readonly AssetSpec[]): readonly string[] {
  return plan.map((asset) => asset.filename)
}

describe("resolveSourceKey", () => {
  test("returns 'global' when the platform does not opt into a dedicated image", () => {
    expect(resolveSourceKey("desktop", false)).toBe("global")
    expect(resolveSourceKey("ios", false)).toBe("global")
    expect(resolveSourceKey("pwa", false)).toBe("global")
  })

  test("returns the dedicated key when the platform opts in", () => {
    expect(resolveSourceKey("desktop", true)).toBe("desktop")
    expect(resolveSourceKey("ios", true)).toBe("ios")
    expect(resolveSourceKey("pwa", true)).toBe("pwa")
  })
})

describe("shouldEmitVectorDesktopIcon", () => {
  test("is true only when source is SVG and useOriginalSvg is on", () => {
    expect(
      shouldEmitVectorDesktopIcon({
        desktopSourceIsSvg: true,
        desktop: { ...DEFAULT_DESKTOP_ICON_CONFIG, useOriginalSvg: true },
      })
    ).toBe(true)
    expect(
      shouldEmitVectorDesktopIcon({
        desktopSourceIsSvg: true,
        desktop: { ...DEFAULT_DESKTOP_ICON_CONFIG, useOriginalSvg: false },
      })
    ).toBe(false)
    expect(
      shouldEmitVectorDesktopIcon({
        desktopSourceIsSvg: false,
        desktop: { ...DEFAULT_DESKTOP_ICON_CONFIG, useOriginalSvg: true },
      })
    ).toBe(false)
  })
})

describe("buildAssetPlan", () => {
  test("returns the default 8-asset bundle when nothing is changed", () => {
    const plan = buildAssetPlan(baseInput)

    expect(filenamesOf(plan)).toEqual([
      "favicon.ico",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "apple-touch-icon.png",
      "pwa-192x192.png",
      "pwa-512x512.png",
      "pwa-maskable-192x192.png",
      "pwa-maskable-512x512.png",
      "site.webmanifest",
    ])
  })

  test("includes favicon.svg only when the desktop source is SVG and useOriginalSvg is true", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      desktopSourceIsSvg: true,
      desktop: { ...DEFAULT_DESKTOP_ICON_CONFIG, useOriginalSvg: true },
    })

    expect(filenamesOf(plan)).toContain("favicon.svg")
    const svgIndex = filenamesOf(plan).indexOf("favicon.svg")
    const appleIndex = filenamesOf(plan).indexOf("apple-touch-icon.png")
    expect(svgIndex).toBeLessThan(appleIndex)
  })

  test("omits favicon.svg when useOriginalSvg is off, even if the source is SVG", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      desktopSourceIsSvg: true,
      desktop: { ...DEFAULT_DESKTOP_ICON_CONFIG, useOriginalSvg: false },
    })

    expect(filenamesOf(plan)).not.toContain("favicon.svg")
  })

  test("omits maskable PWA outputs when includeMaskable is false", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      pwa: { ...DEFAULT_PWA_ICON_CONFIG, includeMaskable: false },
    })

    expect(filenamesOf(plan)).not.toContain("pwa-maskable-192x192.png")
    expect(filenamesOf(plan)).not.toContain("pwa-maskable-512x512.png")
  })

  test("uses the dedicated source key when a platform opts in", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      desktop: { ...DEFAULT_DESKTOP_ICON_CONFIG, useDifferentImage: true },
      ios: { ...DEFAULT_IOS_ICON_CONFIG, useDifferentImage: true },
      pwa: { ...DEFAULT_PWA_ICON_CONFIG, useDifferentImage: true },
    })

    const desktopPng = plan.find(
      (asset) => asset.filename === "favicon-32x32.png"
    )
    const ico = plan.find((asset) => asset.filename === "favicon.ico")
    const apple = plan.find(
      (asset) => asset.filename === "apple-touch-icon.png"
    )
    const pwa = plan.find((asset) => asset.filename === "pwa-192x192.png")
    const pwaMaskable = plan.find(
      (asset) => asset.filename === "pwa-maskable-192x192.png"
    )

    expect(desktopPng?.kind).toBe("raster")
    if (desktopPng?.kind === "raster") {
      expect(desktopPng.sourceKey).toBe("desktop")
    }
    expect(ico?.kind).toBe("ico")
    if (ico?.kind === "ico") {
      expect(ico.components.every((c) => c.sourceKey === "desktop")).toBe(true)
    }
    expect(apple?.kind).toBe("raster")
    if (apple?.kind === "raster") {
      expect(apple.sourceKey).toBe("ios")
    }
    expect(pwa?.kind).toBe("raster")
    if (pwa?.kind === "raster") {
      expect(pwa.sourceKey).toBe("pwa")
    }
    expect(pwaMaskable?.kind).toBe("raster")
    if (pwaMaskable?.kind === "raster") {
      expect(pwaMaskable.sourceKey).toBe("pwa")
    }
  })

  test("propagates desktop background settings to all desktop outputs and ICO components", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      desktop: {
        ...DEFAULT_DESKTOP_ICON_CONFIG,
        addBackground: true,
        backgroundColor: "#FF00FF",
        backgroundRadius: 25,
      },
    })

    const desktop16 = plan.find(
      (asset) => asset.filename === "favicon-16x16.png"
    )
    expect(desktop16?.kind).toBe("raster")
    if (desktop16?.kind === "raster") {
      expect(desktop16.background).toEqual({ color: "#FF00FF", radius: 25 })
    }

    const ico = plan.find((asset) => asset.filename === "favicon.ico")
    expect(ico?.kind).toBe("ico")
    if (ico?.kind === "ico") {
      expect(
        ico.components.every(
          (component) =>
            component.background?.color === "#FF00FF" &&
            component.background?.radius === 25
        )
      ).toBe(true)
    }
  })

  test("applies the PWA 'any' background when addBackground is on", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      pwa: {
        ...DEFAULT_PWA_ICON_CONFIG,
        addBackground: true,
        backgroundColor: "#ABCDEF",
        backgroundRadius: 40,
      },
    })

    const pwa = plan.find((asset) => asset.filename === "pwa-192x192.png")
    expect(pwa?.kind).toBe("raster")
    if (pwa?.kind === "raster") {
      expect(pwa.background).toEqual({ color: "#ABCDEF", radius: 40 })
    }
  })

  test("uses maskable margin and background for maskable assets only", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      pwa: {
        ...DEFAULT_PWA_ICON_CONFIG,
        maskableMargin: 60,
        maskableBackgroundColor: "#0000FF",
        margin: 0,
      },
    })

    const maskable = plan.find(
      (asset) => asset.filename === "pwa-maskable-192x192.png"
    )
    const anyVariant = plan.find(
      (asset) => asset.filename === "pwa-192x192.png"
    )

    expect(maskable?.kind).toBe("raster")
    if (maskable?.kind === "raster") {
      expect(maskable.marginPercent).toBe(60)
      expect(maskable.background?.color).toBe("#0000FF")
    }
    expect(anyVariant?.kind).toBe("raster")
    if (anyVariant?.kind === "raster") {
      expect(anyVariant.marginPercent).toBe(0)
    }
  })

  test("never deviates from the canonical ICO component size list", () => {
    const plan = buildAssetPlan(baseInput)
    const ico = plan.find((asset) => asset.filename === "favicon.ico")

    expect(ico?.kind).toBe("ico")
    if (ico?.kind === "ico") {
      expect(ico.components.map((c) => c.size)).toEqual([
        ...ICO_COMPONENT_SIZES,
      ])
    }
  })

  test("emits apple-touch-icon at 180px with the configured iOS background", () => {
    const plan = buildAssetPlan({
      ...baseInput,
      ios: {
        ...DEFAULT_IOS_ICON_CONFIG,
        backgroundColor: "#123456",
        margin: 10,
      },
    })

    const apple = plan.find(
      (asset) => asset.filename === "apple-touch-icon.png"
    )

    expect(apple?.kind).toBe("raster")
    if (apple?.kind === "raster") {
      expect(apple.size).toBe(APPLE_TOUCH_ICON_SIZE)
      expect(apple.background).toEqual({ color: "#123456", radius: 0 })
      expect(apple.marginPercent).toBe(10)
    }
  })

  test("emits the standard PWA sizes and maskable sizes in canonical order", () => {
    const plan = buildAssetPlan(baseInput)
    const pwaAnyFiles = plan
      .filter(
        (asset) => asset.kind === "raster" && asset.platform === "pwa-any"
      )
      .map((asset) => asset.filename)
    const pwaMaskableFiles = plan
      .filter(
        (asset) => asset.kind === "raster" && asset.platform === "pwa-maskable"
      )
      .map((asset) => asset.filename)

    expect(pwaAnyFiles).toEqual(
      PWA_ANY_SIZES.map((size) => `pwa-${size}x${size}.png`)
    )
    expect(pwaMaskableFiles).toEqual(
      PWA_MASKABLE_SIZES.map((size) => `pwa-maskable-${size}x${size}.png`)
    )
  })
})
