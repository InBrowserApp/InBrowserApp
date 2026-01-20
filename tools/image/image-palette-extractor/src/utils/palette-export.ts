export type PaletteExportFormat = 'hex' | 'css' | 'json'

export type PaletteExportColor = {
  hex: string
  rgb: string
  hsl: string
  ratio: number
}

export function formatPaletteAsHexList(colors: PaletteExportColor[]): string {
  return colors.map((color) => color.hex).join('\n')
}

export function formatPaletteAsCssVariables(colors: PaletteExportColor[]): string {
  const lines = colors.map((color, index) => `  --palette-${index + 1}: ${color.hex};`)
  return [':root {', ...lines, '}'].join('\n')
}

export function formatPaletteAsJson(colors: PaletteExportColor[]): string {
  const payload = colors.map((color, index) => ({
    index: index + 1,
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
    ratio: Number(color.ratio.toFixed(4)),
  }))
  return JSON.stringify(payload, null, 2)
}

export function formatPaletteExport(
  colors: PaletteExportColor[],
  format: PaletteExportFormat,
): string {
  if (format === 'css') return formatPaletteAsCssVariables(colors)
  if (format === 'json') return formatPaletteAsJson(colors)
  return formatPaletteAsHexList(colors)
}

export function getExportFileName(baseName: string, format: PaletteExportFormat): string {
  const stripped = baseName.replace(/\.[^.]+$/, '')
  const safeName = stripped.trim() || 'palette'
  const extension = format === 'css' ? 'css' : format === 'json' ? 'json' : 'txt'
  return `${safeName}.${extension}`
}

export function getExportMimeType(format: PaletteExportFormat): string {
  if (format === 'css') return 'text/css'
  if (format === 'json') return 'application/json'
  return 'text/plain'
}
