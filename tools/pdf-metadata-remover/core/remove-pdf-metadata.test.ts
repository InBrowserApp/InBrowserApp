import { describe, expect, it } from "vitest"
import { PDFDict, PDFDocument, PDFName, PDFRef, PDFString } from "pdf-lib"
import { removePdfMetadata } from "./remove-pdf-metadata"

describe("remove PDF metadata", () => {
  it("removes document properties, XMP, IDs, and their unreferenced objects", async () => {
    const source = await PDFDocument.create()
    const page = source.addPage([360, 500])
    page.drawText("Example proposal")
    source.setTitle("Internal project title")
    source.setAuthor("Private author")
    source.setSubject("Draft proposal")
    source.setKeywords(["confidential"])
    const { context } = source
    const custom = context.register(PDFString.of("Private custom value"))
    source.context
      .lookup(context.trailerInfo.Info, PDFDict)
      .set(PDFName.of("Company"), custom)
    const metadata = context.register(
      context.stream("<xmpmeta>private XMP marker</xmpmeta>", {
        Type: "Metadata",
        Subtype: "XML",
      })
    )
    source.catalog.set(PDFName.of("Metadata"), metadata)
    const orphan = context.register(
      context.stream("previous revision metadata")
    )
    context.trailerInfo.ID = context.obj([
      PDFString.of("private ID"),
      PDFString.of("private ID"),
    ])

    const original = await source.save({ useObjectStreams: false })
    const output = await removePdfMetadata(original)
    const cleaned = await PDFDocument.load(output, { updateMetadata: false })

    expect(cleaned.context.trailerInfo.Info).toBeUndefined()
    expect(cleaned.context.trailerInfo.ID).toBeUndefined()
    expect(cleaned.catalog.has(PDFName.of("Metadata"))).toBe(false)
    for (const ref of [context.trailerInfo.Info, metadata, custom, orphan]) {
      expect(cleaned.context.lookup(ref)).toBeUndefined()
    }
    expect(new TextDecoder().decode(output)).not.toContain("private XMP marker")
    expect(cleaned.getPageCount()).toBe(1)
    expect(cleaned.getPage(0).getSize()).toEqual({ width: 360, height: 500 })
    expect(cleaned.getPage(0).node.Contents()).toBeDefined()
    expect(source.getAuthor()).toBe("Private author")
  })

  it("keeps referenced annotations, outlines, and form values", async () => {
    const source = await PDFDocument.create({ updateMetadata: false })
    const page = source.addPage()
    const { context } = source
    const comment = context.register(
      context.obj({
        Type: "Annot",
        Subtype: "Text",
        Rect: [10, 10, 30, 30],
        Contents: PDFString.of("Keep this comment"),
      })
    )
    page.node.addAnnot(comment)
    const outlines = context.register(
      context.obj({ Type: "Outlines", Count: 0 })
    )
    source.catalog.set(PDFName.of("Outlines"), outlines)
    source.catalog.set(PDFName.of("DanglingReference"), PDFRef.of(9000))
    const field = source.getForm().createTextField("name")
    field.addToPage(page)
    field.setText("Example form value")

    const output = await removePdfMetadata(await source.save())
    const cleaned = await PDFDocument.load(output, { updateMetadata: false })
    expect(cleaned.getPage(0).node.Annots()?.asArray()).toContain(comment)
    expect(
      cleaned.context
        .lookup(comment, PDFDict)
        .get(PDFName.of("Contents"))
        ?.toString()
    ).toBe("(Keep this comment)")
    expect(cleaned.catalog.get(PDFName.of("Outlines"))).toBe(outlines)
    expect(cleaned.getForm().getTextField("name").getText()).toBe(
      "Example form value"
    )
  })

  it("preserves the effective version of a PDF 2.0 document", async () => {
    const source = await PDFDocument.create()
    source.addPage()
    const bytes = await source.save()
    bytes.set(new TextEncoder().encode("%PDF-2.0"))
    const cleaned = await PDFDocument.load(await removePdfMetadata(bytes), {
      updateMetadata: false,
    })
    expect(cleaned.catalog.get(PDFName.of("Version"))).toBe(PDFName.of("2.0"))
  })

  it("rejects a PDF with no pages", async () => {
    const source = await PDFDocument.create()
    const bytes = await source.save({ addDefaultPage: false })
    await expect(removePdfMetadata(bytes)).rejects.toThrow("PDF has no pages")
  })

  it("rejects non-PDF bytes and encrypted input", async () => {
    await expect(removePdfMetadata(new Uint8Array(3))).rejects.toThrow(
      /No PDF header found/
    )

    const source = await PDFDocument.create()
    source.addPage()
    source.context.trailerInfo.Encrypt = source.context.register(
      source.context.obj({ Filter: "Standard" })
    )
    await expect(removePdfMetadata(await source.save())).rejects.toThrow(
      /is encrypted/
    )
  })
})
