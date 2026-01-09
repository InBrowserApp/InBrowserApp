import colorNames from 'color-name'

export type ColorCategory =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'gray'
  | 'white'

export interface HtmlColorInfo {
  name: string
  hex: string
  rgb: [number, number, number]
  category: ColorCategory
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    return [0, 0, l]
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6
  } else {
    h = ((r - g) / d + 4) / 6
  }

  return [h * 360, s, l]
}

function getColorCategory(r: number, g: number, b: number): ColorCategory {
  const [h, s, l] = rgbToHsl(r, g, b)

  // White detection
  if (l > 0.95) return 'white'

  // Gray detection (low saturation)
  if (s < 0.1) return 'gray'

  // Brown detection (low saturation orange-red with medium lightness)
  if (h >= 10 && h <= 50 && s < 0.6 && l < 0.5 && l > 0.1) return 'brown'

  // Category by hue
  if (h < 15 || h >= 345) return 'red'
  if (h < 45) return 'orange'
  if (h < 70) return 'yellow'
  if (h < 165) return 'green'
  if (h < 195) return 'cyan'
  if (h < 255) return 'blue'
  if (h < 285) return 'purple'
  return 'pink'
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0').toUpperCase()).join('')
}

export const colorData: HtmlColorInfo[] = Object.entries(colorNames)
  .map(([name, rgb]) => ({
    name,
    hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
    rgb: rgb as [number, number, number],
    category: getColorCategory(rgb[0], rgb[1], rgb[2]),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export const colorCategories: ColorCategory[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'pink',
  'brown',
  'gray',
  'white',
]

export const categoryColors: Record<ColorCategory, string> = {
  red: '#FF0000',
  orange: '#FFA500',
  yellow: '#FFFF00',
  green: '#008000',
  cyan: '#00FFFF',
  blue: '#0000FF',
  purple: '#800080',
  pink: '#FFC0CB',
  brown: '#A52A2A',
  gray: '#808080',
  white: '#FFFFFF',
}
