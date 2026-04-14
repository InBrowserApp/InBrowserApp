import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
} from "../core/favicon-assets"

type GeneratedAssetFile = Readonly<{
  name: string
  size: number
  type: string
}>

type GeneratedBlobFile = Readonly<{
  name: string
  blob: Blob
}>

type GeneratedAssetGroup = Readonly<{
  files: readonly GeneratedBlobFile[]
  snippetText: string
}>

type GeneratedFaviconBundle = Readonly<{
  files: readonly GeneratedAssetFile[]
  headMarkup: string
  manifestText: string
  zipBlob: Blob
}>

type GenerateFaviconAssetsInput = Readonly<{
  sourceFile: File
  site: SiteConfig
  desktop: DesktopIconConfig
  ios: IOSIconConfig
  pwa: PWAIconConfig
}>

export type {
  GenerateFaviconAssetsInput,
  GeneratedAssetGroup,
  GeneratedBlobFile,
  GeneratedFaviconBundle,
}
