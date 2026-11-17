import { describe, expect, it } from "vitest"
import {
  characters,
  createResult,
  subsetCharacters,
  unicodeRange,
} from "./subset"
import type { SubsetOutput } from "../types"

describe("Unicode text and CSS", () => {
  it("counts code points once, retains spaces and joiners, and excludes line controls", () => {
    expect(characters("AA😀😀 \n\r\t\u007f\u200d")).toEqual([
      32, 65, 0x200d, 0x1f600,
    ])
    expect(characters("")).toEqual([])
    expect(subsetCharacters("é")).toEqual([101, 233, 769])
    expect(subsetCharacters("e\u0301")).toEqual([101, 233, 769])
  })
  it("sorts, deduplicates and compacts exact unicode ranges", () => {
    expect(unicodeRange([67, 65, 66, 65, 0x1f600, 32])).toBe(
      "U+20, U+41-43, U+1F600"
    )
    expect(unicodeRange([])).toBe("")
  })
  const output: SubsetOutput = {
    output: new ArrayBuffer(20),
    extension: "ttf",
    glyphCount: 4,
    originalGlyphCount: 100,
    weight: "100 900",
    style: "italic",
    missing: [],
    unicodes: [65, 66, 67],
  }
  it("produces matching safe filenames, variable CSS and MIME types", () => {
    const result = createResult(
      output,
      { name: "Font's (web).ttf", size: 200 },
      "ABC",
      "woff2"
    )
    expect(result.filename).toBe("Font_s__web_.subset.woff2")
    expect(result.mime).toBe("font/woff2")
    expect(result.css).toContain("font-weight: 100 900;")
    expect(result.css).toContain("font-style: italic;")
    expect(result.css).toContain("font-display: swap;")
    expect(result.css).toContain("unicode-range: U+41-43;")
    expect(result.css).toContain(
      "url('./Font_s__web_.subset.woff2') format('woff2')"
    )
    expect(result.originalSize).toBe(200)
    expect(result.text).toBe("ABC")
  })
  it("keeps SFNT outline flavor and falls back for an empty basename", () => {
    expect(
      createResult(output, { name: ".ttf", size: 40 }, "A", "sfnt").css
    ).toContain("format('truetype')")
    const result = createResult(
      { ...output, extension: "otf" },
      { name: ".otf", size: 40 },
      "A",
      "sfnt"
    )
    expect(result.filename).toBe("font.subset.otf")
    expect(result.mime).toBe("font/otf")
    expect(result.css).toContain("format('opentype')")
  })
})
