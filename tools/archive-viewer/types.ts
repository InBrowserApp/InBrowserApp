/* v8 ignore file -- type-only module */

import type { ToolMeta } from "@workspace/tool-sdk"

type ArchiveViewerMessagesCatalog = Readonly<{
  uploadTitle: string
  uploadDescription: string
  uploadAction: string
  uploadHint: string
  supportedFormats: string
  localOnlyNote: string
  chooseAnother: string
  clearArchive: string
  parsingArchive: string
  errorTitle: string
  unsupportedFormat: string
  parseFailed: string
  gzipUnsupported: string
  previewTooLarge: string
  noPreview: string
  noArchiveTitle: string
  noArchiveDescription: string
  summaryFormat: string
  summaryCompressed: string
  summaryUncompressed: string
  summaryEntries: string
  summaryFiles: string
  summaryFolders: string
  explorerTitle: string
  explorerDescription: string
  searchLabel: string
  searchPlaceholder: string
  rootFolder: string
  goUp: string
  emptyFolderTitle: string
  emptyFolderDescription: string
  columnName: string
  columnKind: string
  columnSize: string
  columnModified: string
  kindFile: string
  kindDirectory: string
  kindSymlink: string
  kindOther: string
  previewTitle: string
  previewDescription: string
  previewPlaceholderTitle: string
  previewPlaceholderDescription: string
  loadingPreview: string
  selectedFile: string
  copyPreview: string
  copiedPreview: string
  downloadEntry: string
  textPreviewLabel: string
  imagePreviewLabel: string
  openFolder: string
  previewFile: string
}>

type ArchiveViewerMessages = ArchiveViewerMessagesCatalog & {
  meta: ToolMeta
}

export type { ArchiveViewerMessages, ArchiveViewerMessagesCatalog }
