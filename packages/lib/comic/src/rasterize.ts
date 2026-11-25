import { ConversionError } from "./errors"

// Bitmap decoding fixes EXIF orientation and chooses the default animation
// frame before canvas rendering; HTMLImageElement may advance while exporting.
export async function decodeImage(blob: Blob) {
  if (typeof createImageBitmap !== "function")
    throw new ConversionError({ code: "engineUnavailable" })
  const bitmap = await createImageBitmap(blob, {
    imageOrientation: "from-image",
  })
  if (!bitmap.width || !bitmap.height) {
    bitmap.close()
    throw new Error("Empty image")
  }
  return bitmap
}

export async function encodeImage(
  bitmap: ImageBitmap,
  options: ImageEncodeOptions,
  background?: string
) {
  if (typeof OffscreenCanvas === "undefined")
    throw new ConversionError({ code: "engineUnavailable" })
  const { width, height } = bitmap
  const canvas = new OffscreenCanvas(width, height)
  try {
    const context = canvas.getContext("2d")
    if (!context) throw new ConversionError({ code: "resourceLimit" })
    if (background) {
      context.fillStyle = background
      context.fillRect(0, 0, width, height)
    }
    context.drawImage(bitmap, 0, 0)
    return await canvas.convertToBlob(options)
  } finally {
    canvas.width = canvas.height = 0
  }
}

export async function rasterize(blob: Blob) {
  const bitmap = await decodeImage(blob)
  try {
    const png = await encodeImage(bitmap, { type: "image/png" }, "#ffffff")
    return {
      width: bitmap.width,
      height: bitmap.height,
      bytes: new Uint8Array(await png.arrayBuffer()),
    }
  } finally {
    bitmap.close()
  }
}
