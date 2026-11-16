import type messages from "../messages/en.json"
import type { Dimensions } from "../core/crop"

export type Messages = { [Key in keyof typeof messages]: string }
export type ImageSource = Dimensions & {
  image: CanvasImageSource
  dispose: () => void
}
export type OutputFormat = "image/png" | "image/jpeg" | "image/webp"
export type CropResult = Dimensions & {
  blob: Blob
  name: string
}
