import { jpegForPdf } from "./jpeg"

type JpegSettings = { maxSide: number; jpegQuality: number }

export async function reencodeImage(
  bytes: Uint8Array,
  format: "jpeg" | "deflate",
  width: number,
  height: number,
  channels: 1 | 3,
  settings: JpegSettings
) {
  const bitmap = await decodeImage(bytes, format, width, height, channels)
  if (!bitmap) return
  try {
    if (bitmap.width !== width || bitmap.height !== height) return

    const ratio = Math.min(1, settings.maxSide / Math.max(width, height))
    const canvas = new OffscreenCanvas(
      Math.max(1, Math.round(width * ratio)),
      Math.max(1, Math.round(height * ratio))
    )
    const context = canvas.getContext("2d", { alpha: false })
    if (!context) throw new Error("Canvas unavailable")
    context.imageSmoothingQuality = "high"
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const jpeg = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: settings.jpegQuality,
    })
    if (jpeg.type !== "image/jpeg") throw new Error("JPEG encoding unavailable")
    return {
      bytes: new Uint8Array(await jpeg.arrayBuffer()),
      width: canvas.width,
      height: canvas.height,
    }
  } finally {
    bitmap.close()
  }
}

async function decodeImage(
  bytes: Uint8Array,
  format: "jpeg" | "deflate",
  width: number,
  height: number,
  channels: 1 | 3
) {
  if (
    typeof createImageBitmap !== "function" ||
    typeof OffscreenCanvas === "undefined"
  ) {
    throw new Error("Image processing unavailable")
  }
  try {
    const data = new Uint8Array(bytes)
    if (format === "jpeg") {
      const jpeg = jpegForPdf(data, width, height, channels)
      if (!jpeg) return
      return await createImageBitmap(jpeg, {
        imageOrientation: "none",
        colorSpaceConversion: "none",
      })
    }

    const samples = await inflateSamples(
      new Blob([data]),
      width * height * channels
    )
    if (!samples) return
    const image = new ImageData(width, height)
    for (
      let offset = 0, pixel = 0;
      offset < samples.length;
      offset += channels, pixel += 4
    ) {
      image.data[pixel] = samples[offset]!
      image.data[pixel + 1] = samples[offset + (channels === 1 ? 0 : 1)]!
      image.data[pixel + 2] = samples[offset + (channels === 1 ? 0 : 2)]!
      image.data[pixel + 3] = 255
    }
    return await createImageBitmap(image)
  } catch {
    // Malformed image data must not prevent use of other images in the PDF.
    return
  }
}

async function inflateSamples(blob: Blob, length: number) {
  const reader = blob
    .stream()
    .pipeThrough(new DecompressionStream("deflate"))
    .getReader()
  const samples = new Uint8Array(length)
  let offset = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) return offset === length ? samples : undefined
      if (offset + value.byteLength > length) return
      samples.set(value, offset)
      offset += value.byteLength
    }
  } finally {
    await reader.cancel()
  }
}
