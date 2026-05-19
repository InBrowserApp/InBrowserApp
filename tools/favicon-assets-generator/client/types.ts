import type { RasterPlatform } from "../core/plan"

type ImageSource = Readonly<{
  file: File
  width: number
  height: number
  mimeType: string
  isSvg: boolean
  svgText: string | null
  objectUrl: string
  image: HTMLImageElement
}>

type GeneratedAsset = Readonly<{
  filename: string
  blob: Blob
  previewUrl: string
  platform: RasterPlatform | "ico" | "vector" | "manifest"
  size?: number
  byteLength: number
}>

type GeneratedBundle = Readonly<{
  assets: readonly GeneratedAsset[]
  zip: { blob: Blob; url: string; name: string }
  manifestJson: string
  htmlSnippet: string
  includesVectorDesktopIcon: boolean
}>

type GenerationErrorCode =
  | "needs-image"
  | "needs-app-name"
  | "invalid-image"
  | "missing-dedicated-image"
  | "canvas-unavailable"
  | "generation-failed"

type GenerationError = Readonly<{
  code: GenerationErrorCode
  message: string
}>

type FaviconMessages = Readonly<{
  meta: Readonly<{ name: string; description: string }>

  uploadCardTitle: string
  uploadCardDescription: string
  chooseImageLabel: string
  changeImageLabel: string
  uploadHint: string
  useDemoLabel: string
  removeImageLabel: string
  filePreviewAlt: string

  siteInfoCardTitle: string
  siteInfoCardDescription: string
  appNameLabel: string
  shortNameLabel: string
  shortNameDescription: string
  descriptionLabel: string
  descriptionDescription: string
  startUrlLabel: string
  startUrlDescription: string
  assetPathLabel: string
  assetPathDescription: string
  displayModeLabel: string
  displayFullscreen: string
  displayStandalone: string
  displayMinimalUi: string
  displayBrowser: string
  themeColorLabel: string
  themeColorDescription: string
  enableDarkThemeColorLabel: string
  enableDarkThemeColorDescription: string
  darkThemeColorLabel: string
  backgroundColorLabel: string
  backgroundColorDescription: string

  desktopCardTitle: string
  desktopCardDescription: string
  useOriginalSvgLabel: string
  useOriginalSvgDescription: string
  addBackgroundLabel: string
  cardBackgroundColorLabel: string
  backgroundRadiusLabel: string
  backgroundRadiusDescription: string
  marginLabel: string
  marginDescription: string
  useDifferentImageLabel: string
  useDifferentImageDescription: string
  uploadDedicatedImageLabel: string
  removeDedicatedImageLabel: string

  iosCardTitle: string
  iosCardDescription: string
  iosBackgroundColorLabel: string
  iosBackgroundColorDescription: string

  pwaCardTitle: string
  pwaCardDescription: string
  includeMaskableLabel: string
  includeMaskableDescription: string
  maskableBackgroundColorLabel: string
  maskableMarginLabel: string
  maskableMarginDescription: string

  previewGalleryTitle: string
  previewGalleryDescription: string
  previewBeforeGenerateHint: string
  previewDesktopBrowserLabel: string
  previewGoogleSearchLabel: string
  previewIosHomeScreenLabel: string
  previewAndroidLauncherLabel: string
  previewWindowsTaskbarLabel: string

  resultCardTitle: string
  resultCardDescription: string
  resultEmptyTitle: string
  resultEmptyDescription: string
  generateLabel: string
  generatingLabel: string
  regenerateLabel: string
  resetLabel: string
  downloadZipLabel: string
  generatedAssetsTitle: string
  generatedAssetsCountLabel: string
  htmlSnippetTitle: string
  htmlSnippetDescription: string
  manifestPreviewTitle: string
  manifestPreviewDescription: string
  copyLabel: string
  copiedLabel: string
  downloadAssetLabel: string

  invalidImageTitle: string
  invalidImageDescription: string
  generationFailedTitle: string
  generationFailedDescription: string
  needAppNameTitle: string
  needAppNameDescription: string
  needImageTitle: string
  needImageDescription: string
  missingDedicatedImageTitle: string
  missingDedicatedImageDescription: string

  transparentLabel: string
}>

export type {
  FaviconMessages,
  GeneratedAsset,
  GeneratedBundle,
  GenerationError,
  ImageSource,
}
