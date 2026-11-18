import type { Size } from "./core/layout"

export type Messages = typeof import("./messages/en.json")
export type SourceImage = Size & {
  name: string
  image: HTMLImageElement
}
