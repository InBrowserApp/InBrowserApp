import type { PaletteExportFormat, PaletteSwatch } from "./types"

function formatPaletteAsHexList(colors: readonly PaletteSwatch[]): string {
  return colors.map((color) => color.hex).join("\n")
}

function formatPaletteAsCssVariables(colors: readonly PaletteSwatch[]): string {
  const lines = colors.map(
    (color, index) => `  --palette-${index + 1}: ${color.hex};`
  )

  return [":root {", ...lines, "}"].join("\n")
}

function formatPaletteAsJson(colors: readonly PaletteSwatch[]): string {
  const payload = colors.map((color, index) => ({
    index: index + 1,
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
    ratio: Number(color.ratio.toFixed(4)),
  }))

  return JSON.stringify(payload, null, 2)
}

function formatPaletteExport(
  colors: readonly PaletteSwatch[],
  format: PaletteExportFormat
): string {
  if (format === "css") return formatPaletteAsCssVariables(colors)
  if (format === "json") return formatPaletteAsJson(colors)
  return formatPaletteAsHexList(colors)
}

function getExportFileName(
  baseName: string,
  format: PaletteExportFormat
): string {
  const stripped = baseName.replace(/\.[^.]+$/, "")
  const safeName = stripped.trim() || "palette"
  const extension =
    format === "css" ? "css" : format === "json" ? "json" : "txt"

  return safeName === "palette"
    ? `${safeName}.${extension}`
    : `${safeName}-palette.${extension}`
}

function getExportMimeType(format: PaletteExportFormat): string {
  if (format === "css") return "text/css"
  if (format === "json") return "application/json"
  return "text/plain"
}

export {
  formatPaletteAsCssVariables,
  formatPaletteAsHexList,
  formatPaletteAsJson,
  formatPaletteExport,
  getExportFileName,
  getExportMimeType,
}
