export type ImageToIcoMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  uploadTitle: string
  uploadDescription: string
  chooseImageLabel: string
  uploadHint: string
  supportedFormatsLabel: string
  changeImageLabel: string
  removeFileLabel: string
  optionsTitle: string
  optionsDescription: string
  sizesLabel: string
  sizesDescription: string
  backgroundLabel: string
  backgroundDescription: string
  backgroundColorLabel: string
  generateLabel: string
  generatingLabel: string
  resultTitle: string
  resultDescription: string
  emptyResultTitle: string
  emptyResultDescription: string
  downloadLabel: string
  sizesIncludedLabel: string
  fileSizeLabel: string
  errorTitle: string
  onlyOneFileError: string
  invalidFileTypeError: string
  selectSizeError: string
  invalidImageError: string
  canvasUnavailableError: string
  conversionFailedError: string
}>
