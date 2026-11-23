export type Failure =
  | "emptyFile"
  | "unsupported"
  | "sequence"
  | "invalid"
  | "resourceLimit"
  | "engineError"
export type SourceKind = {
  format:
    | "JPEG"
    | "PNG"
    | "GIF"
    | "BMP"
    | "WEBP"
    | "AVIF"
    | "HEIC"
    | "JXL"
    | "TIFF"
    | "ICO"
    | "JP2"
    | "J2K"
  poster: boolean
}
export type ImageInfo = {
  format: string
  count: number
  kind: "page" | "variant" | "frame" | "image"
  poster: boolean
}
export type Preview = {
  bytes: Uint8Array<ArrayBuffer>
  mime: "image/png" | "image/jpeg" | "image/webp"
  width: number
  height: number
  fullWidth: number
  fullHeight: number
  delay: number
  depth: number
  profile: boolean
}
export type ImageTransform = {
  rotation?: 0 | 90 | 180 | 270
  maxDimension?: number
}
export type JpegOptions = { quality: number; background: string }
export type ImageOutputOptions =
  | JpegOptions
  | { format: "webp"; quality: number }
export type OpenedImage = { info: ImageInfo; preview: Preview }
export type Request = { id: number } & (
  | { type: "inspect"; file: File }
  | { type: "open"; file: File; jpeg?: JpegOptions }
  | {
      type: "render"
      index: number
      output?: ImageOutputOptions
      transform?: ImageTransform
    }
)
export type Reply = { id: number } & (
  | { type: "inspected"; info: ImageInfo }
  | { type: "opened"; result: OpenedImage }
  | { type: "rendered"; preview: Preview }
  | { type: "error"; failure: Failure }
)
