import type { GifToAnimatedWebpResult } from "../core/animated-webp-conversion"

type GifToAnimatedWebpMessages = Readonly<{
  canvasUnavailableError: string
  changeFilesLabel: string
  chooseGifsLabel: string
  clearAllLabel: string
  conversionFailedError: string
  convertLabel: string
  convertingLabel: string
  dimensionsLabel: string
  downloadWebpLabel: string
  downloadZipLabel: string
  duplicateFileError: string
  emptyGifError: string
  emptyResultDescription: string
  emptyResultTitle: string
  errorTitle: string
  fileSizeLabel: string
  invalidFileTypeError: string
  invalidFrameError: string
  invalidGifError: string
  loopCountDescription: string
  loopCountLabel: string
  loopCustomLabel: string
  loopDescription: string
  loopInheritLabel: string
  loopInfiniteLabel: string
  loopLabel: string
  meta: {
    description: string
    name: string
  }
  noFilesError: string
  optionsDescription: string
  optionsTitle: string
  originalLabel: string
  outputLabel: string
  partialConversionError: string
  removeGifLabel: string
  resultDescription: string
  resultTitle: string
  scaleDescription: string
  scaleLabel: string
  selectedGifsLabel: string
  sizeChangeLabel: string
  speedDescription: string
  speedLabel: string
  supportedFormatsLabel: string
  totalSizeChangeLabel: string
  uploadDescription: string
  uploadHint: string
  uploadTitle: string
  zipFailedError: string
}>

type AnimatedWebpBatchResult = Readonly<{
  results: GifToAnimatedWebpResult[]
  zipBlob: Blob | null
}>

export type { AnimatedWebpBatchResult, GifToAnimatedWebpMessages }
