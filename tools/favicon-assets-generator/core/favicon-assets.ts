type DisplayMode = "fullscreen" | "standalone" | "minimal-ui" | "browser"

type SiteConfig = Readonly<{
  name: string
  shortName: string
  description: string
  startUrl: string
  display: DisplayMode
  themeColor: string
  enableDarkThemeColor: boolean
  darkThemeColor: string
  backgroundColor: string
  assetPath: string
}>

type DesktopIconConfig = Readonly<{
  useOriginalSvg: boolean
  addBackground: boolean
  backgroundColor: string
  backgroundRadius: number
  margin: number
}>

type IOSIconConfig = Readonly<{
  backgroundColor: string
  margin: number
}>

type PWAIconConfig = Readonly<{
  addBackground: boolean
  backgroundColor: string
  backgroundRadius: number
  margin: number
  includeMaskable: boolean
  maskableBackgroundColor: string
  maskableMargin: number
}>

type SquareDrawLayout = Readonly<{
  x: number
  y: number
  width: number
  height: number
}>

const DEFAULT_SITE_CONFIG = {
  name: "App",
  shortName: "App",
  description: "",
  startUrl: "/",
  display: "standalone",
  themeColor: "#FFFFFF",
  enableDarkThemeColor: true,
  darkThemeColor: "#000000",
  backgroundColor: "#FFFFFF",
  assetPath: "/",
} as const satisfies SiteConfig

const DEFAULT_DESKTOP_ICON_CONFIG = {
  useOriginalSvg: true,
  addBackground: false,
  backgroundColor: "#FFFFFF",
  backgroundRadius: 0,
  margin: 0,
} as const satisfies DesktopIconConfig

const DEFAULT_IOS_ICON_CONFIG = {
  backgroundColor: "#FFFFFF",
  margin: 0,
} as const satisfies IOSIconConfig

const DEFAULT_PWA_ICON_CONFIG = {
  addBackground: false,
  backgroundColor: "#FFFFFF",
  backgroundRadius: 0,
  margin: 0,
  includeMaskable: true,
  maskableBackgroundColor: "#FFFFFF",
  maskableMargin: 40,
} as const satisfies PWAIconConfig

function clampNumber(
  value: number,
  minimum: number,
  maximum: number,
  fallback = minimum
) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(maximum, Math.max(minimum, value))
}

function normalizeAssetPath(path: string) {
  const trimmed = path.trim()

  if (trimmed === "" || trimmed === "/") {
    return "/"
  }

  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`
}

function clampPercentage(value: number, fallback = 0, maximum = 100) {
  return clampNumber(value, 0, maximum, fallback)
}

function clampRadius(value: number) {
  return clampPercentage(value, 0, 100)
}

function shouldIncludeVectorDesktopIcon(
  sourceMimeType: string,
  desktop: DesktopIconConfig
) {
  return desktop.useOriginalSvg && sourceMimeType === "image/svg+xml"
}

function calculateSquareDrawLayout(input: {
  sourceWidth: number
  sourceHeight: number
  targetSize: number
  margin: number
}) {
  const sourceWidth = Math.max(1, Math.round(input.sourceWidth))
  const sourceHeight = Math.max(1, Math.round(input.sourceHeight))
  const targetSize = Math.max(1, Math.round(input.targetSize))
  const margin = clampPercentage(input.margin, 0, 99)
  const marginPixels = (margin / 2 / 100) * targetSize
  const drawableSize = Math.max(1, targetSize - marginPixels * 2)
  const imageMaxSize = Math.max(sourceWidth, sourceHeight)
  const scale = drawableSize / imageMaxSize
  const width = Math.max(1, Math.round(sourceWidth * scale))
  const height = Math.max(1, Math.round(sourceHeight * scale))
  const x = Math.round(marginPixels + (drawableSize - width) / 2)
  const y = Math.round(marginPixels + (drawableSize - height) / 2)

  return {
    x,
    y,
    width,
    height,
  } as const satisfies SquareDrawLayout
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

function createManifestObject(
  site: SiteConfig,
  pwa: Pick<PWAIconConfig, "includeMaskable">
) {
  const assetPath = normalizeAssetPath(site.assetPath)
  const icons = [
    {
      src: `${assetPath}pwa-192x192.png`,
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: `${assetPath}pwa-512x512.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ]

  if (pwa.includeMaskable) {
    icons.push(
      {
        src: `${assetPath}pwa-maskable-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `${assetPath}pwa-maskable-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      }
    )
  }

  return {
    name: site.name,
    short_name: site.shortName,
    ...(site.description.trim() ? { description: site.description } : {}),
    icons,
    start_url: site.startUrl,
    display: site.display,
    background_color: site.backgroundColor,
    theme_color: site.themeColor,
  }
}

function createManifestText(
  site: SiteConfig,
  pwa: Pick<PWAIconConfig, "includeMaskable">
) {
  return JSON.stringify(createManifestObject(site, pwa), null, 2)
}

function createHeadMarkup(
  sourceMimeType: string,
  site: SiteConfig,
  desktop: DesktopIconConfig
) {
  const assetPath = normalizeAssetPath(site.assetPath)
  const lines = [
    `<link rel="apple-touch-icon" href="${assetPath}apple-touch-icon.png">`,
  ]

  if (shouldIncludeVectorDesktopIcon(sourceMimeType, desktop)) {
    lines.push(
      `<link rel="icon" href="${assetPath}favicon.ico" sizes="48x48">`,
      `<link rel="icon" href="${assetPath}favicon.svg" sizes="any" type="image/svg+xml">`
    )
  } else {
    lines.push(
      `<link rel="icon" href="${assetPath}favicon-32x32.png" type="image/png" sizes="32x32">`,
      `<link rel="icon" href="${assetPath}favicon-16x16.png" type="image/png" sizes="16x16">`
    )
  }

  lines.push(`<link rel="manifest" href="${assetPath}site.webmanifest">`)

  if (site.enableDarkThemeColor) {
    lines.push(
      `<meta name="theme-color" content="${site.themeColor}" media="(prefers-color-scheme: light)">`,
      `<meta name="theme-color" content="${site.darkThemeColor}" media="(prefers-color-scheme: dark)">`
    )
  } else {
    lines.push(`<meta name="theme-color" content="${site.themeColor}">`)
  }

  return lines.join("\n")
}

export {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
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
}
export type {
  DesktopIconConfig,
  DisplayMode,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
}
