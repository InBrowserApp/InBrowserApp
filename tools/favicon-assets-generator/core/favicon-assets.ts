import {
  createDesktopHeadMarkup,
  createHeadMarkup,
  createIOSHeadMarkup,
  listGeneratedAssetNames,
  normalizeAssetPath,
  shouldIncludeVectorDesktopIcon,
} from "./favicon-output"

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
  sourceFile: File | null
}>

type IOSIconConfig = Readonly<{
  backgroundColor: string
  margin: number
  sourceFile: File | null
}>

type PWAIconConfig = Readonly<{
  addBackground: boolean
  backgroundColor: string
  backgroundRadius: number
  margin: number
  includeMaskable: boolean
  maskableBackgroundColor: string
  maskableMargin: number
  sourceFile: File | null
  maskableSourceFile: File | null
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
  sourceFile: null,
} as const satisfies DesktopIconConfig

const DEFAULT_IOS_ICON_CONFIG = {
  backgroundColor: "#FFFFFF",
  margin: 0,
  sourceFile: null,
} as const satisfies IOSIconConfig

const DEFAULT_PWA_ICON_CONFIG = {
  addBackground: false,
  backgroundColor: "#FFFFFF",
  backgroundRadius: 0,
  margin: 0,
  includeMaskable: true,
  maskableBackgroundColor: "#FFFFFF",
  maskableMargin: 40,
  sourceFile: null,
  maskableSourceFile: null,
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

function clampPercentage(value: number, fallback = 0, maximum = 100) {
  return clampNumber(value, 0, maximum, fallback)
}

function clampRadius(value: number) {
  return clampPercentage(value, 0, 100)
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

function createManifestIcons(
  site: Pick<SiteConfig, "assetPath">,
  pwa: Pick<PWAIconConfig, "includeMaskable">,
  purpose: "any" | "maskable" | "all" = "all"
) {
  const assetPath = normalizeAssetPath(site.assetPath)
  const anyIcons = [
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

  const maskableIcons = pwa.includeMaskable
    ? [
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
        },
      ]
    : []

  if (purpose === "any") {
    return anyIcons
  }

  if (purpose === "maskable") {
    return maskableIcons
  }

  return [...anyIcons, ...maskableIcons]
}

function createManifestIconsText(
  site: Pick<SiteConfig, "assetPath">,
  pwa: Pick<PWAIconConfig, "includeMaskable">,
  purpose: "any" | "maskable" | "all" = "all"
) {
  return JSON.stringify(createManifestIcons(site, pwa, purpose), null, 2)
}

function createManifestText(
  site: SiteConfig,
  pwa: Pick<PWAIconConfig, "includeMaskable">
) {
  return JSON.stringify(createManifestObject(site, pwa), null, 2)
}

export {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
  DEFAULT_SITE_CONFIG,
  calculateSquareDrawLayout,
  clampPercentage,
  clampRadius,
  createDesktopHeadMarkup,
  createHeadMarkup,
  createIOSHeadMarkup,
  createManifestIcons,
  createManifestIconsText,
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
