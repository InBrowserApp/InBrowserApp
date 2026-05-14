import type { ImageToWebpResult } from "../core/webp-conversion"

type ImageToWebpMessages = Readonly<{
  changeImagesLabel: string
  chooseImagesLabel: string
  canvasUnavailableError: string
  clearAllLabel: string
  conversionFailedError: string
  convertLabel: string
  convertingLabel: string
  dimensionsLabel: string
  downloadWebpLabel: string
  downloadZipLabel: string
  duplicateFileError: string
  emptyResultDescription: string
  emptyResultTitle: string
  errorTitle: string
  fileSizeLabel: string
  invalidFileTypeError: string
  invalidImageError: string
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
  qualityDescription: string
  qualityLabel: string
  removeImageLabel: string
  resultDescription: string
  resultTitle: string
  savedLabel: string
  scaleDescription: string
  scaleLabel: string
  selectedImagesLabel: string
  supportedFormatsLabel: string
  totalSavedLabel: string
  uploadDescription: string
  uploadHint: string
  uploadTitle: string
  webpUnsupportedError: string
  zipFailedError: string
}>

type WebpBatchResult = Readonly<{
  results: ImageToWebpResult[]
  zipBlob: Blob | null
}>

export type { ImageToWebpMessages, WebpBatchResult }
