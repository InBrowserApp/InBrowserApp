import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFRef,
  PDFStream,
} from "pdf-lib"
import type { PDFContext, PDFObject } from "pdf-lib"

// pdf-lib serializes every indirect object, including unreferenced metadata.
// Walk the remaining document graph before saving to discard those objects.
function discardUnreachableObjects(context: PDFContext) {
  const visited = new Set<PDFObject>()
  const pending: (PDFObject | undefined)[] = Object.values(context.trailerInfo)

  while (pending.length > 0) {
    const object = pending.pop()
    if (!object || visited.has(object)) continue
    visited.add(object)

    if (object instanceof PDFRef) {
      pending.push(context.lookup(object))
    } else if (object instanceof PDFDict) {
      for (const value of object.values()) pending.push(value)
    } else if (object instanceof PDFArray) {
      for (const value of object.asArray()) pending.push(value)
    } else if (object instanceof PDFStream) {
      pending.push(object.dict)
    }
  }

  for (const [ref] of context.enumerateIndirectObjects()) {
    if (!visited.has(ref)) context.delete(ref)
  }
}

export async function removePdfMetadata(input: Uint8Array) {
  const pdf = await PDFDocument.load(input, {
    updateMetadata: false,
    throwOnInvalidObject: true,
  })
  if (pdf.getPageCount() === 0) throw new Error("PDF has no pages")

  // pdf-lib writes a 1.7 header. The catalog can declare the newer version.
  if (pdf.context.header.toString().startsWith("%PDF-2.0\n")) {
    pdf.catalog.set(PDFName.of("Version"), PDFName.of("2.0"))
  }

  delete pdf.context.trailerInfo.Info
  delete pdf.context.trailerInfo.ID
  pdf.catalog.delete(PDFName.of("Metadata"))
  discardUnreachableObjects(pdf.context)
  return pdf.save({ updateFieldAppearances: false })
}
