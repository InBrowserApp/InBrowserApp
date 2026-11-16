import { PDFArray, PDFDocument, PDFName, decodePDFRawStream } from "pdf-lib"
import type { PDFRawStream } from "pdf-lib"
import { expect, test } from "vitest"
import { inspectPdf, watermarkPdf } from "./pdf"
import { DEFAULT_OPTIONS } from "../types"
import { PNG, pdfFixture } from "../test-fixtures"

function streams(doc: PDFDocument, index: number) {
  const contents = doc.getPage(index).node.Contents()! as PDFArray
  const result: string[] = []
  for (let i = 0; i < contents.size(); i++) {
    result.push(
      new TextDecoder().decode(
        decodePDFRawStream(
          doc.context.lookup(contents.get(i)) as PDFRawStream
        ).decode()
      )
    )
  }
  return result
}

test("inspects crop boxes, rotations, and the visible MediaBox intersection", async () => {
  const source = await pdfFixture()
  const pages = await inspectPdf(source)
  expect(pages.map((p) => p.rotation)).toEqual([0, 90, 180, 270])
  expect(pages[0]).toEqual({
    x: 20,
    y: 30,
    width: 550,
    height: 700,
    rotation: 0,
  })
  const doc = await PDFDocument.load(source)
  doc.getPage(0).setCropBox(-10, -10, 100, 100)
  doc.getPage(1).setCropBox(900, 900, 10, 10)
  const clipped = await inspectPdf((await doc.save()).slice().buffer)
  expect(clipped[0]).toMatchObject({ x: 0, y: 0, width: 90, height: 90 })
  expect(clipped[1]).toMatchObject({ x: 0, y: 0, width: 612, height: 792 })
})

test("adds a reusable image only to selected pages and preserves source content, geometry, and metadata", async () => {
  const source = await pdfFixture()
  const original = await PDFDocument.load(source)
  const output = await watermarkPdf(source, [
    { png: PNG, options: DEFAULT_OPTIONS, pages: [1, 3, 4] },
  ])
  const result = await PDFDocument.load(output)
  expect(result.getTitle()).toBe("Original title")
  expect(result.getAuthor()).toBe("Original author")
  expect(result.getPageCount()).toBe(4)
  for (let i = 0; i < 4; i++) {
    expect(result.getPage(i).getCropBox()).toEqual(
      original.getPage(i).getCropBox()
    )
    expect(result.getPage(i).getRotation()).toEqual(
      original.getPage(i).getRotation()
    )
    const before = streams(original, i)
    const after = streams(result, i)
    for (const stream of before) expect(after).toContain(stream)
    expect(after.join("").includes(" Do")).toBe(i !== 1)
  }
  const resource1 = result
    .getPage(0)
    .node.Resources()!
    .lookup(PDFName.of("XObject"))
  const resource3 = result
    .getPage(2)
    .node.Resources()!
    .lookup(PDFName.of("XObject"))
  expect(resource1).toBeDefined()
  expect(resource3).toBeDefined()
})

test("emits tiled image draws and rejects invalid selections/documents", async () => {
  const source = await pdfFixture()
  await expect(watermarkPdf(source, [])).rejects.toThrow("generateError")
  const output = await watermarkPdf(source, [
    { png: PNG, options: { ...DEFAULT_OPTIONS, layout: "tile" }, pages: [2] },
  ])
  const result = await PDFDocument.load(output)
  expect(streams(result, 1).join("").match(/ Do/g)!.length).toBeGreaterThan(1)
  for (const selected of [[], [0], [5], [1, 1], [1.5]]) {
    await expect(
      watermarkPdf(source, [
        { png: PNG, options: DEFAULT_OPTIONS, pages: selected },
      ])
    ).rejects.toThrow("rangeBounds")
  }
  await expect(inspectPdf(new ArrayBuffer(0))).rejects.toThrow(
    "No PDF header found"
  )
  const empty = await PDFDocument.create()
  await expect(
    inspectPdf((await empty.save({ addDefaultPage: false })).slice().buffer)
  ).rejects.toThrow("readError")
})

test("writes independent layers in order with different page ranges and custom coordinates", async () => {
  const source = await pdfFixture()
  const output = await watermarkPdf(source, [
    {
      png: PNG,
      options: { ...DEFAULT_OPTIONS, position: "custom", x: 20, y: 30 },
      pages: [1, 2],
    },
    {
      png: PNG,
      options: {
        ...DEFAULT_OPTIONS,
        position: "custom",
        x: 80,
        y: 75,
        opacity: 60,
      },
      pages: [2, 3],
    },
  ])
  const doc = await PDFDocument.load(output)
  expect(
    [0, 1, 2, 3].map(
      (index) => (streams(doc, index).join("").match(/ Do/g) ?? []).length
    )
  ).toEqual([1, 2, 1, 0])
  expect(doc.getTitle()).toBe("Original title")
})
