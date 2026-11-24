import { jsPDF } from "jspdf"
// The package's default entry is UMD, while its ESM build also works in Node tests.
import { svg2pdf } from "svg2pdf.js/dist/svg2pdf.es.min.js"
import { embeddedRaster, pageLayout } from "./svg"
import type { PageSize, SvgArtwork } from "./svg"

export async function createPdf(artwork: SvgArtwork, size: PageSize) {
  const layout = pageLayout(artwork, size)
  const pdf = new jsPDF({
    unit: "px",
    hotfixes: ["px_scaling"],
    format: [layout.width, layout.height],
    orientation: layout.width > layout.height ? "landscape" : "portrait",
    compress: true,
    putOnlyUsedFonts: true,
  })
  return svg2pdf(artwork.root, pdf, {
    width: layout.artworkWidth,
    height: layout.artworkHeight,
    x: layout.x,
    y: layout.y,
    loadImages: embeddedRaster,
  })
}
