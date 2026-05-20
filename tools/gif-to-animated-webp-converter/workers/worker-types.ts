import type { GifToAnimatedWebpEncodedResult } from "../core/animated-webp-conversion"
import type { GifToAnimatedWebpOptions } from "../core/gif-frame-rendering"

type GifToAnimatedWebpWorkerRequest = Readonly<{
  id: number
  input: ArrayBuffer
  options: GifToAnimatedWebpOptions
  outputName: string
}>

type GifToAnimatedWebpWorkerResponse =
  | Readonly<{
      id: number
      ok: true
      result: Omit<GifToAnimatedWebpEncodedResult, "bytes"> &
        Readonly<{
          buffer: ArrayBuffer
        }>
    }>
  | Readonly<{
      id: number
      message: string
      ok: false
    }>

export type { GifToAnimatedWebpWorkerRequest, GifToAnimatedWebpWorkerResponse }
