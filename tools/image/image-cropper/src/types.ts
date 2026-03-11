export interface ImageSource {
  file: File
  width: number
  height: number
  mimeType: string
  extension: string
  hasAlpha: boolean
}

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export type CropPresetID = 'free' | '1:1' | '4:3' | '3:4' | '16:9' | '9:16' | '4:5' | '3:2' | '2:3'

export interface CropPreset {
  id: CropPresetID
  ratio: number | null
}

export type CropHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'

export interface ExportOptions {
  format: 'original' | 'png' | 'jpeg' | 'webp'
  quality: number
  background: string
  targetWidth: number | null
  targetHeight: number | null
}

export interface CropResult {
  blob: Blob
  outputName: string
  outputWidth: number
  outputHeight: number
  outputMimeType: string
  cropWidth: number
  cropHeight: number
}

export interface PixelCropRect {
  x: number
  y: number
  width: number
  height: number
}
