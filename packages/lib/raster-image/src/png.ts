import { imageFilename } from "./filename"
import type { ImageInfo } from "./types"

export function pngFilename(name: string, info: ImageInfo, index: number) {
  return imageFilename(name, info, index, "png")
}
