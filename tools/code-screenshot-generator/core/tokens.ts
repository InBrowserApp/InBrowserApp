import type { Theme, TokenStyle } from "./themes"

type RenderMode = "highlight" | "plain"
type WindowStyle = "mac" | "windows" | "none"
type BackgroundMode = "preset" | "solid" | "transparent" | "none"

type HighlightToken = Readonly<{
  text: string
  classes: readonly string[]
}>

type StyledToken = Readonly<{
  text: string
  color: string
  fontStyle: NonNullable<TokenStyle["fontStyle"]>
  fontWeight?: TokenStyle["fontWeight"]
}>

const normalizeCode = (code: string): string => code.replace(/\r\n/g, "\n")

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const escapeXml = escapeHtml

const expandTabs = (value: string, tabSize: number): string =>
  value.replace(/\t/g, " ".repeat(Math.max(tabSize, 0)))

const resolveTokenStyle = (
  theme: Theme,
  classes: readonly string[]
): Omit<StyledToken, "text"> => {
  let color = theme.foreground
  let fontStyle: StyledToken["fontStyle"] = "normal"
  let fontWeight: StyledToken["fontWeight"]

  classes.forEach((className) => {
    const style = theme.tokenStyles[className]

    if (!style) {
      return
    }

    color = style.color
    fontStyle = style.fontStyle ?? fontStyle
    fontWeight = style.fontWeight ?? fontWeight
  })

  return { color, fontStyle, fontWeight }
}

const applyTokenStyles = (
  tokens: readonly HighlightToken[],
  theme: Theme,
  tabSize: number
): StyledToken[] =>
  tokens.map((token) => {
    const style = resolveTokenStyle(
      theme,
      token.classes.filter((className) => className !== "hljs")
    )

    return {
      text: expandTabs(token.text, tabSize),
      color: style.color,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
    }
  })

const tokensToLines = (tokens: readonly StyledToken[]): StyledToken[][] => {
  const lines: StyledToken[][] = [[]]

  tokens.forEach((token) => {
    const parts = token.text.split("\n")

    parts.forEach((part, index) => {
      if (part.length > 0) {
        lines[lines.length - 1]!.push({ ...token, text: part })
      }

      if (index < parts.length - 1) {
        lines.push([])
      }
    })
  })

  return lines
}

const buildLineNumbers = (count: number, start = 1): string[] =>
  Array.from({ length: Math.max(count, 1) }, (_, index) => `${start + index}`)

export {
  applyTokenStyles,
  buildLineNumbers,
  escapeHtml,
  escapeXml,
  expandTabs,
  normalizeCode,
  tokensToLines,
}
export type {
  BackgroundMode,
  HighlightToken,
  RenderMode,
  StyledToken,
  WindowStyle,
}
