import { describe, expect, it } from "vitest"
import { INSTALL_GUIDES } from "./install-guides"
import { localizeInstallHelpHref } from "./install-help-links"
import type { SiteLanguage } from "./site"

describe("install guide help links", () => {
  it.each([
    ["zh-CN", "zh-Hans"],
    ["zh-TW", "zh-Hant"],
    ["pt", "pt-PT"],
    ["he", "iw"],
    ["en", "en"],
  ] satisfies [SiteLanguage, string][])(
    "requests Chrome help in %s without losing the platform",
    (language, expectedLocale) => {
      const { href } = INSTALL_GUIDES["ios-other"].links[0]
      const url = new URL(localizeInstallHelpHref(href, language))

      expect(url.searchParams.get("hl")).toBe(expectedLocale)
      expect(url.searchParams.get("co")).toBe("GENIE.Platform=iOS")
    }
  )

  it("requests the same Firefox article in the selected support locale", () => {
    const { href } = INSTALL_GUIDES["windows-firefox"].links[0]

    expect(localizeInstallHelpHref(href, "pt")).toBe(
      "https://support.mozilla.org/pt-PT/kb/web-apps-firefox-windows"
    )
    expect(localizeInstallHelpHref(href, "en")).toBe(
      "https://support.mozilla.org/en-US/kb/web-apps-firefox-windows"
    )
  })

  it("uses each publisher's regional paths and preserves the device article", () => {
    const { href: ipadHelp } = INSTALL_GUIDES["ios-safari"].links[1]
    const { href: edgeHelp } = INSTALL_GUIDES["desktop-edge"].links[0]

    expect(localizeInstallHelpHref(ipadHelp, "no")).toBe(
      "https://support.apple.com/no-no/guide/ipad/ipad8f1f7a29/ipados"
    )
    expect(localizeInstallHelpHref(edgeHelp, "no")).toBe(
      "https://support.microsoft.com/nb-no/edge/install-manage-or-uninstall-apps-in-microsoft-edge"
    )
  })

  it("keeps the original help URL when the publisher has no localized equivalent", () => {
    const { href: edgeHelp } = INSTALL_GUIDES["desktop-edge"].links[0]
    const { href: ipadHelp } = INSTALL_GUIDES["ios-safari"].links[1]
    const { href: samsungHelp } =
      INSTALL_GUIDES["android-samsung-internet"].links[0]

    expect(localizeInstallHelpHref(edgeHelp, "hi")).toBe(edgeHelp)
    expect(localizeInstallHelpHref(edgeHelp, "ms")).toBe(edgeHelp)
    expect(localizeInstallHelpHref(ipadHelp, "ms")).toBe(ipadHelp)
    expect(localizeInstallHelpHref(samsungHelp, "ko")).toBe(samsungHelp)
  })

  it("uses Apple's alternate paths when the translated article has a different URL", () => {
    const { href: ipadHelp } = INSTALL_GUIDES["ios-safari"].links[1]
    const { href: macHelp } = INSTALL_GUIDES["macos-safari"].links[0]

    expect(localizeInstallHelpHref(ipadHelp, "zh-CN")).toBe(
      "https://support.apple.com/zh-hans/guide/ipad/ipad8f1f7a29/ipados"
    )
    expect(localizeInstallHelpHref(macHelp, "hi")).toBe(
      "https://support.apple.com/hi-in/guide/safari/ibrw9e991864/mac"
    )
  })
})
