import { PDFDocument } from "pdf-lib"
import { ConversionError } from "./errors"

export async function validatePdf(
  bytes: ArrayBuffer,
  pages: number,
  dimensions: ({ width: number; height: number } | null)[]
) {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false })
  if (
    !Number.isInteger(pages) ||
    pages < 1 ||
    pdf.getPageCount() !== pages ||
    !Array.isArray(dimensions) ||
    dimensions.length !== pages
  )
    throw new ConversionError("unsupported")
  for (const [index, page] of pdf.getPages().entries()) {
    const actual = page.getSize()
    const expected = dimensions[index]
    if (expected === undefined) throw new ConversionError("unsupported")
    for (const key of ["width", "height"] as const) {
      if (
        !Number.isFinite(actual[key]) ||
        actual[key] <= 0 ||
        (expected !== null &&
          (!Number.isFinite(expected[key]) ||
            expected[key] <= 0 ||
            Math.abs(actual[key] - expected[key]) > 0.1))
      )
        throw new ConversionError("unsupported")
    }
  }
}
