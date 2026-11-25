import { PDFArray, PDFDocument, PDFName, PDFRawStream, PDFRef } from "pdf-lib"
import type { PDFPageProxy } from "pdfjs-dist"

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

export async function getPageImage(
  page: PDFPageProxy,
  id: string,
  signal: AbortSignal
) {
  signal.throwIfAborted()
  const objects = id.startsWith("g_") ? page.commonObjs : page.objs
  let abort!: () => void
  try {
    return await new Promise<PdfRaster | null>((resolve, reject) => {
      abort = () => reject(signal.reason)
      signal.addEventListener("abort", abort, { once: true })
      objects.get(id, resolve, reject)
    })
  } finally {
    signal.removeEventListener("abort", abort)
  }
}
