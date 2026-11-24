import { PDFArray, PDFDocument, PDFName, PDFRawStream, PDFRef } from "pdf-lib"
import { ImageKind } from "pdfjs-dist"

export type PdfRaster = {
  width: number
  height: number
  kind: number
  data: Uint8Array | Uint8ClampedArray
  ref?: string
}

export async function openOriginalImages(data: Uint8Array) {
  // PDF.js provides the paint order and decoded pixels. pdf-lib provides the
  // encoded JPEG bytes using the PDF object reference reported by PDF.js.
  const pdf = await PDFDocument.load(data, { updateMetadata: false }).catch(
    () => undefined
  )
  return (ref: string): Blob | undefined => {
    const [, object, generation] = /^(\d+)R(\d*)$/.exec(ref) ?? []
    if (!pdf || !object) return
    const image = pdf.context.lookup(
      PDFRef.of(Number(object), Number(generation))
    )
    if (!(image instanceof PDFRawStream)) return

    const { dict } = image
    const get = (key: string) => dict.lookup(PDFName.of(key))
    const filter = get("Filter")
    const encoding =
      filter instanceof PDFArray && filter.size() === 1
        ? filter.lookup(0)
        : filter
    const color = get("ColorSpace")
    // These PDF features can change the pixels or transparency of a JPEG.
    if (
      encoding !== PDFName.of("DCTDecode") ||
      (color !== PDFName.of("DeviceRGB") &&
        color !== PDFName.of("DeviceGray")) ||
      ["SMask", "SMaskInData", "Mask", "Decode", "DecodeParms"].some((key) =>
        dict.has(PDFName.of(key))
      )
    )
      return

    const bytes = image.getContents()
    // A PDF decoder can scan past junk before the marker; a browser's JPEG
    // decoder may reject the same stream as a standalone image file.
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return
    return new Blob([bytes.slice()], { type: "image/jpeg" })
  }
}

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
