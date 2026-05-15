import type { ImageToAvifResult } from "../core/avif-conversion"

type ImageToAvifMessages = Readonly<{
  changeImagesLabel: string
  chooseImagesLabel: string
  canvasUnavailableError: string
  clearAllLabel: string
  conversionFailedError: string
  convertLabel: string
  convertingLabel: string
  dimensionsLabel: string
  downloadAvifLabel: string
  downloadZipLabel: string
  duplicateFileError: string
  emptyResultDescription: string
  emptyResultTitle: string
  errorTitle: string
  fileSizeLabel: string
  invalidFileTypeError: string
  invalidImageError: string
  losslessDescription: string
  losslessLabel: string
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
  speedDescription: string
  speedLabel: string
  supportedFormatsLabel: string
  totalSavedLabel: string
  uploadDescription: string
  uploadHint: string
  uploadTitle: string
  workerUnsupportedError: string
  zipFailedError: string
}>

type AvifBatchResult = Readonly<{
  results: ImageToAvifResult[]
  zipBlob: Blob | null
}>

export type { ImageToAvifMessages, AvifBatchResult }
