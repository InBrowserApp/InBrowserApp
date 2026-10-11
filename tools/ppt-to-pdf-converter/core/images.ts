import { ConversionError, failure } from "./errors"

export function rasterImage(type: number, bytes: Uint8Array) {
  const png = type === 0xf01e
  if (!png && type !== 0xf01d && type !== 0xf02a) return
  const signature = png ? [137, 80, 78, 71, 13, 10, 26, 10] : [255, 216, 255]
  // OfficeArt BLIPs have one or two 16-byte UIDs, followed by a tag byte.
  const offset = [17, 33].find((start) =>
    signature.every((value, index) => bytes[start + index] === value)
  )
  if (offset === undefined) throw new ConversionError("unsupported")
  return new Blob([Uint8Array.from(bytes.subarray(offset))], {
    type: png ? "image/png" : "image/jpeg",
  })
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
