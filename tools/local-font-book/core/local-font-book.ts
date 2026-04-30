import type {
  DisplayFont,
  FontFaceDescriptor,
  FontGroup,
  FontSort,
  FontStyleFilter,
  LocalFontLoadError,
  RawLocalFontData,
} from "../types"

function normalizeFonts(fonts: readonly RawLocalFontData[]): DisplayFont[] {
  return fonts.map((font, index) => {
    const family = toText(font.family)
    const fullName = toText(font.fullName)
    const postscriptName = toText(font.postscriptName)
    const style = toText(font.style)
    const displayName = fullName || family || postscriptName || "--"
    const displayFamily = family || fullName || postscriptName || "--"
    const displayStyle = style || "--"
    const id =
      postscriptName || buildFallbackId([fullName, family, style], index)

    return {
      id,
      family,
      fullName,
      postscriptName,
      style,
      displayFamily,
      displayName,
      displayStyle,
      searchKey:
        `${displayFamily} ${displayName} ${postscriptName}`.toLowerCase(),
    }
  })
}

function filterAndSortFonts(
  fonts: readonly DisplayFont[],
  options: Readonly<{
    query: string
    filterStyle: FontStyleFilter
    sortBy: FontSort
  }>
) {
  const query = options.query.trim().toLowerCase()
  const filtered = fonts.filter((font) => {
    if (query && !font.searchKey.includes(query)) {
      return false
    }

    if (options.filterStyle === "italic") {
      return isItalicStyle(font.style)
    }

    if (options.filterStyle === "regular") {
      return !isItalicStyle(font.style)
    }

    return true
  })

  return [...filtered].sort((left, right) => {
    const leftValue = getSortableValue(left, options.sortBy)
    const rightValue = getSortableValue(right, options.sortBy)

    return leftValue.localeCompare(rightValue)
  })
}

function groupFonts(fonts: readonly DisplayFont[], groupByFamily: boolean) {
  if (!groupByFamily) {
    return fonts.length === 0
      ? []
      : [
          {
            id: "all-fonts",
            label: "",
            items: fonts,
          },
        ]
  }

  const groups = new Map<string, DisplayFont[]>()

  for (const font of fonts) {
    const key = font.displayFamily
    const items = groups.get(key) ?? []
    items.push(font)
    groups.set(key, items)
  }

  return [...groups.entries()].map(([label, items]) => ({
    id: label,
    label,
    items,
  })) satisfies FontGroup[]
}

function buildFontFaceDescriptor(
  font: DisplayFont | null | undefined
): FontFaceDescriptor | null {
  const family = getPreferredFontFamily(font)

  if (!family) {
    return null
  }

  const fontWeight = inferFontWeight(font?.style ?? "")

  return {
    fontFamily: quoteFontFamily(family),
    fontStyle: isItalicStyle(font?.style ?? "") ? "italic" : "normal",
    ...(fontWeight ? { fontWeight } : {}),
  }
}

function buildCssSnippet(font: DisplayFont | null | undefined) {
  const descriptor = buildFontFaceDescriptor(font)

  if (!descriptor) {
    return ""
  }

  const lines = [`font-family: ${descriptor.fontFamily};`]

  if (descriptor.fontStyle === "italic") {
    lines.push(`font-style: ${descriptor.fontStyle};`)
  }

  if (descriptor.fontWeight && descriptor.fontWeight !== 400) {
    lines.push(`font-weight: ${descriptor.fontWeight};`)
  }

  return lines.join("\n")
}

function resolveFontLoadError(
  error: unknown
): Exclude<LocalFontLoadError, null> {
  const errorName = (error as { name?: string } | null)?.name

  if (errorName === "NotAllowedError") {
    return "not-allowed"
  }

  if (errorName === "SecurityError") {
    return "security"
  }

  return "unknown"
}

function isItalicStyle(style: string) {
  return /italic|oblique/i.test(style)
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function getSortableValue(font: DisplayFont, sortBy: FontSort) {
  if (sortBy === "name") {
    return toText(font.displayName)
  }

  if (sortBy === "style") {
    return toText(font.displayStyle)
  }

  return toText(font.displayFamily)
}

function buildFallbackId(parts: string[], index: number) {
  const base = parts.filter(Boolean).join("|")

  return base ? `${base}-${index}` : `font-${index}`
}

function getPreferredFontFamily(font: DisplayFont | null | undefined) {
  if (!font) {
    return ""
  }

  return font.family || font.fullName || font.postscriptName
}

function quoteFontFamily(family: string) {
  const escaped = family.replaceAll("\\", "\\\\").replaceAll('"', '\\"')

  return `"${escaped}"`
}

function inferFontWeight(style: string) {
  const normalizedStyle = style.toLowerCase()
  const numericMatch = normalizedStyle.match(/(^|\D)([1-9]00)(\D|$)/)

  if (numericMatch) {
    return Number(numericMatch[2])
  }

  if (/(^|\b)(thin|hairline)\b/.test(normalizedStyle)) return 100
  if (/(extra[-\s]?light|ultra[-\s]?light)/.test(normalizedStyle)) return 200
  if (/\blight\b/.test(normalizedStyle)) return 300
  if (/\bbook\b/.test(normalizedStyle)) return 350
  if (/(^|\b)(regular|normal|roman)\b/.test(normalizedStyle)) return 400
  if (/\bmedium\b/.test(normalizedStyle)) return 500
  if (/(semi[-\s]?bold|demi[-\s]?bold)/.test(normalizedStyle)) return 600
  if (/\bbold\b/.test(normalizedStyle)) return 700
  if (/(extra[-\s]?bold|ultra[-\s]?bold)/.test(normalizedStyle)) return 800
  if (/(extra[-\s]?black|ultra[-\s]?black)/.test(normalizedStyle)) return 950
  if (/(^|\b)(black|heavy)\b/.test(normalizedStyle)) return 900

  return undefined
}

export {
  buildCssSnippet,
  buildFontFaceDescriptor,
  filterAndSortFonts,
  groupFonts,
  inferFontWeight,
  isItalicStyle,
  normalizeFonts,
  resolveFontLoadError,
}
