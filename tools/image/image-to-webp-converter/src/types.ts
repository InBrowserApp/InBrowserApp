export interface WebpConversionOptions {
  scale: number
}

export interface WebpConversionResult {
  file: File
  blob: Blob
  outputName: string
  originalWidth: number
  originalHeight: number
  outputWidth: number
  outputHeight: number
}
