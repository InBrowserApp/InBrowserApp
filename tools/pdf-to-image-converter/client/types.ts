import type { ToolMeta } from "@workspace/tool-sdk"
import type { RenderPageOptions } from "../core/options"

type PdfToImageMessages = Readonly<{
  meta: ToolMeta
  addPdfLabel: string
  canvasExportFailedError: string
  canvasUnavailableError: string
  changePdfLabel: string
  downloadCurrentLabel: string
  downloadZipLabel: string
  dpiDescription: string
  dpiLabel: string
  dpiPresetLabel: string
  emptyPreviewDescription: string
  emptyPreviewTitle: string
  errorTitle: string
  exportAllLabel: string
  exportFailedError: string
  exportProgressLabel: string
  exportingAllLabel: string
  fileSizeLabel: string
  imageDetails: string
  invalidPdfError: string
  jpegFormat: string
  loadFailedError: string
  loadingDocumentLabel: string
  localOnlyNote: string
  outputFormatLabel: string
  pageCountLabel: string
  pageInputLabel: string
  pageLabel: string
  pageSummary: string
  pngFormat: string
  previewAlt: string
  previewDescription: string
  previewTitle: string
  qualityDescription: string
  qualityLabel: string
  removePdfLabel: string
  renderFailedError: string
  renderingPreviewDescription: string
  renderingPreviewTitle: string
  selectedPdfTitle: string
  settingsDescription: string
  settingsTitle: string
  supportedFormatsLabel: string
  unsupportedFileError: string
  uploadDescription: string
  uploadTitle: string
  webpFormat: string
}>

type PdfPageImage = RenderPageOptions &
  Readonly<{
    blob: Blob
    height: number
    page: number
    width: number
  }>

type ExportProgress = Readonly<{
  completed: number
  total: number
}>

type ZipResult = Readonly<{
  blob: Blob
  fileName: string
  pageCount: number
}>

export type {
  ExportProgress,
  PdfPageImage,
  PdfToImageMessages,
  RenderPageOptions,
  ZipResult,
}
