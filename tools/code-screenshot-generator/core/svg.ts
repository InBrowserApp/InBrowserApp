import { resolveBackgroundSvg, type BackgroundConfig } from "./backgrounds"
import {
  buildLineNumbers,
  escapeXml,
  type StyledToken,
  type WindowStyle,
} from "./tokens"
import {
  estimateTextWidth,
  type CodeShotLayout,
  type SvgOutput,
  type TextMeasurer,
} from "./layout"
import type { Theme } from "./themes"

const buildWindowControls = (
  style: WindowStyle,
  frameX: number,
  frameY: number,
  headerHeight: number,
  cardWidth: number,
  padding: number
): string => {
  if (style === "none") {
    return ""
  }

  if (style === "mac") {
    const size = 12
    const radius = size / 2
    const cy = frameY + headerHeight / 2
    const cx = frameX + padding + radius
    const gap = 10
    const colors = ["#ff5f57", "#febc2e", "#28c840"]

    return colors
      .map(
        (color, index) =>
          `<circle cx="${cx + index * (size + gap)}" cy="${cy}" r="${radius}" fill="${color}" />`
      )
      .join("")
  }

  const size = 10
  const gap = 10
  const top = frameY + headerHeight / 2 - size / 2
  const right = frameX + cardWidth - padding - size * 3 - gap * 2
  const colors = ["#9ca3af", "#9ca3af", "#f87171"]

  return colors
    .map(
      (color, index) =>
        `<rect x="${right + index * (size + gap)}" y="${top}" width="${size}" height="${size}" rx="2" fill="${color}" />`
    )
    .join("")
}

const buildLineNumberSvg = (
  layout: CodeShotLayout,
  theme: Theme,
  lineCount: number,
  lineHeightPx: number,
  lineNumberX: number,
  bodyY: number
): string => {
  if (!layout.showLineNumbers) {
    return ""
  }

  const lineNumberText = buildLineNumbers(lineCount)
    .map(
      (line, index) =>
        `<tspan x="${lineNumberX}" dy="${index === 0 ? 0 : lineHeightPx}">${line}</tspan>`
    )
    .join("")

  return `<text x="${lineNumberX}" y="${bodyY}" fill="${theme.lineNumber}" font-family="${layout.fontFamily}" font-size="${layout.fontSize}" text-anchor="end" xml:space="preserve" dominant-baseline="text-before-edge">${lineNumberText}</text>`
}

const buildLinesSvg = (
  lines: readonly (readonly StyledToken[])[],
  layout: CodeShotLayout,
  theme: Theme,
  lineHeightPx: number,
  codeX: number,
  bodyY: number
): string =>
  lines
    .map((line, index) => {
      const y = bodyY + index * lineHeightPx
      const spans = line
        .map((token) => {
          const fontStyle =
            token.fontStyle !== "normal"
              ? ` font-style="${token.fontStyle}"`
              : ""
          const fontWeight = token.fontWeight
            ? ` font-weight="${token.fontWeight}"`
            : ""

          return `<tspan fill="${token.color}"${fontStyle}${fontWeight}>${escapeXml(
            token.text || " "
          )}</tspan>`
        })
        .join("")

      return `<text x="${codeX}" y="${y}" fill="${theme.foreground}" font-family="${layout.fontFamily}" font-size="${layout.fontSize}" xml:space="preserve" dominant-baseline="text-before-edge">${spans || "&#160;"}</text>`
    })
    .join("")

const buildCodeShotSvg = (
  lines: readonly (readonly StyledToken[])[],
  layout: CodeShotLayout,
  theme: Theme,
  background: BackgroundConfig,
  measureTextWidth: TextMeasurer = estimateTextWidth
): SvgOutput => {
  const safeLines = lines.length > 0 ? lines : [[]]
  const lineCount = safeLines.length
  const lineHeightPx = layout.fontSize * layout.lineHeight
  const fontSpec = `${layout.fontSize}px ${layout.fontFamily}`
  const lineTexts = safeLines.map((line) =>
    line.map((token) => token.text).join("")
  )
  const codeWidth = Math.max(
    ...lineTexts.map((lineText) => measureTextWidth(lineText, fontSpec)),
    layout.fontSize
  )
  const lineNumberWidth = layout.showLineNumbers
    ? measureTextWidth(`${lineCount}`, fontSpec) + 8
    : 0
  const lineNumberGap = layout.showLineNumbers ? 16 : 0
  const contentWidth = codeWidth + lineNumberWidth + lineNumberGap
  const contentHeight = lineHeightPx * lineCount
  const headerHeight =
    layout.windowStyle === "none" ? 0 : Math.max(layout.fontSize * 1.8, 34)
  const cardWidth = contentWidth + layout.padding * 2
  const cardHeight = contentHeight + layout.padding * 2 + headerHeight
  const canvasWidth = cardWidth + layout.framePadding * 2
  const canvasHeight = cardHeight + layout.framePadding * 2
  const { defs: backgroundDefs, fill: backgroundFill } =
    resolveBackgroundSvg(background)
  const filterDefs = layout.shadow
    ? `<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity="0.35" />
    </filter>`
    : ""
  const defs = [backgroundDefs, filterDefs].filter(Boolean).join("")
  const frameX = layout.framePadding
  const frameY = layout.framePadding
  const cardRect = `<rect x="${frameX}" y="${frameY}" width="${cardWidth}" height="${cardHeight}" rx="${layout.radius}" fill="${theme.background}" stroke="${theme.border}" ${
    layout.shadow ? 'filter="url(#shadow)"' : ""
  } />`
  const headerRect =
    headerHeight > 0
      ? `<rect x="${frameX}" y="${frameY}" width="${cardWidth}" height="${headerHeight}" rx="${layout.radius}" fill="${theme.header}" />`
      : ""
  const windowControls = buildWindowControls(
    layout.windowStyle,
    frameX,
    frameY,
    headerHeight,
    cardWidth,
    layout.padding
  )
  const bodyX = frameX + layout.padding
  const bodyY = frameY + headerHeight + layout.padding
  const lineNumberX = bodyX + lineNumberWidth
  const codeX = bodyX + lineNumberWidth + lineNumberGap
  const lineNumberSvg = buildLineNumberSvg(
    layout,
    theme,
    lineCount,
    lineHeightPx,
    lineNumberX,
    bodyY
  )
  const linesSvg = buildLinesSvg(
    safeLines,
    layout,
    theme,
    lineHeightPx,
    codeX,
    bodyY
  )
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <defs>${defs}</defs>
  <rect width="100%" height="100%" fill="${backgroundFill}" />
  ${cardRect}
  ${headerRect}
  ${windowControls}
  ${lineNumberSvg}
  ${linesSvg}
</svg>`

  return {
    svg,
    width: Math.ceil(canvasWidth),
    height: Math.ceil(canvasHeight),
  }
}

export { buildCodeShotSvg }
