import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { inflateSync } from "node:zlib"
import { afterEach, expect, test, vi } from "vitest"
import { createDiagramPdf } from "./diagram-pdf"

afterEach(() => vi.unstubAllGlobals())

function diagram(label: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60">
  <defs><marker id="arrow" markerWidth="10" markerHeight="10" orient="auto" refX="7" refY="5">
    <path d="M0 0L10 5L0 10Z"/>
  </marker></defs>
  <path d="M150 30L200 30" stroke="black" style="marker-end: url('#arrow')"/>
  <text x="12" y="36" font-size="24">${label}</text>
  </svg>`
}

function instructions(pdf: string) {
  const start = pdf.indexOf("stream\n") + "stream\n".length
  const end = pdf.indexOf("\nendstream", start)
  return inflateSync(Buffer.from(pdf.slice(start, end), "latin1")).toString()
}

test("exports diagrams with no labels without loading font assets", async () => {
  const fetchAsset = vi.fn()
  vi.stubGlobal("fetch", fetchAsset)
  const blob = await createDiagramPdf(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60"><rect width="60" height="30"/></svg>'
  )
  const pdf = Buffer.from(await blob.arrayBuffer()).toString("latin1")
  expect(blob.type).toBe("application/pdf")
  expect(pdf).not.toContain("/Subtype /Image")
  expect(instructions(pdf)).toContain(" re\n")
  expect(fetchAsset).not.toHaveBeenCalled()
})

test.each([
  ["Start", "en", "DejaVuSans.ttf", 10],
  ["流程测试", "zh-CN", "NotoSansCJKsc-Regular.otf", 25],
  ["🚀", "en", "NotoEmoji.ttf", 25],
])(
  "writes %s as vector outlines",
  { timeout: 20_000 },
  async (label, language, font, curves) => {
    const resolve = createRequire(import.meta.url).resolve
    const paths = {
      "index_bg.wasm": resolve("@resvg/resvg-wasm/index_bg.wasm"),
      "DejaVuSans.ttf": resolve("../fonts/DejaVuSans.ttf"),
      "DejaVuSans-Bold.ttf": resolve("../fonts/DejaVuSans-Bold.ttf"),
      "NotoEmoji.ttf": resolve("../fonts/NotoEmoji.ttf"),
      "NotoSansCJKsc-Regular.otf": resolve(
        "../../libreoffice/fonts/NotoSansCJKsc-Regular.otf"
      ),
    }
    const fetchAsset = vi.fn(async (url: string) => {
      const name = url.split("/").at(-1) as keyof typeof paths
      const data = await readFile(paths[name])
      return new Response(Uint8Array.from(data), {
        headers: { "Content-Type": "application/octet-stream" },
      })
    })
    vi.stubGlobal("fetch", fetchAsset)

    const blob = await createDiagramPdf(diagram(label), "original", language)
    const pdf = Buffer.from(await blob.arrayBuffer()).toString("latin1")
    expect(fetchAsset).toHaveBeenCalledWith(expect.stringContaining(font))
    expect(pdf).toContain("/MediaBox [0 0 180. 45.]")
    expect(pdf).toContain("/Subtype /Form")
    expect(pdf).not.toContain("/Subtype /Image")
    const content = instructions(pdf)
    expect(content.match(/ c\n/g)?.length).toBeGreaterThan(curves)
    expect(content).toContain("\nf\n")
  }
)
