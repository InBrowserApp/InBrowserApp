export type PaletteQuality = 'fast' | 'balanced' | 'precise'

export type PaletteSort = 'dominance' | 'hue' | 'lightness'

export type PaletteOptions = {
  colorCount: number
  quality: PaletteQuality
  sortBy: PaletteSort
  ignoreTransparent: boolean
}

export type PaletteSwatch = {
  hex: string
  rgb: string
  hsl: string
  count: number
  ratio: number
  hue: number
  lightness: number
  textColor: string
}
