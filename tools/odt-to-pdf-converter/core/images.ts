import { ConversionError, failure } from "./errors"
import { ns, readXml } from "./xml"

export function imageResource(bytes: Uint8Array): Blob | undefined {
  const has = (signature: number[], offset = 0) =>
    signature.every((value, index) => bytes[offset + index] === value)
  const mime = has([137, 80, 78, 71, 13, 10, 26, 10])
    ? "image/png"
    : has([255, 216, 255])
      ? "image/jpeg"
      : has([71, 73, 70, 56])
        ? "image/gif"
        : has([66, 77])
          ? "image/bmp"
          : has([82, 73, 70, 70]) && has([87, 69, 66, 80], 8)
            ? "image/webp"
            : undefined
  if (mime) return new Blob([Uint8Array.from(bytes)], { type: mime })
  let root = true
  readXml(bytes, (tag) => {
    if (
      (root && (tag.local !== "svg" || tag.uri !== ns.svg)) ||
      ["script", "foreignObject", "style", "animate", "set"].includes(tag.local)
    )
      throw new ConversionError("unsupported")
    root = false
    for (const item of Object.values(tag.attributes)) {
      if (
        /^on/i.test(item.local) ||
        (item.local === "href" && !item.value.startsWith("#")) ||
        /@import|\\|\/\*|url\s*\(/i.test(
          item.value.replace(/url\(\s*["']?#[\w.-]+["']?\s*\)/gi, "")
        )
      )
        throw new ConversionError("unsupported")
    }
  })
  return undefined
}

export async function checkImages(images: Blob[]) {
  for (const image of images) {
    try {
      const bitmap = await createImageBitmap(image)
      bitmap.close()
    } catch (error) {
      const problem = failure(error)
      throw problem.code === "resource"
        ? problem
        : new ConversionError("unsupported")
    }
  }
}
