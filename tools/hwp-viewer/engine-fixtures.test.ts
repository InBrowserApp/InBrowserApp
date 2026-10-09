// @vitest-environment node
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { afterAll, beforeAll, expect, test, vi } from "vitest"
import { initSync, HwpDocument } from "@rhwp/core"
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate"
import { preflight } from "./preflight"
const require = createRequire(import.meta.url)
beforeAll(() => {
  vi.stubGlobal(
    "measureTextWidth",
    (_font: string, text: string) => text.length * 7
  )
  initSync({ module: readFileSync(require.resolve("@rhwp/core/rhwp_bg.wasm")) })
})
afterAll(() => vi.unstubAllGlobals())
test.each(["hwp", "hwpx"])(
  "actual WASM reads owned bilingual %s pages, table cells and embedded image",
  (extension) => {
    const bytes = readFileSync(
      new URL(`./fixtures/river-survey.${extension}`, import.meta.url)
    )
    preflight(bytes)
    const doc = new HwpDocument(bytes)
    try {
      expect(doc.pageCount()).toBe(2)
      const svg = doc.renderPageSvg(0)
      const text = [...svg.matchAll(/<text\b[^>]*>(.*?)<\/text>/gs)]
        .map((match) => match[1])
        .join("")
      expect(text).toContain("Riversurvey")
      expect(text).toContain("강변")
      expect(text).toContain("18.4")
      expect(doc.renderPageSvg(1)).toContain("data:image/png;base64,")
    } finally {
      doc.free()
    }
  }
)
test("actual WASM retains all 1001 explicit HWPX pages", () => {
  const files = unzipSync(
    readFileSync(new URL("./fixtures/river-survey.hwpx", import.meta.url))
  )
  let section = strFromU8(files["Contents/section0.xml"]!)
  const paragraphs = Array.from(
    { length: 1000 },
    (_, index) =>
      `<hp:p id="${index + 20}" paraPrIDRef="0" styleIDRef="0" pageBreak="1"><hp:run charPrIDRef="0"><hp:t>Page ${index + 2}</hp:t></hp:run></hp:p>`
  ).join("")
  section =
    section.slice(0, section.indexOf("</hp:p>") + 7) + paragraphs + "</hs:sec>"
  files["Contents/section0.xml"] = strToU8(section)
  const doc = new HwpDocument(zipSync(files))
  try {
    expect(doc.pageCount()).toBe(1001)
    expect(doc.renderPageSvg(1000)).toContain("<text")
  } finally {
    doc.free()
  }
})
