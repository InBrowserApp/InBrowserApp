import type { ToolMeta } from "@workspace/tool-sdk"

type RawLocalFontData = Readonly<{
  family?: string | null
  fullName?: string | null
  postscriptName?: string | null
  style?: string | null
}>

type DisplayFont = Readonly<{
  id: string
  family: string
  fullName: string
  postscriptName: string
  style: string
  displayFamily: string
  displayName: string
  displayStyle: string
  searchKey: string
}>

type FontGroup = Readonly<{
  id: string
  label: string
  items: readonly DisplayFont[]
}>

type FontStyleFilter = "all" | "regular" | "italic"
type FontSort = "family" | "name" | "style"
type PermissionStateLike = PermissionState | "unknown"
type LocalFontLoadError = "not-allowed" | "security" | "unknown" | null

type LocalFontBookLocalizedCatalog = Readonly<{
  libraryTitle: string
  loadButton: string
  searchPlaceholder: string
  groupLabel: string
  filterStyleAll: string
  filterStyleRegular: string
  filterStyleItalic: string
  sortLabel: string
  sortFamily: string
  sortName: string
  sortStyle: string
  fontCount: string
  statusUnsupported: string
  statusDenied: string
  statusBlocked: string
  statusError: string
  previewTitle: string
  previewPlaceholder: string
  previewFallback: string
  previewBackground: string
  previewEmpty: string
  detailsTitle: string
  detailsFamily: string
  detailsFullName: string
  detailsPostscript: string
  detailsStyle: string
  cssTitle: string
  copyCssLabel: string
  copiedLabel: string
  noResults: string
}>

type LocalFontBookMessages = Readonly<
  {
    meta: ToolMeta
  } & LocalFontBookLocalizedCatalog
>

type FontFaceDescriptor = Readonly<{
  fontFamily: string
  fontStyle: "normal" | "italic"
  fontWeight?: number
}>

export type {
  DisplayFont,
  FontFaceDescriptor,
  FontGroup,
  FontSort,
  FontStyleFilter,
  LocalFontBookLocalizedCatalog,
  LocalFontBookMessages,
  LocalFontLoadError,
  PermissionStateLike,
  RawLocalFontData,
}
