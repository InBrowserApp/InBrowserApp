import { readFileSync } from "node:fs"
import { PDFDocument, PDFName, PDFNumber } from "pdf-lib"
import { describe, expect, it } from "vitest"

import { addArchivePage, saveArchive, type Profile } from "./archive"
import { validateArchive } from "./validate"

const jpeg = new Uint8Array(
  readFileSync("tools/pdf-to-pdfa-converter/fixtures/page.jpg")
)

async function archive(width = 612, height = 792) {
  const pdf = await PDFDocument.create({ updateMetadata: false })
  await addArchivePage(pdf, jpeg, width, height)
  return pdf
}

function replaceByte(
  bytes: Uint8Array,
  needle: string,
  offset: number,
  value: number
) {
  const start = new TextDecoder("latin1").decode(bytes).indexOf(needle)
  expect(start).toBeGreaterThan(-1)
  bytes[start + offset] = value
}

describe("PDF/A archive output", () => {
  it.each<Profile>([1, 2])("writes and checks PDF/A-%ib", async (profile) => {
    const pdf = await archive()
    await addArchivePage(pdf, jpeg, 225.375, 418.875)
    const bytes = await saveArchive(pdf, profile)
    await expect(validateArchive(bytes, profile, 2)).resolves.toBe(true)
    await expect(validateArchive(bytes, profile, 1)).resolves.toBe(false)
    await expect(
      validateArchive(bytes, profile === 1 ? 2 : 1, 2)
    ).resolves.toBe(false)
    const parsed = await PDFDocument.load(bytes, { updateMetadata: false })
    expect(parsed.getPages().map((page) => page.getSize())).toEqual([
      { width: 612, height: 792 },
      { width: 225.375, height: 418.875 },
    ])
  })

  it("checks the declared PDF/A part in the serialized metadata", async () => {
    const bytes = await saveArchive(await archive(), 2)
    const element = "<pdfaid:part>2"
    replaceByte(bytes, element, element.length - 1, 0x31)
    await expect(validateArchive(bytes, 2, 1)).resolves.toBe(false)
  })

  it("checks the embedded sRGB profile", async () => {
    const bytes = await saveArchive(await archive(), 2)
    replaceByte(bytes, "acsp", 0, 0)
    await expect(validateArchive(bytes, 2, 1)).resolves.toBe(false)
  })

  it("checks the JPEG format and image dictionary", async () => {
    const bytes = await saveArchive(await archive(), 2)
    replaceByte(bytes, "/Width 2", 7, 0x33)
    await expect(validateArchive(bytes, 2, 1)).resolves.toBe(false)
  })

  it("rejects extra page features", async () => {
    const pdf = await archive()
    pdf.getPage(0).node.set(PDFName.of("Rotate"), PDFNumber.of(90))
    await expect(
      validateArchive(await saveArchive(pdf, 2), 2, 1)
    ).resolves.toBe(false)
  })

  it.each([
    [2.99, 720],
    [300, 14_400.01],
  ])(
    "rejects a nonstandard archive page size %s by %s",
    async (width, height) => {
      const bytes = await saveArchive(await archive(width, height), 2)
      await expect(validateArchive(bytes, 2, 1)).resolves.toBe(false)
    }
  )

  it("rejects malformed files", async () => {
    await expect(validateArchive(new Uint8Array(), 2, 1)).resolves.toBe(false)
  })
})
