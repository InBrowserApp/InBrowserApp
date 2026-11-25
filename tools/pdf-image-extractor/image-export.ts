import { ImageKind } from "pdfjs-dist"
import type { PdfRaster } from "@workspace/pdf-reader/original-images"

export { openOriginalImages } from "@workspace/pdf-reader/original-images"
export type { PdfRaster } from "@workspace/pdf-reader/original-images"

export function encodePng(
  { data, kind, width, height }: PdfRaster,
  storedWidth = width,
  storedHeight = height
) {
  const canvas = new OffscreenCanvas(width, height)
  const context = canvas.getContext("2d")!
  const pixels = context.createImageData(width, height)
  const rgba = pixels.data

  if (kind === ImageKind.RGBA_32BPP) {
    rgba.set(data)
  } else if (kind === ImageKind.RGB_24BPP) {
    for (
      let source = 0, target = 0;
      target < rgba.length;
      source += 3, target += 4
    ) {
      rgba[target] = data[source]!
      rgba[target + 1] = data[source + 1]!
      rgba[target + 2] = data[source + 2]!
      rgba[target + 3] = 255
    }
  } else if (kind === ImageKind.GRAYSCALE_1BPP) {
    const stride = Math.ceil(width / 8)
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const byte = data[row * stride + (column >> 3)]!
        const shade = byte & (0x80 >> (column & 7)) ? 255 : 0
        const target = (row * width + column) * 4
        rgba.fill(shade, target, target + 3)
        rgba[target + 3] = 255
      }
    }
  } else {
    throw new Error("Unsupported PDF raster data")
  }

  context.putImageData(pixels, 0, 0)
  if (storedWidth === width && storedHeight === height) {
    return canvas.convertToBlob({ type: "image/png" })
  }
  // PDF.js can decode at a larger size when the image has a larger mask.
  const nativeCanvas = new OffscreenCanvas(storedWidth, storedHeight)
  nativeCanvas
    .getContext("2d")!
    .drawImage(canvas, 0, 0, storedWidth, storedHeight)
  return nativeCanvas.convertToBlob({ type: "image/png" })
}
