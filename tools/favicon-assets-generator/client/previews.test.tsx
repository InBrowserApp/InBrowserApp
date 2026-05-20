import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
} from "../core/config"
import { DesktopPreview } from "./desktop-preview"
import { IosPreview } from "./ios-preview"
import { PwaPreview } from "./pwa-preview"
import type { FaviconMessages, ImageSource } from "./types"

afterEach(cleanup)

const baseMessages = {
  previewDesktopBrowserLabel: "Desktop browser tab",
  previewGoogleSearchLabel: "Search engine result",
  previewIosHomeScreenLabel: "iOS home screen",
  previewAndroidLauncherLabel: "Android launcher",
  previewWindowsTaskbarLabel: "Windows taskbar",
} as Partial<FaviconMessages> as FaviconMessages

function makeSource(objectUrl = "blob:source"): ImageSource {
  return {
    file: new File([new Uint8Array([1])], "logo.png", { type: "image/png" }),
    width: 256,
    height: 256,
    mimeType: "image/png",
    isSvg: false,
    svgText: null,
    objectUrl,
    image: {
      naturalWidth: 256,
      naturalHeight: 256,
      width: 256,
      height: 256,
    } as unknown as HTMLImageElement,
  }
}

describe("IosPreview", () => {
  test("applies cfg.backgroundColor and cfg.margin to the apple-touch overlay", () => {
    const cfg = {
      ...DEFAULT_IOS_ICON_CONFIG,
      backgroundColor: "#FF8800",
      margin: 30,
    }
    const { container } = render(
      <IosPreview
        messages={baseMessages}
        appName="Acme"
        cfg={cfg}
        bundle={null}
        globalSource={makeSource()}
        iosSource={null}
      />
    )

    const bgDivs = container.querySelectorAll('[aria-hidden="true"]')
    // First aria-hidden is the chrome wallpaper; the second is the icon's bg
    const iconBg = bgDivs[1] as HTMLElement
    expect(iconBg.style.backgroundColor.toUpperCase()).toBe("#FF8800")

    const img = container.querySelector("img") as HTMLImageElement
    expect(img.style.padding).toBe("15%") // margin 30 / 2
  })

  test("falls back to globalSource when iosSource is null", () => {
    const { container } = render(
      <IosPreview
        messages={baseMessages}
        appName="Acme"
        cfg={DEFAULT_IOS_ICON_CONFIG}
        bundle={null}
        globalSource={makeSource("blob:global")}
        iosSource={null}
      />
    )

    const img = container.querySelector("img") as HTMLImageElement
    expect(img.getAttribute("src")).toBe("blob:global")
  })

  test("uses dedicated iosSource when useDifferentImage is on", () => {
    const cfg = { ...DEFAULT_IOS_ICON_CONFIG, useDifferentImage: true }
    const { container } = render(
      <IosPreview
        messages={baseMessages}
        appName="Acme"
        cfg={cfg}
        bundle={null}
        globalSource={makeSource("blob:global")}
        iosSource={makeSource("blob:ios")}
      />
    )

    const img = container.querySelector("img") as HTMLImageElement
    expect(img.getAttribute("src")).toBe("blob:ios")
  })
})

describe("DesktopPreview", () => {
  test("renders three preview tiles (two browser tabs + a SERP)", () => {
    const { container } = render(
      <DesktopPreview
        messages={baseMessages}
        appName="Acme"
        cfg={DEFAULT_DESKTOP_ICON_CONFIG}
        bundle={null}
        globalSource={makeSource()}
        desktopSource={null}
      />
    )

    const tiles = container.querySelectorAll("figure")
    expect(tiles).toHaveLength(3)
  })

  test("omits background when cfg.addBackground is false", () => {
    const { container } = render(
      <DesktopPreview
        messages={baseMessages}
        appName="Acme"
        cfg={{ ...DEFAULT_DESKTOP_ICON_CONFIG, addBackground: false }}
        bundle={null}
        globalSource={makeSource()}
        desktopSource={null}
      />
    )

    // Each tile's container is aria-hidden chrome. The icon overlay
    // background div only exists when addBackground is true.
    const chromeBgs = container.querySelectorAll('[aria-hidden="true"]')
    // Two chrome backgrounds (tab light + tab dark) + zero icon backgrounds.
    expect(chromeBgs.length).toBe(2)
  })

  test("adds icon background div when cfg.addBackground is on", () => {
    const cfg = {
      ...DEFAULT_DESKTOP_ICON_CONFIG,
      addBackground: true,
      backgroundColor: "#112233",
      backgroundRadius: 60,
      margin: 20,
    }
    const { container } = render(
      <DesktopPreview
        messages={baseMessages}
        appName="Acme"
        cfg={cfg}
        bundle={null}
        globalSource={makeSource()}
        desktopSource={null}
      />
    )

    const bgDivs = container.querySelectorAll('[aria-hidden="true"]')
    // 2 chromes + 3 icon backgrounds (one per tab tile + one for the SERP)
    expect(bgDivs.length).toBe(5)
    const iconBg = bgDivs[1] as HTMLElement
    expect(iconBg.style.backgroundColor.toUpperCase()).toBe("#112233")
    expect(iconBg.style.borderRadius).toBe("30%")

    const imgs = container.querySelectorAll("img")
    // 2 tab favicons + 1 SERP favicon
    expect(imgs.length).toBe(3)
    expect((imgs[0] as HTMLImageElement).style.padding).toBe("10%")
    // The SERP favicon also picks up the user's margin
    expect((imgs[2] as HTMLImageElement).style.padding).toBe("10%")
  })

  test("SERP favicon reflects cfg.backgroundColor and cfg.margin", () => {
    const cfg = {
      ...DEFAULT_DESKTOP_ICON_CONFIG,
      addBackground: true,
      backgroundColor: "#0099FF",
      backgroundRadius: 100,
      margin: 16,
    }
    const { container } = render(
      <DesktopPreview
        messages={baseMessages}
        appName="Acme"
        cfg={cfg}
        bundle={null}
        globalSource={makeSource()}
        desktopSource={null}
      />
    )

    const tiles = container.querySelectorAll("figure")
    const serpTile = tiles[2] as HTMLElement
    const serpBg = serpTile.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(serpBg.style.backgroundColor.toUpperCase()).toBe("#0099FF")
    expect(serpBg.style.borderRadius).toBe("50%")

    const serpImg = serpTile.querySelector("img") as HTMLImageElement
    expect(serpImg.style.padding).toBe("8%") // margin 16 / 2
  })
})

describe("PwaPreview", () => {
  test("places the Windows taskbar icon overlay at the legacy right-side position", () => {
    const { container } = render(
      <PwaPreview
        messages={baseMessages}
        appName="Acme"
        cfg={DEFAULT_PWA_ICON_CONFIG}
        bundle={null}
        globalSource={makeSource()}
        pwaSource={null}
      />
    )

    const tiles = container.querySelectorAll("figure")
    expect(tiles.length).toBeGreaterThanOrEqual(1)

    // The Windows taskbar icon slot should sit on the right of the
    // taskbar at the legacy 384/460 ≈ 83.48% offset, not centered.
    const windowsTile = tiles[0] as HTMLElement
    const overlays = Array.from(
      windowsTile.querySelectorAll<HTMLElement>("div")
    )
    const positioned = overlays.find((el) => el.style.left.startsWith("83"))
    expect(positioned).toBeDefined()
    // Width should be ~10% (46/460).
    expect(positioned!.style.width.startsWith("10")).toBe(true)
  })

  test("hides the Android launcher tile when includeMaskable is off", () => {
    const cfg = { ...DEFAULT_PWA_ICON_CONFIG, includeMaskable: false }
    const { container } = render(
      <PwaPreview
        messages={baseMessages}
        appName="Acme"
        cfg={cfg}
        bundle={null}
        globalSource={makeSource()}
        pwaSource={null}
      />
    )

    const tiles = container.querySelectorAll("figure")
    expect(tiles).toHaveLength(1)
  })

  test("applies maskable margin and bg color to the Android launcher overlay", () => {
    const cfg = {
      ...DEFAULT_PWA_ICON_CONFIG,
      includeMaskable: true,
      maskableBackgroundColor: "#22AAFF",
      maskableMargin: 60,
    }
    const { container } = render(
      <PwaPreview
        messages={baseMessages}
        appName="Acme"
        cfg={cfg}
        bundle={null}
        globalSource={makeSource()}
        pwaSource={null}
      />
    )

    const tiles = container.querySelectorAll("figure")
    expect(tiles).toHaveLength(2)

    const androidTile = tiles[1] as HTMLElement
    const bgDivs = androidTile.querySelectorAll('[aria-hidden="true"]')
    const iconBg = bgDivs[1] as HTMLElement
    expect(iconBg.style.backgroundColor.toUpperCase()).toBe("#22AAFF")
    expect(iconBg.style.clipPath).toBe("circle(40%)")

    const imgs = androidTile.querySelectorAll("img")
    const overlayImg = imgs[0] as HTMLImageElement
    expect(overlayImg.style.padding).toBe("30%") // maskableMargin 60 / 2
    expect(overlayImg.style.clipPath).toBe("circle(40%)")
  })

  test("applies the non-maskable 'any' margin to the Windows taskbar overlay", () => {
    const cfg = {
      ...DEFAULT_PWA_ICON_CONFIG,
      margin: 24,
      addBackground: true,
      backgroundColor: "#BADA55",
    }
    const { container } = render(
      <PwaPreview
        messages={baseMessages}
        appName="Acme"
        cfg={cfg}
        bundle={null}
        globalSource={makeSource()}
        pwaSource={null}
      />
    )

    const tiles = container.querySelectorAll("figure")
    const windowsTile = tiles[0] as HTMLElement
    const bgDivs = windowsTile.querySelectorAll('[aria-hidden="true"]')
    const iconBg = bgDivs[1] as HTMLElement
    expect(iconBg.style.backgroundColor.toUpperCase()).toBe("#BADA55")

    const img = windowsTile.querySelector(
      'img[alt^="pwa-192"]'
    ) as HTMLImageElement
    expect(img.style.padding).toBe("12%") // margin 24 / 2
  })
})
