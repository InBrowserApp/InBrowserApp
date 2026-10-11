import { PDFDocument, PDFName, PDFArray, PDFNumber } from "pdf-lib"
import { expect, test } from "vitest"
import { validatePdf } from "./validate-pdf"

async function pdf(width = 720) {
  const document = await PDFDocument.create()
  const page = document.addPage([720, 540])
  const box = PDFArray.withContext(document.context)
  for (const number of [0, 0, width, 540]) box.push(PDFNumber.of(number))
  page.node.set(PDFName.of("MediaBox"), box)
  return Uint8Array.from(await document.save()).buffer
}
test("accepts a complete presentation including an intentionally blank slide", async () => {
  await expect(validatePdf(await pdf(), 1)).resolves.toBeUndefined()
})
test.each([0, 1.5, 2])(
  "rejects a missing or mismatched slide count %s",
  async (pages) => {
    await expect(validatePdf(await pdf(), pages)).rejects.toThrow("unsupported")
  }
)
test.each([0, -1])("rejects invalid slide geometry %s", async (width) => {
  await expect(validatePdf(await pdf(width), 1)).rejects.toThrow("unsupported")
})
test("rejects truncated bytes instead of offering an incomplete download", async () => {
  await expect(validatePdf(new ArrayBuffer(0), 1)).rejects.toThrow(
    "No PDF header"
  )
})
