export type ImageMetadataCleanerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  dragDropOrClick: string
  supportedFormats: string
  remove: string
  cleanMetadata: string
  cleaningMetadata: string
  results: string
  removed: string
  reduction: string
  fileSize: string
  downloadCleaned: string
  note: string
  error: string
  unsupportedFormat: string
  cleaningComplete: string
  cleaningFailed: string
}>
