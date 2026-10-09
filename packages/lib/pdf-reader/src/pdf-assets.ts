// Vite emits these assets on our origin; no document resources use a CDN.
// The workspace's minimal ImportMeta declaration only covers lazy globs.
type AssetGlob = (
  pattern: string,
  options: { query: string; import: string; eager: true }
) => Record<string, string>
const assets = (import.meta.glob as unknown as AssetGlob)(
  "../node_modules/pdfjs-dist/{cmaps,standard_fonts,wasm}/*.{bcmap,pfb,ttf,wasm}",
  { query: "?url", import: "default", eager: true }
)

export class PdfAssets {
  async fetch({ kind, filename }: { kind: string; filename: string }) {
    const directory = {
      cMapUrl: "cmaps",
      standardFontDataUrl: "standard_fonts",
      wasmUrl: "wasm",
    }[kind]
    const url = assets[`../node_modules/pdfjs-dist/${directory}/${filename}`]
    if (!url) throw new Error("PDF_ASSET_UNAVAILABLE")
    const response = await fetch(url)
    if (!response.ok) throw new Error("PDF_ASSET_UNAVAILABLE")
    return new Uint8Array(await response.arrayBuffer())
  }
}
