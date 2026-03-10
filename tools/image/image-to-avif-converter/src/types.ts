export const AVIF_MIME_TYPE = 'image/avif' as const

export type AvifSubsample = '420' | '422' | '444'

export type AvifTune = 'auto' | 'psnr' | 'ssim'

export interface AvifEncodeOptions {
  quality: number
  speed: number
  lossless: boolean
  bitDepth: 8
  qualityAlpha?: number
  denoiseLevel?: number
  sharpness?: number
  subsample?: 0 | 1 | 2
  tune?: 0 | 1 | 2
  enableSharpYUV?: boolean
}

export interface AvifConversionOptions {
  scale: number
  quality: number
  speed: number
  lossless: boolean
  alphaQuality?: number
  denoiseLevel?: number
  sharpness?: number
  subsample?: AvifSubsample
  tune?: AvifTune
  enableSharpYuv?: boolean
}

export interface AvifConversionResult {
  file: File
  blob: Blob
  outputName: string
  originalWidth: number
  originalHeight: number
  outputWidth: number
  outputHeight: number
}

export interface AvifEncodeRequest {
  pixels: ArrayBuffer
  width: number
  height: number
  options: AvifEncodeOptions
}

export type AvifEncodeWorkerResult =
  | {
      ok: true
      buffer: ArrayBuffer
    }
  | {
      ok: false
      code: string
    }
