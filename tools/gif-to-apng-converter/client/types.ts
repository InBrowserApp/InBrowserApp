import type { GifToApngOptions, GifToApngResult } from "../core/apng-conversion"

type GifToApngMessages = Readonly<{
  canvasUnavailableError: string
  changeFilesLabel: string
  chooseFilesLabel: string
  clearAllLabel: string
  conversionFailedError: string
  convertLabel: string
  convertingLabel: string
  dimensionsLabel: string
  downloadApngLabel: string
  downloadZipLabel: string
  duplicateFileError: string
  emptyGifError: string
  emptyResultDescription: string
  emptyResultTitle: string
  errorTitle: string
  fileSizeLabel: string
  frameCountLabel: string
  invalidFileTypeError: string
  invalidFrameError: string
  invalidGifError: string
  loopCountLabel: string
  loopCustomLabel: string
  loopDescription: string
  loopInheritLabel: string
  loopInfiniteLabel: string
  loopModeLabel: string
  meta: {
    description: string
    name: string
  }
  noFilesError: string
  optionsDescription: string
  optionsTitle: string
  originalLabel: string
  outputLabel: string
  outputSummaryLabel: string
  partialConversionError: string
  removeFileLabel: string
  resultDescription: string
  resultTitle: string
  scaleDescription: string
  scaleLabel: string
  selectedFilesLabel: string
  speedDescription: string
  speedLabel: string
  supportedFormatsLabel: string
  totalOutputLabel: string
  uploadDescription: string
  uploadHint: string
  uploadTitle: string
  zipFailedError: string
}>

type GifToApngBatchResult = Readonly<{
  results: GifToApngResult[]
  zipBlob: Blob | null
}>

export type { GifToApngBatchResult, GifToApngMessages, GifToApngOptions }
