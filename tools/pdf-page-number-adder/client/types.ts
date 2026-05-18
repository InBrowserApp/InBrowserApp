import type { ToolMeta } from "@workspace/tool-sdk"
import type { PageNumberOptions } from "../core/types"

type PageNumberFormOptions = Omit<PageNumberOptions, "pages">

type PdfPageNumberAdderMessages = Readonly<{
  allPagesSelected: string
  bottomCenterPosition: string
  bottomLeftPosition: string
  bottomRightPosition: string
  changeFile: string
  downloadPdfLabel: string
  dragDropOrClick: string
  emptyResultDescription: string
  emptyResultTitle: string
  encryptedPdfError: string
  errorTitle: string
  fileSizeLabel: string
  fontFamilyLabel: string
  fontSizeDescription: string
  fontSizeLabel: string
  formatLabel: string
  generateFailedError: string
  generateLabel: string
  generatingDescription: string
  generatingLabel: string
  generatingTitle: string
  horizontalMarginLabel: string
  localOnlyNote: string
  marginDescription: string
  meta: ToolMeta
  noFileError: string
  numberOnlyFormat: string
  numberTotalFormat: string
  outputSizeLabel: string
  pageCountLabel: string
  pageRangeDescription: string
  pageRangeLabel: string
  pageRangePlaceholder: string
  positionLabel: string
  previewDescription: string
  previewSamplePage: string
  previewTitle: string
  rangeDescending: string
  rangeDuplicate: string
  rangeInvalidToken: string
  rangeOutOfBounds: string
  readPdfError: string
  readingPdfDescription: string
  readingPdfTitle: string
  removeFile: string
  resultDescription: string
  resultReadyTitle: string
  resultTitle: string
  sansSerifFont: string
  selectedPagesCount: string
  selectedPdf: string
  serifFont: string
  settingsDescription: string
  settingsTitle: string
  startNumberLabel: string
  supportedFormats: string
  topCenterPosition: string
  topLeftPosition: string
  topRightPosition: string
  unsupportedFile: string
  uploadDescription: string
  uploadTitle: string
  verticalMarginLabel: string
}>

type PdfPageNumberResult = Readonly<{
  blob: Blob
  fileName: string
  pageCount: number
}>

export type {
  PageNumberFormOptions,
  PdfPageNumberAdderMessages,
  PdfPageNumberResult,
}
