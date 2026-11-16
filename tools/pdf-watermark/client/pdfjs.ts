import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString()

type AssetGlob = (
  pattern: string,
  options: { query: string; import: string; eager: true }
) => Record<string, string>
const assets = (import.meta.glob as unknown as AssetGlob)(
  "../node_modules/pdfjs-dist/{cmaps,standard_fonts,wasm}/*.{bcmap,pfb,ttf,wasm}",
  { query: "?url", import: "default", eager: true }
)

class PdfAssets {
  async fetch({ kind, filename }: { kind: string; filename: string }) {
    const directory = {
      cMapUrl: "cmaps",
      standardFontDataUrl: "standard_fonts",
      wasmUrl: "wasm",
    }[kind]
    const url = assets[`../node_modules/pdfjs-dist/${directory}/${filename}`]
    if (!url) throw new Error("previewError")
    const response = await fetch(url)
    if (!response.ok) throw new Error("previewError")
    return new Uint8Array(await response.arrayBuffer())
  }
}

function loadPdf(data: Uint8Array) {
  return getDocument({
    data,
    useSystemFonts: true,
    BinaryDataFactory: PdfAssets,
    useWorkerFetch: false,
  })
}

export { loadPdf }
