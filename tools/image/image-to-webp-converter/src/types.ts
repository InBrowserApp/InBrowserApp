export interface WebpConversionOptions {
  scale: number
  quality: number
  method: number
  lossless: boolean
  targetSize?: number
  targetPsnr?: number
  alphaQuality?: number
  nearLossless?: number
  snsStrength?: number
  filterStrength?: number
  filterSharpness?: number
  filterType?: number
  partitions?: number
  segments?: number
  pass?: number
  exact?: boolean
  useSharpYuv?: boolean
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
