import { ConversionError } from "./errors"

// Bitmap decoding fixes EXIF orientation and chooses the default animation
// frame before canvas rendering; HTMLImageElement may advance while exporting.
export async function rasterize(blob: Blob) {
  if (
    typeof createImageBitmap !== "function" ||
    typeof OffscreenCanvas === "undefined"
  )
    throw new ConversionError({ code: "engineUnavailable" })
  const bitmap = await createImageBitmap(blob, {
    imageOrientation: "from-image",
  })
  let canvas: OffscreenCanvas | undefined
  try {
    const { width, height } = bitmap
    if (!width || !height) throw new Error("Empty image")
    canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext("2d")
    if (!context) throw new ConversionError({ code: "resourceLimit" })
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, width, height)
    context.drawImage(bitmap, 0, 0)
    const png = await canvas.convertToBlob({ type: "image/png" })
    return { width, height, bytes: new Uint8Array(await png.arrayBuffer()) }
  } finally {
    bitmap.close()
    if (canvas) canvas.width = canvas.height = 0
  }
}
