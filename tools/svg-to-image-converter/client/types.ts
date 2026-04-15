import type { OutputFormat, SvgDimensions } from "../core/svg-conversion"

type SvgToImageMessages = Readonly<{
  backgroundColorLabel: string
  backgroundFillDescription: string
  backgroundFillLabel: string
  changeFileLabel: string
  chooseSvgLabel: string
  convertFailedError: string
  convertLabel: string
  convertingLabel: string
  downloadLabel: string
  dimensionsLabel: string
  emptyResultDescription: string
  emptyResultTitle: string
  fileSizeLabel: string
  formatJpegLabel: string
  formatLabel: string
  formatPngLabel: string
  formatWebpLabel: string
  heightLabel: string
  imageLoadFailedError: string
  invalidFileTypeError: string
  invalidSvgError: string
  keepAspectDescription: string
  keepAspectLabel: string
  meta: {
    description: string
    name: string
  }
  noCanvasError: string
  onlyOneFileError: string
  optionsDescription: string
  optionsTitle: string
  originalLabel: string
  outputLabel: string
  qualityDescription: string
  qualityLabel: string
  readError: string
  removeFileLabel: string
  resetLabel: string
  resultDescription: string
  resultTitle: string
  supportedFormatsLabel: string
  uploadDescription: string
  uploadHint: string
  uploadTitle: string
  widthLabel: string
}>

type SvgToImageResult = Readonly<{
  blob: Blob
  dimensions: SvgDimensions
  fileName: string
  format: OutputFormat
}>

export type { SvgToImageMessages, SvgToImageResult }
