export type GifLoopMode = 'inherit' | 'infinite' | 'custom'

export interface GifToApngOptions {
  scale: number
  speed: number
  loopMode: GifLoopMode
  loopCount?: number
  optimize: boolean
  optimizeLevel: number
}

export interface GifToApngResult {
  file: File
  blob: Blob
  outputName: string
  originalWidth: number
  originalHeight: number
  outputWidth: number
  outputHeight: number
}
