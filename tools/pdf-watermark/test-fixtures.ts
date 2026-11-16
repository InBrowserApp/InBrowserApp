import { PDFDocument, degrees, rgb } from "pdf-lib"

const PNG = Uint8Array.from(
  atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg=="
  ),
  (c) => c.charCodeAt(0)
).buffer

async function pdfFixture() {
  const doc = await PDFDocument.create()
  doc.setTitle("Original title")
  doc.setAuthor("Original author")
  for (const rotation of [0, 90, 180, 270]) {
    const page = doc.addPage([612, 792])
    page.drawText(`Original page ${rotation}`, {
      x: 60,
      y: 700,
      size: 24,
      color: rgb(0.1, 0.2, 0.3),
    })
    page.setCropBox(20, 30, 550, 700)
    page.setRotation(degrees(rotation))
  }
  return (await doc.save()).slice().buffer
}

export { PNG, pdfFixture }
