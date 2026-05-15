type AvifEncodeOptions = Readonly<{
  bitDepth: 8
  lossless: boolean
  quality: number
  speed: number
}>

type AvifEncodeRequest = Readonly<{
  height: number
  options: AvifEncodeOptions
  pixels: ArrayBuffer
  width: number
}>

type AvifWorkerRequestMessage = Readonly<{
  id: number
  request: AvifEncodeRequest
}>

type AvifWorkerResponseMessage =
  | Readonly<{
      buffer: ArrayBuffer
      id: number
      ok: true
    }>
  | Readonly<{
      code: string
      id: number
      ok: false
    }>

export type {
  AvifEncodeOptions,
  AvifEncodeRequest,
  AvifWorkerRequestMessage,
  AvifWorkerResponseMessage,
}
