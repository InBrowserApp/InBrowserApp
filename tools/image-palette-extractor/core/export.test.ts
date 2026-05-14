import { describe, expect, it } from "vitest"

import {
  formatPaletteAsCssVariables,
  formatPaletteAsHexList,
  formatPaletteAsJson,
  formatPaletteExport,
  getExportFileName,
  getExportMimeType,
} from "./export"

const swatches = [
  {
    count: 3,
    hex: "#112233",
    hsl: "hsl(210, 50%, 13%)",
    hue: 210,
    lightness: 13,
    ratio: 0.75,
    rgb: "rgb(17, 34, 51)",
    textColor: "#ffffff",
  },
  {
    count: 1,
    hex: "#AABBCC",
    hsl: "hsl(210, 25%, 73%)",
    hue: 210,
    lightness: 73,
    ratio: 0.25,
    rgb: "rgb(170, 187, 204)",
    textColor: "#111111",
  },
] as const

describe("palette export helpers", () => {
  it("formats palettes as hex, css, and json", () => {
    expect(formatPaletteAsHexList(swatches)).toBe("#112233\n#AABBCC")
    expect(formatPaletteAsCssVariables(swatches)).toBe(
      ":root {\n  --palette-1: #112233;\n  --palette-2: #AABBCC;\n}"
    )
    expect(JSON.parse(formatPaletteAsJson(swatches))).toEqual([
      {
        hex: "#112233",
        hsl: "hsl(210, 50%, 13%)",
        index: 1,
        ratio: 0.75,
        rgb: "rgb(17, 34, 51)",
      },
      {
        hex: "#AABBCC",
        hsl: "hsl(210, 25%, 73%)",
        index: 2,
        ratio: 0.25,
        rgb: "rgb(170, 187, 204)",
      },
    ])
  })

  it("routes generic export formatting by format", () => {
    expect(formatPaletteExport(swatches, "hex")).toBe("#112233\n#AABBCC")
    expect(formatPaletteExport(swatches, "css")).toContain("--palette-1")
    expect(formatPaletteExport(swatches, "json")).toContain('"hex"')
  })

  it("derives download names and mime types", () => {
    expect(getExportFileName("brand.png", "css")).toBe("brand-palette.css")
    expect(getExportFileName("  ", "json")).toBe("palette.json")
    expect(getExportFileName("brand", "hex")).toBe("brand-palette.txt")
    expect(getExportMimeType("css")).toBe("text/css")
    expect(getExportMimeType("json")).toBe("application/json")
    expect(getExportMimeType("hex")).toBe("text/plain")
  })
})
