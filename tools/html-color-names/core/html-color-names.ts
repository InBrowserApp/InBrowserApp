import colorNames from "color-name"

const COLOR_CATEGORIES = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "brown",
  "gray",
  "white",
] as const

type ColorCategory = (typeof COLOR_CATEGORIES)[number]
type ColorFilter = ColorCategory | "all"
type HtmlColorInfo = Readonly<{
  name: string
  hex: string
  rgb: readonly [number, number, number]
  category: ColorCategory
}>

const CATEGORY_SWATCHES = {
  red: "#FF0000",
  orange: "#FFA500",
  yellow: "#FFFF00",
  green: "#008000",
  cyan: "#00FFFF",
  blue: "#0000FF",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  gray: "#808080",
  white: "#FFFFFF",
} as const satisfies Record<ColorCategory, string>

const COLOR_DATA = Object.entries(colorNames)
  .map(([name, rgb]) => {
    const [r, g, b] = rgb

    return {
      name,
      hex: rgbToHex(r, g, b),
      rgb,
      category: getColorCategory(r, g, b),
    } satisfies HtmlColorInfo
  })
  .sort((left, right) => left.name.localeCompare(right.name))

function rgbToHsl(
  r: number,
  g: number,
  b: number
): readonly [number, number, number] {
  const normalizedRed = r / 255
  const normalizedGreen = g / 255
  const normalizedBlue = b / 255
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue)
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue)
  const lightness = (max + min) / 2

  if (max === min) {
    return [0, 0, lightness]
  }

  const delta = max - min
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)

  let hue = 0
  if (max === normalizedRed) {
    hue =
      ((normalizedGreen - normalizedBlue) / delta +
        (normalizedGreen < normalizedBlue ? 6 : 0)) /
      6
  } else if (max === normalizedGreen) {
    hue = ((normalizedBlue - normalizedRed) / delta + 2) / 6
  } else {
    hue = ((normalizedRed - normalizedGreen) / delta + 4) / 6
  }

  return [hue * 360, saturation, lightness]
}

function getColorCategory(r: number, g: number, b: number): ColorCategory {
  const [hue, saturation, lightness] = rgbToHsl(r, g, b)

  if (lightness > 0.95) return "white"
  if (saturation < 0.1) return "gray"
  if (
    hue >= 10 &&
    hue <= 50 &&
    saturation < 0.6 &&
    lightness < 0.5 &&
    lightness > 0.1
  ) {
    return "brown"
  }

  if (hue < 15 || hue >= 345) return "red"
  if (hue < 45) return "orange"
  if (hue < 70) return "yellow"
  if (hue < 165) return "green"
  if (hue < 195) return "cyan"
  if (hue < 255) return "blue"
  if (hue < 285) return "purple"

  return "pink"
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((channel) => channel.toString(16).padStart(2, "0").toUpperCase())
      .join("")
  )
}

function formatRgb(rgb: readonly [number, number, number]): string {
  return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")"
}

function filterColors(
  colors: readonly HtmlColorInfo[],
  searchQuery: string,
  filter: ColorFilter
): HtmlColorInfo[] {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return colors.filter((color) => {
    if (filter !== "all" && color.category !== filter) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return (
      color.name.toLowerCase().includes(normalizedQuery) ||
      color.hex.toLowerCase().includes(normalizedQuery)
    )
  })
}

function isColorFilter(value: string): value is ColorFilter {
  return value === "all" || COLOR_CATEGORIES.includes(value as ColorCategory)
}

export {
  CATEGORY_SWATCHES,
  COLOR_CATEGORIES,
  COLOR_DATA,
  filterColors,
  formatRgb,
  getColorCategory,
  isColorFilter,
  rgbToHex,
  rgbToHsl,
}
export type { ColorCategory, ColorFilter, HtmlColorInfo }
