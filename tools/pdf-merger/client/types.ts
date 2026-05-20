import type { PdfMergeErrorCode } from "../core/pdf-merger"

const PDF_MERGER_TOOL_ID = "pdf-merger"

type PdfQueueItemStatus = "reading" | "ready" | "error"

type PdfQueueItem = Readonly<{
  errorCode: PdfMergeErrorCode | null
  file: File
  id: string
  name: string
  pageCount: number | null
  previewUrl: string
  size: number
  status: PdfQueueItemStatus
}>

type PdfMergerMessages = Readonly<{
  addFilesLabel: string
  changeFilesLabel: string
  clearAllLabel: string
  closePreviewLabel: string
  downloadPdfLabel: string
  duplicateFileError: string
  emptyQueueDescription: string
  emptyQueueTitle: string
  emptyResultDescription: string
  emptyResultTitle: string
  encryptedPdfError: string
  errorTitle: string
  fileCountLabel: string
  fileSizeLabel: string
  invalidPdfError: string
  localOnlyNote: string
  mergeFailedError: string
  mergeLabel: string
  mergingLabel: string
  meta: {
    description: string
    name: string
  }
  moveDownLabel: string
  moveUpLabel: string
  noFilesError: string
  outputFileDescription: string
  outputFileLabel: string
  outputFilePlaceholder: string
  outputSizeLabel: string
  pageCountLabel: string
  pageStatusLabel: string
  pagesStatusLabel: string
  previewLabel: string
  previewTitle: string
  processingStatusLabel: string
  queueDescription: string
  queueTitle: string
  readingPdfLabel: string
  readyStatusLabel: string
  removeFileLabel: string
  resultDescription: string
  resultReadyTitle: string
  resultTitle: string
  summaryTitle: string
  supportedFormatsLabel: string
  uploadDescription: string
  uploadTitle: string
  workerUnavailableError: string
}>

export { PDF_MERGER_TOOL_ID }
export type { PdfMergerMessages, PdfQueueItem }
