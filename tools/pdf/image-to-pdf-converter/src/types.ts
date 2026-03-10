export type PageSizePreset = 'a3' | 'a4' | 'a5' | 'b5' | 'letter' | 'legal' | 'tabloid'

export type PageOrientation = 'auto' | 'portrait' | 'landscape'

export type FitMode = 'contain' | 'cover'

export type QualityPreset = 'best' | 'balanced' | 'small'

export type Rotation = 0 | 90 | 180 | 270

export type AddFileResult = 'added' | 'duplicate' | 'invalid-image'

export type GenerateErrorCode = 'invalid-image' | 'canvas-unavailable' | 'generate-failed'

export interface ConverterOptions {
  pageSize: PageSizePreset
  pageOrientation: PageOrientation
  fitMode: FitMode
  marginMm: number
  qualityPreset: QualityPreset
}

export interface ImageQueueItem {
  id: string
  file: File
  name: string
  size: number
  previewUrl: string
  width: number
  height: number
  rotation: Rotation
}

export interface PageDimensions {
  width: number
  height: number
}

export interface ImagePlacement {
  x: number
  y: number
  width: number
  height: number
}

export interface PdfGenerationProgress {
  completed: number
  total: number
}

export interface PdfGenerationResult {
  blob: Blob
  fileName: string
  pageCount: number
}
