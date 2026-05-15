import type { ToolMeta } from "@workspace/tool-sdk"

type PngOptimizerMessages = Readonly<{
  chooseFileLabel: string
  clearFileLabel: string
  dropzoneDescription: string
  dropzoneTitle: string
  emptyResultDescription: string
  emptyResultTitle: string
  errorTitle: string
  fasterLabel: string
  fileSizeLabel: string
  interlaceDescription: string
  interlaceLabel: string
  invalidFileTypeError: string
  levelDescription: string
  levelLabel: string
  meta: ToolMeta
  noFileError: string
  noReductionLabel: string
  optimizeAlphaDescription: string
  optimizeAlphaLabel: string
  optimizeButtonLabel: string
  optimizedSizeLabel: string
  optimizingButtonLabel: string
  optimizationFailedError: string
  originalSizeLabel: string
  optionsDescription: string
  optionsTitle: string
  pngOnlyLabel: string
  reductionLabel: string
  replaceFileLabel: string
  resultDescription: string
  resultTitle: string
  savedLabel: string
  selectedFileLabel: string
  smallerLabel: string
  uploadDescription: string
  uploadTitle: string
  workerUnavailableError: string
  downloadOptimizedLabel: string
}>

export type { PngOptimizerMessages }
