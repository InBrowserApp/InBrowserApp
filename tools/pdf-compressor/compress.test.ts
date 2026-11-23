import {
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
  degrees,
} from "pdf-lib"
import { beforeEach, expect, test, vi } from "vitest"

import { compressPdf } from "./compress"
import { reencodeImage } from "./image-codec"

vi.mock("./image-codec", () => ({ reencodeImage: vi.fn() }))

const name = PDFName.of

beforeEach(() => {
  vi.resetAllMocks()
})

async function asFile(pdf: PDFDocument) {
  return new File(
    [new Uint8Array(await pdf.save({ useObjectStreams: false }))],
    "scan.pdf",
    {
      type: "application/pdf",
    }
  )
}

function embedImage(pdf: PDFDocument, options = {}) {
  return pdf.context.register(
    pdf.context.stream(new Uint8Array(20_000).fill(1), {
      Type: "XObject",
      Subtype: "Image",
      Width: 200,
      Height: 100,
      Filter: "DCTDecode",
      ColorSpace: "DeviceRGB",
      BitsPerComponent: 8,
      ...options,
    })
  )
}

function inspectImage(pdf: PDFDocument, ref: ReturnType<typeof embedImage>) {
  const stream = pdf.context.lookup(ref)
  if (!(stream instanceof PDFRawStream))
    throw new Error("Expected a PDF stream")
  return stream
}

test("shrinks a shared scan image at its original reference and preserves page streams and rotation", async () => {
  const pdf = await PDFDocument.create()
  pdf.setTitle("Sample scan")
  const firstPage = pdf.addPage([300, 400])
  firstPage.drawText("Searchable text")
  firstPage.setRotation(degrees(90))
  const secondPage = pdf.addPage()
  secondPage.drawText("Second page")
  const ref = embedImage(pdf)
  firstPage.node.setXObject(name("Scan"), ref)
  secondPage.node.setXObject(name("Scan"), ref)
  const original = await asFile(pdf)
  const originalDocument = await PDFDocument.load(await original.arrayBuffer())
  vi.mocked(reencodeImage).mockResolvedValue({
    bytes: new Uint8Array([255, 216, 255, 217]),
    width: 100,
    height: 50,
  })

  const result = await compressPdf(original, "small")
  expect(result.status).toBe("compressed")
  if (result.status !== "compressed")
    throw new Error("Expected compressed scan")
  expect(result.blob.size).toBeLessThan(original.size)
  expect(result.blob.type).toBe("application/pdf")
  expect(reencodeImage).toHaveBeenCalledExactlyOnceWith(
    expect.any(Uint8Array),
    "jpeg",
    200,
    100,
    3,
    { jpegQuality: 0.6, maxSide: 1100 }
  )

  const output = await PDFDocument.load(await result.blob.arrayBuffer())
  expect(output.getTitle()).toBe("Sample scan")
  expect(output.getPageCount()).toBe(2)
  expect(output.getPage(0).getRotation().angle).toBe(90)
  expect(output.getPage(0).getSize()).toEqual(firstPage.getSize())
  for (let index = 0; index < 2; index += 1) {
    const page = output.getPage(index)
    expect(
      page.node.Resources()?.lookup(name("XObject"), PDFDict).get(name("Scan"))
    ).toBe(ref)
    expect(page.node.Contents()?.toString()).toBe(
      originalDocument.getPage(index).node.Contents()?.toString()
    )
    for (const [
      contentRef,
      content,
    ] of originalDocument.context.enumerateIndirectObjects()) {
      if (!(content instanceof PDFRawStream) || contentRef === ref) continue
      expect(inspectImage(output, contentRef).getContents()).toEqual(
        content.getContents()
      )
    }
  }
  const image = inspectImage(output, ref)
  expect(image.getContents()).toEqual(new Uint8Array([255, 216, 255, 217]))
  expect(image.dict.lookup(name("Width"), PDFNumber).asNumber()).toBe(100)
  expect(image.dict.lookup(name("Height"), PDFNumber).asNumber()).toBe(50)
})

test("does not recompress transparency masks, filter chains, non-standard colors or oversized pixels", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage()
  const mask = embedImage(pdf, { ColorSpace: "DeviceGray" })
  embedImage(pdf, { SMask: mask })
  embedImage(pdf, { Filter: ["ASCII85Decode", "DCTDecode"] })
  embedImage(pdf, { ColorSpace: "DeviceCMYK" })
  embedImage(pdf, { Width: 100_000, Height: 100_000 })
  embedImage(pdf, { BitsPerComponent: 1 })
  embedImage(pdf, { Decode: [1, 0] })
  embedImage(pdf, { Width: 100.5 })
  expect(await compressPdf(await asFile(pdf), "balanced")).toEqual({
    status: "noSavings",
  })
  expect(reencodeImage).not.toHaveBeenCalled()
})

test("keeps the input when candidate images fail to encode or get bigger", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage().drawText("Already small")
  expect(await compressPdf(await asFile(pdf), "quality")).toEqual({
    status: "noSavings",
  })
  embedImage(pdf, { ColorSpace: "DeviceGray", Filter: "FlateDecode" })
  embedImage(pdf)
  vi.mocked(reencodeImage)
    .mockResolvedValueOnce(undefined)
    .mockResolvedValueOnce({
      bytes: new Uint8Array(21_000),
      width: 200,
      height: 100,
    })
  expect(await compressPdf(await asFile(pdf), "quality")).toEqual({
    status: "noSavings",
  })
  expect(reencodeImage).toHaveBeenNthCalledWith(
    1,
    expect.any(Uint8Array),
    "deflate",
    200,
    100,
    1,
    {
      maxSide: 2400,
      jpegQuality: 0.86,
    }
  )
})

test("leaves PDF byte ranges covered by a digital signature untouched", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage()
  embedImage(pdf)
  pdf.context.register(
    pdf.context.obj({ ByteRange: [0, 100, 200, 300], Contents: "signature" })
  )
  expect(await compressPdf(await asFile(pdf), "balanced")).toEqual({
    status: "signed",
  })
  expect(reencodeImage).not.toHaveBeenCalled()
})

test("preserves a directly embedded signature dictionary", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage()
  embedImage(pdf)
  pdf.catalog.set(
    name("AcroForm"),
    pdf.context.obj({
      Fields: [
        {
          FT: "Sig",
          V: { ByteRange: [0, 100, 200, 300], Contents: "signature" },
        },
      ],
    })
  )
  expect(await compressPdf(await asFile(pdf), "balanced")).toEqual({
    status: "signed",
  })
  expect(reencodeImage).not.toHaveBeenCalled()
})

test("keeps PDF/A and PDF 2.0 files in their original versions", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage()
  embedImage(pdf)
  const xmp = pdf.context.stream(
    'xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"'
  )
  pdf.catalog.set(name("Metadata"), pdf.context.register(xmp))
  expect(await compressPdf(await asFile(pdf), "balanced")).toEqual({
    status: "noSavings",
  })
  pdf.catalog.delete(name("Metadata"))
  pdf.catalog.set(name("Version"), name("2.0"))
  expect(await compressPdf(await asFile(pdf), "balanced")).toEqual({
    status: "noSavings",
  })
  expect(reencodeImage).not.toHaveBeenCalled()
})

test("keeps gray images that rely on a default PDF color space", async () => {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage()
  const image = embedImage(pdf, { ColorSpace: "DeviceGray" })
  page.node.setXObject(name("Scan"), image)
  page.node.Resources()?.set(
    name("ColorSpace"),
    pdf.context.obj({
      DefaultGray: ["CalGray", { WhitePoint: [1, 1, 1] }],
    })
  )
  expect(await compressPdf(await asFile(pdf), "balanced")).toEqual({
    status: "noSavings",
  })
  expect(reencodeImage).not.toHaveBeenCalled()
})

test("keeps an incremental PDF when the parser exposes two generations of an object ID", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage()
  const image = embedImage(pdf)
  const original = await asFile(pdf)
  pdf.context.assign(PDFRef.of(image.objectNumber, 1), pdf.context.obj({}))
  const load = vi.spyOn(PDFDocument, "load").mockResolvedValueOnce(pdf)
  expect(await compressPdf(original, "balanced")).toEqual({
    status: "noSavings",
  })
  expect(reencodeImage).not.toHaveBeenCalled()
  load.mockRestore()
})

test("keeps earlier revisions from being reserialized", async () => {
  const pdf = await PDFDocument.create()
  pdf.addPage()
  embedImage(pdf)
  const original = await asFile(pdf)
  const incremental = new File(
    [original, "\nstartxref\n16\n%%EOF\n"],
    original.name
  )
  expect(await compressPdf(incremental, "balanced")).toEqual({
    status: "noSavings",
  })
  expect(reencodeImage).not.toHaveBeenCalled()
})

test("distinguishes unreadable and encrypted PDFs", async () => {
  expect(
    await compressPdf(new File(["invalid"], "invalid.pdf"), "balanced")
  ).toEqual({
    status: "invalidPdf",
  })
  const pdf = await PDFDocument.create()
  pdf.addPage()
  pdf.context.trailerInfo.Encrypt = pdf.context.register(
    pdf.context.obj({ Filter: "Standard" })
  )
  expect(await compressPdf(await asFile(pdf), "balanced")).toEqual({
    status: "encryptedPdf",
  })
})
