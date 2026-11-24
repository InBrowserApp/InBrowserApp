import { createPdf } from "./export-pdf"
import { prepareArtwork, type PageSize } from "./svg"

export type { PageSize } from "./svg"

export async function createDiagramPdf(
  svg: string,
  size: PageSize = "original",
  language?: string
) {
  let artwork = prepareArtwork(svg)
  const labels = Array.from(artwork.root.querySelectorAll("text")).filter(
    (text) => text.textContent?.trim()
  )

  // Outlines preserve character spacing and glyphs across PDF readers.
  if (labels.length) {
    const { outlineText } = await import("./outline-text")
    artwork = await outlineText(artwork, labels, language)
  }

  const pdf = await createPdf(artwork, size)
  return pdf.output("blob")
}
