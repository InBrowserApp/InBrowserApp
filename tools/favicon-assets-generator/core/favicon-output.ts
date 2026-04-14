import type {
  DesktopIconConfig,
  PWAIconConfig,
  SiteConfig,
} from "./favicon-assets"

function normalizeAssetPath(path: string) {
  const trimmed = path.trim()

  if (trimmed === "" || trimmed === "/") {
    return "/"
  }

  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`
}

function shouldIncludeVectorDesktopIcon(
  sourceMimeType: string,
  desktop: DesktopIconConfig
) {
  return desktop.useOriginalSvg && sourceMimeType === "image/svg+xml"
}

function listGeneratedAssetNames(
  sourceMimeType: string,
  desktop: DesktopIconConfig,
  pwa: Pick<PWAIconConfig, "includeMaskable">
) {
  const assetNames = shouldIncludeVectorDesktopIcon(sourceMimeType, desktop)
    ? ["favicon.ico", "favicon.svg"]
    : ["favicon.ico", "favicon-32x32.png", "favicon-16x16.png"]

  assetNames.push("apple-touch-icon.png", "pwa-192x192.png", "pwa-512x512.png")

  if (pwa.includeMaskable) {
    assetNames.push("pwa-maskable-192x192.png", "pwa-maskable-512x512.png")
  }

  assetNames.push("site.webmanifest")

  return assetNames as readonly string[]
}

function createDesktopHeadMarkup(
  sourceMimeType: string,
  site: Pick<SiteConfig, "assetPath">,
  desktop: DesktopIconConfig
) {
  const assetPath = normalizeAssetPath(site.assetPath)

  if (shouldIncludeVectorDesktopIcon(sourceMimeType, desktop)) {
    return [
      `<link rel="icon" href="${assetPath}favicon.ico" sizes="48x48">`,
      `<link rel="icon" href="${assetPath}favicon.svg" sizes="any" type="image/svg+xml">`,
    ].join("\n")
  }

  return [
    `<link rel="icon" href="${assetPath}favicon-32x32.png" type="image/png" sizes="32x32">`,
    `<link rel="icon" href="${assetPath}favicon-16x16.png" type="image/png" sizes="16x16">`,
  ].join("\n")
}

function createIOSHeadMarkup(site: Pick<SiteConfig, "assetPath">) {
  const assetPath = normalizeAssetPath(site.assetPath)
  return `<link rel="apple-touch-icon" href="${assetPath}apple-touch-icon.png">`
}

function createThemeColorMarkup(
  site: Pick<
    SiteConfig,
    "themeColor" | "enableDarkThemeColor" | "darkThemeColor"
  >
) {
  if (site.enableDarkThemeColor) {
    return [
      `<meta name="theme-color" content="${site.themeColor}" media="(prefers-color-scheme: light)">`,
      `<meta name="theme-color" content="${site.darkThemeColor}" media="(prefers-color-scheme: dark)">`,
    ].join("\n")
  }

  return `<meta name="theme-color" content="${site.themeColor}">`
}

function createHeadMarkup(
  sourceMimeType: string,
  site: SiteConfig,
  desktop: DesktopIconConfig
) {
  const assetPath = normalizeAssetPath(site.assetPath)
  return [
    createIOSHeadMarkup(site),
    createDesktopHeadMarkup(sourceMimeType, site, desktop),
    `<link rel="manifest" href="${assetPath}site.webmanifest">`,
    createThemeColorMarkup(site),
  ].join("\n")
}

export {
  createDesktopHeadMarkup,
  createHeadMarkup,
  createIOSHeadMarkup,
  listGeneratedAssetNames,
  normalizeAssetPath,
  shouldIncludeVectorDesktopIcon,
}
