import type { InstallGuideId } from "./install-guides"

type BrowserInfo = Pick<Navigator, "userAgent" | "maxTouchPoints"> & {
  userAgentData?: { brands: readonly { brand: string }[] }
}

export function getInstallTarget({
  userAgent: ua,
  maxTouchPoints,
  userAgentData,
}: BrowserInfo): InstallGuideId | undefined {
  const inApp =
    /\bwv\b|FBAN|FBAV|Instagram|MicroMessenger|\bLine\b|GSA\//i.test(ua)
  const safari = /Version\/[\d.]+.*Safari\//.test(ua)
  const ios =
    /iPhone|iPad|iPod/.test(ua) ||
    (ua.includes("Macintosh") && maxTouchPoints > 1)

  if (ios) {
    return safari && !inApp && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua)
      ? "ios-safari"
      : "ios-other"
  }

  const chrome =
    /Chrome\//.test(ua) &&
    !/Edg|OPR|OPPO|SamsungBrowser|Vivaldi|YaBrowser|DuckDuckGo|HuaweiBrowser|UCBrowser|MiuiBrowser|Silk|Brave/i.test(
      ua
    ) &&
    (!userAgentData?.brands.length ||
      userAgentData.brands.some(({ brand }) => brand === "Google Chrome"))

  if (ua.includes("Android")) {
    if (inApp) return "android-other"
    if (ua.includes("SamsungBrowser/")) return "android-samsung-internet"
    if (ua.includes("Firefox/")) return "android-firefox"
    return chrome ? "android-chrome" : "android-other"
  }

  if (inApp || !/Windows NT|Macintosh|X11|CrOS/.test(ua)) return
  if (ua.includes("Edg/")) return "desktop-edge"
  if (ua.includes("Windows NT") && ua.includes("Firefox/"))
    return "windows-firefox"
  if (ua.includes("Macintosh") && safari) return "macos-safari"
  if (chrome) return "desktop-chrome"
}
