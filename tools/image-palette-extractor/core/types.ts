/* v8 ignore file */

export type PaletteColor = Readonly<{
  r: number
  g: number
  b: number
  count: number
}>

export type PaletteQuality = "fast" | "balanced" | "precise"
export type PaletteSort = "dominance" | "hue" | "lightness"
export type PaletteExportFormat = "hex" | "css" | "json"

export type PaletteOptions = Readonly<{
  colorCount: number
  quality: PaletteQuality
  sortBy: PaletteSort
  ignoreTransparent: boolean
}>

export type PaletteSwatch = Readonly<{
  hex: string
  rgb: string
  hsl: string
  count: number
  ratio: number
  hue: number
  lightness: number
  textColor: string
}>
