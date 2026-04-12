import figlet from "figlet"
import banner3DFont from "figlet/importable-fonts/Banner3-D.js"
import bigFont from "figlet/importable-fonts/Big.js"
import blockFont from "figlet/importable-fonts/Block.js"
import doomFont from "figlet/importable-fonts/Doom.js"
import ghostFont from "figlet/importable-fonts/Ghost.js"
import slantFont from "figlet/importable-fonts/Slant.js"
import smallFont from "figlet/importable-fonts/Small.js"
import standardFont from "figlet/importable-fonts/Standard.js"

const ASCII_ART_FONT_DEFINITIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Slant", label: "Slant" },
  { value: "Small", label: "Small" },
  { value: "Big", label: "Big" },
  { value: "Block", label: "Block" },
  { value: "Doom", label: "Doom" },
  { value: "Ghost", label: "Ghost" },
  { value: "Banner3-D", label: "Banner 3-D" },
] as const

const ASCII_ART_ALIGNS = ["left", "center", "right"] as const

const FONT_MODULES = {
  Standard: standardFont,
  Slant: slantFont,
  Small: smallFont,
  Big: bigFont,
  Block: blockFont,
  Doom: doomFont,
  Ghost: ghostFont,
  "Banner3-D": banner3DFont,
} as const

const DEFAULT_FONT = "Standard"
const DEFAULT_ALIGN = "left"
const DEFAULT_WIDTH = 100
const MIN_WIDTH = 40
const MAX_WIDTH = 160

type AsciiArtFont = (typeof ASCII_ART_FONT_DEFINITIONS)[number]["value"]
type AsciiArtAlign = (typeof ASCII_ART_ALIGNS)[number]

type AsciiArtOptions = Readonly<{
  font: AsciiArtFont
  align: AsciiArtAlign
  width: number
}>

type AsciiArtMetrics = Readonly<{
  font: AsciiArtFont
  align: AsciiArtAlign
  configuredWidth: number
  lineCount: number
  maxLineWidth: number
  charCount: number
}>

type AsciiArtRenderResult = Readonly<{
  output: string
  metrics: AsciiArtMetrics
}>

const DEFAULT_OPTIONS: AsciiArtOptions = {
  font: DEFAULT_FONT,
  align: DEFAULT_ALIGN,
  width: DEFAULT_WIDTH,
}

function isAsciiArtFont(value: string): value is AsciiArtFont {
  return ASCII_ART_FONT_DEFINITIONS.some((font) => font.value === value)
}

function normalizeFont(value: string): AsciiArtFont {
  return isAsciiArtFont(value) ? value : DEFAULT_FONT
}

function isAsciiArtAlign(value: string): value is AsciiArtAlign {
  return ASCII_ART_ALIGNS.includes(value as AsciiArtAlign)
}

function normalizeAlign(value: string): AsciiArtAlign {
  return isAsciiArtAlign(value) ? value : DEFAULT_ALIGN
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
  options?: Partial<AsciiArtOptions>
): AsciiArtOptions {
  return {
    font: normalizeFont(options?.font ?? DEFAULT_FONT),
    align: normalizeAlign(options?.align ?? DEFAULT_ALIGN),
    width: clampWidth(options?.width ?? DEFAULT_WIDTH),
  }
}

function createMetrics(
  output: string,
  options: AsciiArtOptions = DEFAULT_OPTIONS
): AsciiArtMetrics {
  if (!output) {
    return {
      font: options.font,
      align: options.align,
      configuredWidth: options.width,
      lineCount: 0,
      maxLineWidth: 0,
      charCount: 0,
    }
  }

  const lines = output.split("\n")

  return {
    font: options.font,
    align: options.align,
    configuredWidth: options.width,
    lineCount: lines.length,
    maxLineWidth: Math.max(...lines.map((line) => line.length), 0),
    charCount: output.length,
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

function registerFonts() {
  for (const [fontName, fontDefinition] of Object.entries(FONT_MODULES)) {
    figlet.parseFont(fontName, fontDefinition)
  }
}

registerFonts()

function renderAsciiArt(
  text: string,
  partialOptions?: Partial<AsciiArtOptions>
): AsciiArtRenderResult {
  const options = normalizeAsciiArtOptions(partialOptions)
  const normalizedText = text.replace(/\r\n?/g, "\n")

  if (!normalizedText.trim()) {
    return {
      output: "",
      metrics: createMetrics("", options),
    }
  }

  const output = normalizedText
    .split("\n")
    .map((line) => renderFigletLine(line, options))
    .join("\n")

  return {
    output,
    metrics: createMetrics(output, options),
  }
}

export {
  ASCII_ART_ALIGNS,
  ASCII_ART_FONT_DEFINITIONS,
  DEFAULT_OPTIONS,
  clampWidth,
  createMetrics,
  normalizeAlign,
  normalizeAsciiArtOptions,
  normalizeFont,
  renderAsciiArt,
}
export type {
  AsciiArtAlign,
  AsciiArtFont,
  AsciiArtMetrics,
  AsciiArtOptions,
  AsciiArtRenderResult,
}
