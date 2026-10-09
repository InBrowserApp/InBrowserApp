import type messages from "./messages/en.json"

export type Messages = typeof messages
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
  png: Uint8Array<ArrayBuffer>
  width: number
  height: number
  delay: number
  depth: number
  profile: boolean
}
export type OpenedImage = { info: ImageInfo; preview: Preview }
export type Request = { id: number } & (
  | { type: "open"; file: File }
  | { type: "render"; index: number }
)
export type Reply = { id: number } & (
  | { type: "opened"; result: OpenedImage }
  | { type: "rendered"; preview: Preview }
  | { type: "error"; failure: Failure }
)
