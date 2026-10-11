import { PDFDocument } from "pdf-lib"
import { expect, test } from "vitest"
import { validatePdf } from "./validate-pdf"
async function document() {
  const pdf = await PDFDocument.create()
  pdf.addPage([200, 300])
  pdf.addPage([400, 200])
  return (await pdf.save()).buffer as ArrayBuffer
}
const dimensions = [
  { width: 200, height: 300 },
  { width: 400, height: 200 },
]
test("validates native page count, order and mixed paper dimensions", async () => {
  await expect(
    validatePdf(await document(), 2, dimensions)
  ).resolves.toBeUndefined()
})
test.each([0, 1, 3, 1.5, NaN])(
  "rejects a partial export or invalid page count %s",
  async (pages) => {
    await expect(
      validatePdf(await document(), pages, dimensions)
    ).rejects.toThrow("unsupported")
  }
)
test.each([
  undefined,
  [],
  [{ width: 200, height: 300 }],
  [...dimensions].reverse(),
  [{ width: NaN, height: 300 }, dimensions[1]],
  [{ width: 0, height: 300 }, dimensions[1]],
])("rejects absent or inconsistent native dimensions", async (sizes) => {
  await expect(
    validatePdf(await document(), 2, sizes as typeof dimensions)
  ).rejects.toThrow("unsupported")
})

test("retains an automatic blank page whose paper size is supplied by PDF", async () => {
  await expect(
    validatePdf(await document(), 2, [null, dimensions[1]!])
  ).resolves.toBeUndefined()
})
test("rejects sparse native page information and invalid PDF paper dimensions", async () => {
  const sparse: typeof dimensions = []
  sparse.length = 2
  await expect(validatePdf(await document(), 2, sparse)).rejects.toThrow(
    "unsupported"
  )
  const pdf = await PDFDocument.create()
  pdf.addPage([0, 200])
  await expect(
    validatePdf((await pdf.save()).buffer as ArrayBuffer, 1, [null])
  ).rejects.toThrow("unsupported")
})
