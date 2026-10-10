export type RasterInfo = {
  format: string
  count: number
  kind: "page" | "variant" | "frame" | "image"
  poster: boolean
}
export type RasterPreview = {
  bytes: Uint8Array<ArrayBuffer>
  mime: "image/png" | "image/jpeg"
  width: number
  height: number
  delay: number
  depth: number
  profile: boolean
}
export type RasterImage = { info: RasterInfo; preview: RasterPreview }
export type RasterImageMessages = Record<
  | "zoomOut"
  | "zoom"
  | "zoomIn"
  | "fit"
  | "actualSize"
  | "reset"
  | "background"
  | "checkerboard"
  | "light"
  | "dark"
  | "artwork"
  | "renderError"
  | "details"
  | "detectedFormat"
  | "dimensions"
  | "duration"
  | "milliseconds"
  | "profile"
  | "present"
  | "absent"
  | "precision"
  | "compatibility"
  | "panHint"
  | "licenses"
  | "previous"
  | "next"
  | "page"
  | "variant"
  | "frame"
  | "image"
  | "count"
  | "poster"
  | "animation"
  | "loadingItem"
  | "itemError",
  string
>
