/* c8 ignore file */
export type WatermarkMode = 'text' | 'image'
export type WatermarkFontFamily = 'sans-serif' | 'serif' | 'monospace'

export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type WatermarkImageFormat = 'png' | 'jpg'

export type ApplyWatermarkPayload = {
  file: File
  pages: number[]
  mode: WatermarkMode
  text: string
  fontFamily: WatermarkFontFamily
  fontSize: number
  color: string
  opacity: number
  rotation: number
  position: WatermarkPosition
  offsetX: number
  offsetY: number
  imageFile: File | null
  imageScale: number
  outputFileName: string
}

export type ApplyWatermarkWorkerSuccess = {
  ok: true
  result: {
    file: {
      name: string
      blob: Blob
    }
  }
}

export type ApplyWatermarkWorkerError = {
  ok: false
  code: string
}

export type ApplyWatermarkWorkerResponse = ApplyWatermarkWorkerSuccess | ApplyWatermarkWorkerError
