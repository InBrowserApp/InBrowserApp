export type GifLoopMode = 'inherit' | 'infinite' | 'custom'

export interface GifToAnimatedWebpOptions {
  scale: number
  speed: number
  loopMode: GifLoopMode
  loopCount?: number
}

export interface GifToAnimatedWebpResult {
  file: File
  blob: Blob
  outputName: string
  originalWidth: number
  originalHeight: number
  outputWidth: number
  outputHeight: number
}
