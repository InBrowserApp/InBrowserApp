import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
} from "./config"

type RasterPlatform = "desktop" | "ios" | "pwa-any" | "pwa-maskable"
type DedicatedSourceKey = "desktop" | "ios" | "pwa"
type SourceKey = "global" | DedicatedSourceKey

type RasterRenderSpec = Readonly<{
  size: number
  marginPercent: number
  background: { color: string; radius: number } | null
  sourceKey: SourceKey
  platform: RasterPlatform
}>

type RasterAssetSpec = RasterRenderSpec &
  Readonly<{
    kind: "raster"
    filename: string
  }>

type VectorAssetSpec = Readonly<{
  kind: "vector"
  filename: "favicon.svg"
  sourceKey: SourceKey
}>

type IcoComponentSpec = Readonly<{
  size: number
  marginPercent: number
  background: { color: string; radius: number } | null
  sourceKey: SourceKey
}>

type IcoAssetSpec = Readonly<{
  kind: "ico"
  filename: "favicon.ico"
  components: readonly IcoComponentSpec[]
}>

type ManifestAssetSpec = Readonly<{
  kind: "manifest"
  filename: "site.webmanifest"
}>

type AssetSpec =
  | RasterAssetSpec
  | VectorAssetSpec
  | IcoAssetSpec
  | ManifestAssetSpec

type PlanInput = Readonly<{
  desktopSourceIsSvg: boolean
  site: SiteConfig
  desktop: DesktopIconConfig
  ios: IOSIconConfig
  pwa: PWAIconConfig
}>

const ICO_COMPONENT_SIZES = [16, 32, 48] as const
const DESKTOP_PNG_SIZES = [16, 32] as const
const PWA_ANY_SIZES = [192, 512] as const
const PWA_MASKABLE_SIZES = [192, 512] as const
const APPLE_TOUCH_ICON_SIZE = 180

function resolveSourceKey(
  dedicatedKey: DedicatedSourceKey,
  useDifferentImage: boolean
): SourceKey {
  return useDifferentImage ? dedicatedKey : "global"
}

function buildDesktopBackground(
  desktop: DesktopIconConfig
): { color: string; radius: number } | null {
  if (!desktop.addBackground) {
    return null
  }

  return {
    color: desktop.backgroundColor,
    radius: desktop.backgroundRadius,
  }
}

function buildPwaBackground(
  pwa: PWAIconConfig
): { color: string; radius: number } | null {
  if (!pwa.addBackground) {
    return null
  }

  return {
    color: pwa.backgroundColor,
    radius: pwa.backgroundRadius,
  }
}

function buildIcoComponents(
  desktop: DesktopIconConfig
): readonly IcoComponentSpec[] {
  const sourceKey = resolveSourceKey("desktop", desktop.useDifferentImage)
  const background = buildDesktopBackground(desktop)

  return ICO_COMPONENT_SIZES.map((size) => ({
    size,
    marginPercent: desktop.margin,
    background,
    sourceKey,
  }))
}

function shouldEmitVectorDesktopIcon({
  desktopSourceIsSvg,
  desktop,
}: Pick<PlanInput, "desktopSourceIsSvg" | "desktop">): boolean {
  return desktopSourceIsSvg && desktop.useOriginalSvg
}

function buildAssetPlan(input: PlanInput): readonly AssetSpec[] {
  const { desktop, ios, pwa } = input
  const desktopSourceKey = resolveSourceKey(
    "desktop",
    desktop.useDifferentImage
  )
  const desktopBackground = buildDesktopBackground(desktop)
  const iosSourceKey = resolveSourceKey("ios", ios.useDifferentImage)
  const pwaSourceKey = resolveSourceKey("pwa", pwa.useDifferentImage)
  const pwaBackground = buildPwaBackground(pwa)

  const assets: AssetSpec[] = []

  assets.push({
    kind: "ico",
    filename: "favicon.ico",
    components: buildIcoComponents(desktop),
  })

  for (const size of DESKTOP_PNG_SIZES) {
    assets.push({
      kind: "raster",
      filename: `favicon-${size}x${size}.png`,
      size,
      marginPercent: desktop.margin,
      background: desktopBackground,
      sourceKey: desktopSourceKey,
      platform: "desktop",
    })
  }

  if (shouldEmitVectorDesktopIcon(input)) {
    assets.push({
      kind: "vector",
      filename: "favicon.svg",
      sourceKey: desktopSourceKey,
    })
  }

  assets.push({
    kind: "raster",
    filename: "apple-touch-icon.png",
    size: APPLE_TOUCH_ICON_SIZE,
    marginPercent: ios.margin,
    background: { color: ios.backgroundColor, radius: 0 },
    sourceKey: iosSourceKey,
    platform: "ios",
  })

  for (const size of PWA_ANY_SIZES) {
    assets.push({
      kind: "raster",
      filename: `pwa-${size}x${size}.png`,
      size,
      marginPercent: pwa.margin,
      background: pwaBackground,
      sourceKey: pwaSourceKey,
      platform: "pwa-any",
    })
  }

  if (pwa.includeMaskable) {
    for (const size of PWA_MASKABLE_SIZES) {
      assets.push({
        kind: "raster",
        filename: `pwa-maskable-${size}x${size}.png`,
        size,
        marginPercent: pwa.maskableMargin,
        background: { color: pwa.maskableBackgroundColor, radius: 0 },
        sourceKey: pwaSourceKey,
        platform: "pwa-maskable",
      })
    }
  }

  assets.push({
    kind: "manifest",
    filename: "site.webmanifest",
  })

  return assets
}

export type {
  AssetSpec,
  DedicatedSourceKey,
  IcoAssetSpec,
  IcoComponentSpec,
  ManifestAssetSpec,
  PlanInput,
  RasterAssetSpec,
  RasterPlatform,
  RasterRenderSpec,
  SourceKey,
  VectorAssetSpec,
}
export {
  APPLE_TOUCH_ICON_SIZE,
  buildAssetPlan,
  DESKTOP_PNG_SIZES,
  ICO_COMPONENT_SIZES,
  PWA_ANY_SIZES,
  PWA_MASKABLE_SIZES,
  resolveSourceKey,
  shouldEmitVectorDesktopIcon,
}
