export type ResizeAlgorithm = 'browser-high' | 'bicubic' | 'bilinear' | 'lanczos3' | 'nearest'

export type ResizeOutputFormat = 'original' | 'png' | 'jpeg' | 'webp'

export interface ResizeOptions {
  width: number
  height: number
  keepAspectRatio: boolean
  allowUpscale: boolean
  algorithm: ResizeAlgorithm
  outputFormat: ResizeOutputFormat
  quality: number
}

export interface ResizeResult {
  blob: Blob
  outputName: string
  originalWidth: number
  originalHeight: number
  outputWidth: number
  outputHeight: number
  mimeType: string
}

export interface ImageDimensions {
  width: number
  height: number
}
