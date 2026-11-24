import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"

import type { Profile } from "./engine/protocol"

type Status = "ready" | "checkFailed" | "contentChanged"

async function searchableText(page: PDFPageProxy) {
  const { items } = await page.getTextContent()
  // Compare characters independently of PDF line breaks and font ligatures.
  return items
    .flatMap((item) => ("str" in item ? [item.str] : []))
    .join("")
    .normalize("NFKC")
    .replace(/[\s\u00ad]+/gu, "")
}

export async function validateArchive(
  original: PDFDocumentProxy,
  archive: PDFDocumentProxy,
  {
    profile,
    fontEncodingChanged,
  }: {
    profile: Profile
    fontEncodingChanged: boolean
  }
): Promise<Status> {
  const { metadata } = await archive.getMetadata()
  if (
    String(metadata?.get("pdfaid:part")) !== String(profile) ||
    metadata?.get("pdfaid:conformance") !== "B"
  ) {
    return "checkFailed"
  }

  if (original.numPages !== archive.numPages) return "contentChanged"
  for (let index = 1; index <= original.numPages; index += 1) {
    const [input, output] = await Promise.all([
      original.getPage(index),
      archive.getPage(index),
    ])
    const source = input.getViewport({ scale: 1 })
    const result = output.getViewport({ scale: 1 })
    // Rewriting PDF user units can introduce small rounding differences.
    const widthDelta = Math.abs(result.width / source.width - 1)
    const heightDelta = Math.abs(result.height / source.height - 1)
    if (!(Math.max(widthDelta, heightDelta) <= 0.001)) return "contentChanged"

    const [before, after] = await Promise.all([
      searchableText(input),
      searchableText(output),
    ])
    // A repaired font encoding can correct the Unicode value of a glyph
    // already drawn on the page, for example Zapf Dingbats symbols.
    if (
      before !== after &&
      (!fontEncodingChanged || [...before].length !== [...after].length)
    ) {
      return "contentChanged"
    }
    input.cleanup()
    output.cleanup()
  }
  return "ready"
}
