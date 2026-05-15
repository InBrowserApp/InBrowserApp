import type {
  ConverterOptions,
  PdfGenerationProgress,
  Rotation,
} from "../core/options"

const IMAGE_TO_PDF_TOOL_ID = "image-to-pdf-converter"

type ImageQueueItem = Readonly<{
  file: File
  height: number
  id: string
  name: string
  previewUrl: string
  rotation: Rotation
  size: number
  width: number
}>

type PdfResult = Readonly<{
  blob: Blob
  fileName: string
  pageCount: number
}>

type ImageToPdfMessages = Readonly<{
  addImagesLabel: string
  autoOrientation: string
  balancedQuality: string
  bestQuality: string
  canvasUnavailableError: string
  changeImagesLabel: string
  clearAllLabel: string
  containFit: string
  coverFit: string
  downloadPdfLabel: string
  duplicateFileError: string
  emptyQueueDescription: string
  emptyQueueTitle: string
  emptyResultDescription: string
  emptyResultTitle: string
  errorTitle: string
  fileSizeLabel: string
  fitModeDescription: string
  fitModeLabel: string
  generateFailedError: string
  generateLabel: string
  generatingLabel: string
  imageCountLabel: string
  invalidImageError: string
  invalidImageTypeError: string
  landscapeOrientation: string
  localOnlyNote: string
  marginDescription: string
  marginLabel: string
  meta: {
    description: string
    name: string
  }
  moveDownLabel: string
  moveUpLabel: string
  noImagesError: string
  orientationLabel: string
  outputSizeLabel: string
  pageCountLabel: string
  pageSizeDescription: string
  pageSizeLabel: string
  pasteHint: string
  portraitOrientation: string
  previewAlt: string
  progressLabel: string
  qualityDescription: string
  qualityLabel: string
  queueDescription: string
  queueTitle: string
  readingImagesLabel: string
  removeImageLabel: string
  resultDescription: string
  resultReadyTitle: string
  resultTitle: string
  rotateLabel: string
  settingsDescription: string
  settingsTitle: string
  smallQuality: string
  supportedFormatsLabel: string
  uploadDescription: string
  uploadTitle: string
}>

type ClientState = Readonly<{
  generationProgress: PdfGenerationProgress | null
  isAddingImages: boolean
  isGenerating: boolean
  options: ConverterOptions
  result: PdfResult | null
}>

export { IMAGE_TO_PDF_TOOL_ID }
export type { ClientState, ImageQueueItem, ImageToPdfMessages, PdfResult }
