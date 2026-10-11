import { text } from "./text"
import type { Bundle } from "../types"
const rasterTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"]
export function imageData(bundle: Bundle) {
  const mime = rasterTypes.find((type) => Object.hasOwn(bundle, type))
  return mime
    ? `data:${mime};base64,${text(bundle[mime]).replace(/\s/g, "")}`
    : null
}
