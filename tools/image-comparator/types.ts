import type english from "./messages/en.json"

export type Messages = typeof english
export type Mode = "slider" | "overlay" | "difference"

export type ImageSource = {
  id: number
  file: File
  bitmap: ImageBitmap
}
