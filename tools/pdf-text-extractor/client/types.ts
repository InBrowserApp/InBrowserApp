import type { ToolMeta } from "@workspace/tool-sdk"

type PdfTextExtractorMessages = Readonly<{
  changeFile: string
  characterCount: string
  copiedText: string
  copyText: string
  documentResults: string
  downloadTxt: string
  dragDropOrClick: string
  emptyTextPages: string
  errorTitle: string
  extractingDescription: string
  extractingTitle: string
  extractionNotice: string
  extractionNoticeTitle: string
  fileSize: string
  likelyScannedPages: string
  meta: ToolMeta
  noFileDescription: string
  noFileTitle: string
  noTextDescription: string
  noTextTitle: string
  pageCount: string
  parseError: string
  passwordError: string
  removeFile: string
  resultsDescription: string
  scannedWarning: string
  scannedWarningTitle: string
  selectedPdf: string
  supportedFormats: string
  textPages: string
  textPreviewLabel: string
  unsupportedFile: string
  uploadHint: string
  wordCount: string
}>

export type { PdfTextExtractorMessages }
