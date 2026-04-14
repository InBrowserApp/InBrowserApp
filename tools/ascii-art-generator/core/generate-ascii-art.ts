import figlet from "figlet"

const ASCII_ART_ALIGNS = ["left", "center", "right"] as const

const DEFAULT_FONT = "Standard"
const DEFAULT_ALIGN = "left"
const DEFAULT_WIDTH = 100
const MIN_WIDTH = 40
const MAX_WIDTH = 160

type AsciiArtAlign = (typeof ASCII_ART_ALIGNS)[number]

type AsciiArtOptions = Readonly<{
  font: string
  align: AsciiArtAlign
  width: number
}>

type AsciiArtOptionInput = Readonly<{
  font?: string
  align?: string
  width?: number | string
}>

const DEFAULT_OPTIONS: AsciiArtOptions = {
  font: DEFAULT_FONT,
  align: DEFAULT_ALIGN,
  width: DEFAULT_WIDTH,
}

/**
 * Extract a font name from a Vite glob import path.
 *
 * Given a path like `"../../node_modules/figlet/importable-fonts/Standard.js"`,
 * returns `"Standard"`. Returns `undefined` for paths that don't match.
 */
function extractFontName(path: string): string | undefined {
  const match = path.match(/\/([^/]+)\.js$/)
  return match ? match[1] : undefined
}

/**
 * Extract and sort font names from a set of Vite glob import paths.
 */
function extractFontNames(paths: readonly string[]): string[] {
  return paths
    .map(extractFontName)
    .filter((name): name is string => name !== undefined)
    .sort()
}

/**
 * Register a font with figlet so it can be used by `renderAsciiArt`.
 */
function registerFont(name: string, data: string): void {
  figlet.parseFont(name, data)
}

function normalizeAlign(value: string): AsciiArtAlign {
  return ASCII_ART_ALIGNS.includes(value as AsciiArtAlign)
    ? (value as AsciiArtAlign)
    : DEFAULT_ALIGN
}

function clampWidth(value: number | string): number {
  const parsedValue =
    typeof value === "number" ? value : Number.parseInt(value, 10)

  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_WIDTH
  }

  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(parsedValue)))
}

function normalizeAsciiArtOptions(
  options: AsciiArtOptionInput = {}
): AsciiArtOptions {
  return {
    font: options?.font?.trim() || DEFAULT_FONT,
    align: normalizeAlign(options?.align ?? DEFAULT_ALIGN),
    width: clampWidth(options?.width ?? DEFAULT_WIDTH),
  }
}

function alignLine(
  line: string,
  align: AsciiArtAlign,
  targetWidth: number
): string {
  const padding = Math.max(0, targetWidth - line.length)

  if (padding === 0 || align === "left") {
    return line
  }

  if (align === "right") {
    return `${" ".repeat(padding)}${line}`
  }

  return `${" ".repeat(Math.floor(padding / 2))}${line}`
}

function alignBlock(
  block: string,
  align: AsciiArtAlign,
  targetWidth: number
): string {
  return block
    .split("\n")
    .map((line) => alignLine(line, align, targetWidth))
    .join("\n")
}

function renderFigletLine(line: string, options: AsciiArtOptions): string {
  if (!line) {
    return ""
  }

  return alignBlock(
    figlet.textSync(line, {
      font: options.font,
      width: options.width,
      whitespaceBreak: true,
    }),
    options.align,
    options.width
  )
}

/**
 * Render text as ASCII art using a previously registered figlet font.
 *
 * Returns an empty string when the input is blank.
 */
function renderAsciiArt(
  text: string,
  partialOptions?: AsciiArtOptionInput
): string {
  const options = normalizeAsciiArtOptions(partialOptions)
  const normalizedText = text.replace(/\r\n?/g, "\n")

  if (!normalizedText.trim()) {
    return ""
  }

  return normalizedText
    .split("\n")
    .map((line) => renderFigletLine(line, options))
    .join("\n")
}

export {
  ASCII_ART_ALIGNS,
  DEFAULT_OPTIONS,
  clampWidth,
  extractFontName,
  extractFontNames,
  normalizeAlign,
  normalizeAsciiArtOptions,
  registerFont,
  renderAsciiArt,
}
export type { AsciiArtOptions }
