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
  mime: "image/png" | "image/jpeg"
  width: number
  height: number
  delay: number
  depth: number
  profile: boolean
}
export type JpegOptions = { quality: number; background: string }
export type OpenedImage = { info: ImageInfo; preview: Preview }
export type Request = { id: number; jpeg?: JpegOptions } & (
  | { type: "open"; file: File }
  | { type: "render"; index: number }
)
export type Reply = { id: number } & (
  | { type: "opened"; result: OpenedImage }
  | { type: "rendered"; preview: Preview }
  | { type: "error"; failure: Failure }
)
