import type { ToolMeta } from "@workspace/tool-sdk"
import type { PdfPageEntry } from "../core/pdf-page-organizer"

const PDF_PAGE_ORGANIZER_TOOL_ID = "pdf-page-organizer"

type OrganizerResult = Readonly<{
  blob: Blob
  fileName: string
  pageCount: number
}>

type PdfPagePreview = Readonly<{
  dataUrl: string
  height: number
  pageNumber: number
  width: number
}>

type PdfPageOrganizerMessages = Readonly<{
  addPdfLabel: string
  changePdfLabel: string
  dragPageLabel: string
  dragPagesHint: string
  downloadPdfLabel: string
  emptyPagesDescription: string
  emptyPagesTitle: string
  emptyResultDescription: string
  emptyResultTitle: string
  encryptedPdfError: string
  errorTitle: string
  exportDescription: string
  exportFailedError: string
  exportTitle: string
  fileSizeLabel: string
  generateLabel: string
  generatingLabel: string
  invalidPdfError: string
  invalidPdfTypeError: string
  localOnlyNote: string
  meta: ToolMeta
  moveDownLabel: string
  moveUpLabel: string
  noPagesError: string
  outputFileLabel: string
  outputPagesLabel: string
  outputSizeLabel: string
  pageCountLabel: string
  pageSizeLabel: string
  pagesDescription: string
  pagesTitle: string
  previewAltLabel: string
  previewUnavailableLabel: string
  renderingPreviewsLabel: string
  readingPdfLabel: string
  removePageLabel: string
  resetPagesLabel: string
  resultReadyTitle: string
  rotateClockwiseLabel: string
  rotationLabel: string
  selectedFileLabel: string
  sourcePageLabel: string
  supportedFormatsLabel: string
  uploadDescription: string
  uploadTitle: string
}>

export { PDF_PAGE_ORGANIZER_TOOL_ID }
export type {
  OrganizerResult,
  PdfPageEntry,
  PdfPageOrganizerMessages,
  PdfPagePreview,
}
