import colorNames from "color-name"

type ColorCategory =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink"
  | "brown"
  | "gray"
  | "white"

type ColorFilter = "all" | ColorCategory

type HtmlColorInfo = Readonly<{
  name: string
  hex: string
  rgb: readonly [number, number, number]
  rgbLabel: string
  category: ColorCategory
}>

const COLOR_NAME_MAP = colorNames as Record<
  string,
  readonly [number, number, number] | undefined
>

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
] as const satisfies readonly ColorCategory[]

const CATEGORY_SWATCH_HEX: Record<ColorCategory, string> = {
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
}

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

  if (lightness > 0.95) {
    return "white"
  }

  if (saturation < 0.1) {
    return "gray"
  }

  if (
    hue >= 10 &&
    hue <= 50 &&
    saturation < 0.6 &&
    lightness < 0.5 &&
    lightness > 0.1
  ) {
    return "brown"
  }

  if (hue < 15 || hue >= 345) {
    return "red"
  }

  if (hue < 45) {
    return "orange"
  }

  if (hue < 70) {
    return "yellow"
  }

  if (hue < 165) {
    return "green"
  }

  if (hue < 195) {
    return "cyan"
  }

  if (hue < 255) {
    return "blue"
  }

  if (hue < 285) {
    return "purple"
  }

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

function formatRgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`
}

function buildHtmlColorEntries(
  colors: Record<
    string,
    readonly [number, number, number] | undefined
  > = COLOR_NAME_MAP
): HtmlColorInfo[] {
  return Object.entries(colors)
    .flatMap(([name, rgb]) => {
      if (!rgb) {
        return []
      }

      const [r, g, b] = rgb

      return [
        {
          name,
          hex: rgbToHex(r, g, b),
          rgb,
          rgbLabel: formatRgb(r, g, b),
          category: getColorCategory(r, g, b),
        },
      ]
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

const HTML_COLOR_NAMES = buildHtmlColorEntries()

function normalizeColorQuery(query: string): string {
  return query.trim().toLowerCase()
}

function matchesColorQuery(color: HtmlColorInfo, query: string): boolean {
  const normalizedQuery = normalizeColorQuery(query)

  if (normalizedQuery.length === 0) {
    return true
  }

  const normalizedHex = color.hex.toLowerCase()
  const compactQuery = normalizedQuery.replace(/^#/, "")

  return (
    color.name.toLowerCase().includes(normalizedQuery) ||
    normalizedHex.includes(normalizedQuery) ||
    normalizedHex.slice(1).includes(compactQuery)
  )
}

function isColorFilter(value: string): value is ColorFilter {
  return value === "all" || COLOR_CATEGORIES.includes(value as ColorCategory)
}

function filterHtmlColorEntries(
  colors: readonly HtmlColorInfo[],
  query: string,
  filter: ColorFilter = "all"
): HtmlColorInfo[] {
  return colors.filter((color) => {
    if (filter !== "all" && color.category !== filter) {
      return false
    }

    return matchesColorQuery(color, query)
  })
}

export {
  CATEGORY_SWATCH_HEX,
  COLOR_CATEGORIES,
  HTML_COLOR_NAMES,
  buildHtmlColorEntries,
  filterHtmlColorEntries,
  formatRgb,
  getColorCategory,
  isColorFilter,
  matchesColorQuery,
  normalizeColorQuery,
  rgbToHex,
  rgbToHsl,
}
export type { ColorCategory, ColorFilter, HtmlColorInfo }
