export interface WebpConversionOptions {
  scale: number
  quality: number
  method: number
  lossless: boolean
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
