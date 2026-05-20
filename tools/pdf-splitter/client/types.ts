import type { ToolMeta } from "@workspace/tool-sdk"

type PdfSplitterMessages = Readonly<{
  meta: ToolMeta
  dragDropOrClick: string
  supportedFormats: string
  uploadHint: string
  selectedPdf: string
  changeFile: string
  removeFile: string
  fileSize: string
  pageCount: string
  selectionTitle: string
  selectionDescription: string
  rangeLabel: string
  rangePlaceholder: string
  selectAll: string
  selectOdd: string
  selectEven: string
  clearSelection: string
  selectedSummary: string
  outputTitle: string
  outputDescription: string
  outputMode: string
  modeSingle: string
  modeMultiple: string
  splitStrategy: string
  strategyRanges: string
  strategyPages: string
  generate: string
  generating: string
  resultsTitle: string
  resultsDescription: string
  downloadPdf: string
  downloadZip: string
  resultReady: string
  resultFileCount: string
  noFileTitle: string
  noFileDescription: string
  loadingTitle: string
  loadingDescription: string
  emptySelectionTitle: string
  emptySelectionDescription: string
  emptyResultTitle: string
  emptyResultDescription: string
  pageGridTitle: string
  pageGridDescription: string
  pageTileLabel: string
  errorTitle: string
  unsupportedFile: string
  invalidPdf: string
  encryptedPdf: string
  rangeEmpty: string
  rangeInvalid: string
  rangeOutOfBounds: string
  rangeDescending: string
  rangeDuplicate: string
  workerUnsupported: string
  splitFailed: string
  zipFailed: string
}>

export type { PdfSplitterMessages }
