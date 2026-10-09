import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { initSync, parse_rtf } from "rtf-viewer/assets/rtf_parser.js"

initSync({
  module: readFileSync(resolve("tools/rtf-viewer/vendor/rtf_parser_bg.wasm")),
})
function parse(bytes: Uint8Array | string) {
  return JSON.parse(
    parse_rtf(
      typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes
    )
  )
}

describe("the shipped RTF parser", () => {
  it("reads independently produced RTF and preserves the final report text", () => {
    for (const file of ["river-survey.rtf", "river-survey-pandoc.rtf"]) {
      const model = parse(
        readFileSync(resolve(`tools/rtf-viewer/fixtures/${file}`))
      )
      const text = JSON.stringify(model.blocks)
      expect(text).toContain("River")
      expect(text).toContain("Observation")
      expect(model.schemaVersion).toBe(2)
    }
  })
  it("decodes escaped punctuation, Unicode, encoded bytes, images and table cells", () => {
    const model = parse(
      readFileSync(resolve("tools/rtf-viewer/fixtures/reading.rtf"))
    )
    const text = JSON.stringify(model.blocks)
    expect(text).toContain("Café")
    expect(text).toContain("中文 Борис 😀")
    expect(text).toContain("Second page")
    expect(text).toContain("24 cm")
    expect(model.images).toHaveLength(1)
    const cyrillic = parse(
      readFileSync(resolve("tools/rtf-viewer/fixtures/windows-1251.rtf"))
    )
    expect(JSON.stringify(cyrillic.blocks)).toContain("Привет мир")
  })
  it("keeps external fields inert and reports omitted destinations", () => {
    const model = parse(
      readFileSync(resolve("tools/rtf-viewer/fixtures/adversarial.rtf"))
    )
    expect(JSON.stringify(model.blocks)).toContain("Visible local content")
    expect(JSON.stringify(model.blocks)).not.toContain("invalid.example")
    expect(model.diagnostics.length).toBeGreaterThan(0)
    expect(model.images).toHaveLength(0)
  })
  it("rejects mislabeled and unterminated RTF", () => {
    expect(() => parse("plain text")).toThrow("input is not an RTF 1 document")
    expect(() => parse("{\\rtf1 text")).toThrow("unterminated RTF group")
  })
  it("accepts more than the former 2,000 pages", () => {
    const model = parse("{\\rtf1 " + "Page\\page ".repeat(2000) + "Final page}")
    expect(
      model.blocks.filter(
        (block: { kind: string }) => block.kind === "pageBreak"
      )
    ).toHaveLength(2000)
    expect(JSON.stringify(model.blocks.at(-1))).toContain("Final page")
  })
})
