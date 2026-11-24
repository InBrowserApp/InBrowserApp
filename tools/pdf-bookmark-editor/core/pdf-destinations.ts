import {
  PDFArray,
  PDFDict,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFRef,
  PDFString,
  type PDFContext,
  type PDFDocument,
  type PDFObject,
} from "pdf-lib"

export const pdfName = PDFName.of

export function readText(value: PDFObject | undefined) {
  if (!(value instanceof PDFString || value instanceof PDFHexString)) return ""
  const bytes = value.asBytes()
  // PDF 2.0 also allows a UTF-8 BOM in text strings.
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder().decode(bytes)
  }
  return value.decodeText()
}

function namedDestinations(catalog: PDFDict) {
  const destinations = new Map<string, PDFObject>()
  const legacy = catalog.lookup(pdfName("Dests"))
  if (legacy instanceof PDFDict) {
    for (const [key, value] of legacy.entries())
      destinations.set(key.decodeText(), value)
  }

  const names = catalog.lookup(pdfName("Names"))
  const root =
    names instanceof PDFDict ? names.lookup(pdfName("Dests")) : undefined
  const pending = [root]
  const visited = new Set<PDFDict>()
  for (const entry of pending) {
    if (!(entry instanceof PDFDict) || visited.has(entry)) continue
    visited.add(entry)
    const pairs = entry.lookup(pdfName("Names"))
    if (pairs instanceof PDFArray) {
      for (let i = 0; i + 1 < pairs.size(); i += 2) {
        destinations.set(readText(pairs.lookup(i)), pairs.get(i + 1))
      }
    }
    const kids = entry.lookup(pdfName("Kids"))
    if (kids instanceof PDFArray) {
      for (let i = 0; i < kids.size(); i++) pending.push(kids.lookup(i))
    }
  }
  return destinations
}

export function createPageResolver(document: PDFDocument) {
  const names = namedDestinations(document.catalog)
  const pages = document.getPages()
  const byRef = new Map(pages.map(({ ref }, index) => [ref, index + 1]))

  return (item: PDFDict): number | null => {
    let destination = item.lookup(pdfName("Dest"))
    if (!destination) {
      const action = item.lookup(pdfName("A"))
      if (
        action instanceof PDFDict &&
        action.lookup(pdfName("S")) === pdfName("GoTo")
      ) {
        destination = action.lookup(pdfName("D"))
      }
    }
    if (
      destination instanceof PDFName ||
      destination instanceof PDFString ||
      destination instanceof PDFHexString
    ) {
      const name =
        destination instanceof PDFName
          ? destination.decodeText()
          : readText(destination)
      destination = document.context.lookup(names.get(name))
      if (destination instanceof PDFDict)
        destination = destination.lookup(pdfName("D"))
    }

    const page =
      destination instanceof PDFArray && destination.size()
        ? destination.get(0)
        : undefined
    if (page instanceof PDFRef) return byRef.get(page) ?? null
    if (page instanceof PDFNumber) {
      const index = page.asNumber()
      if (Number.isInteger(index) && index >= 0 && index < pages.length)
        return index + 1
    }
    return null
  }
}

export function setPage(item: PDFDict, context: PDFContext, page: PDFRef) {
  item.delete(pdfName("A"))
  item.set(pdfName("Dest"), context.obj([page, pdfName("Fit")]))
}
