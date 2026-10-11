import { PDFDocument } from "pdf-lib"
import { ConversionError } from "./errors"

export async function validatePdf(bytes: ArrayBuffer, pages: number) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  if (!Number.isInteger(pages) || pages < 1 || pdf.getPageCount() !== pages)
    throw new ConversionError("unsupported")
  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize()
    if (![width, height].every((size) => Number.isFinite(size) && size > 0))
      throw new ConversionError("unsupported")
  }
}
