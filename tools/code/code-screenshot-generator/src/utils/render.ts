import type { HLJSApi } from 'highlight.js'
import type { Theme, TokenStyle, BackgroundPreset } from './themes'

export type RenderMode = 'highlight' | 'plain'
export type WindowStyle = 'mac' | 'windows' | 'none'
export type BackgroundMode = 'preset' | 'solid' | 'transparent'

export type HighlightToken = {
  text: string
  classes: string[]
}

export type StyledToken = {
  text: string
  color: string
  fontStyle: NonNullable<TokenStyle['fontStyle']>
  fontWeight?: TokenStyle['fontWeight']
}

export type CodeShotLayout = {
  fontSize: number
  lineHeight: number
  padding: number
  framePadding: number
  radius: number
  shadow: boolean
  windowStyle: WindowStyle
  showLineNumbers: boolean
  tabSize: number
  fontFamily: string
}

export type BackgroundConfig =
  | { type: 'preset'; preset: BackgroundPreset }
  | { type: 'solid'; color: string }
  | { type: 'transparent' }

export type SvgOutput = {
  svg: string
  width: number
  height: number
}

export const normalizeCode = (code: string): string => code.replace(/\r\n/g, '\n')

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const expandTabs = (value: string, tabSize: number): string =>
  value.replace(/\t/g, ' '.repeat(Math.max(tabSize, 0)))

const collectTokens = (node: Node, classes: string[], out: HighlightToken[]) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    if (text.length > 0) {
      out.push({ text, classes })
    }
    return
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return

  const element = node as HTMLElement
  const nextClasses = element.classList.length
    ? [...classes, ...Array.from(element.classList)]
    : classes

  element.childNodes.forEach((child) => collectTokens(child, nextClasses, out))
}

export const highlightToTokens = (
  hljs: HLJSApi,
  code: string,
  language: string,
  mode: RenderMode,
): HighlightToken[] => {
  if (!code.trim()) return [{ text: code, classes: [] }]
  if (mode === 'plain') return [{ text: code, classes: [] }]

  try {
    const result =
      language === 'auto' ? hljs.highlightAuto(code) : hljs.highlight(code, { language })
    const doc = new DOMParser().parseFromString(result.value, 'text/html')
    const tokens: HighlightToken[] = []
    doc.body.childNodes.forEach((node) => collectTokens(node, [], tokens))
    return tokens.length > 0 ? tokens : [{ text: code, classes: [] }]
  } catch {
    return [{ text: code, classes: [] }]
  }
}

const resolveTokenStyle = (theme: Theme, classes: string[]): StyledToken => {
  let color = theme.foreground
  let fontStyle: StyledToken['fontStyle'] = 'normal'
  let fontWeight: StyledToken['fontWeight']

  classes.forEach((className) => {
    const style = theme.tokenStyles[className]
    if (!style) return
    color = style.color ?? color
    fontStyle = style.fontStyle ?? fontStyle
    fontWeight = style.fontWeight ?? fontWeight
  })

  return {
    text: '',
    color,
    fontStyle,
    fontWeight,
  }
}

export const applyTokenStyles = (
  tokens: HighlightToken[],
  theme: Theme,
  tabSize: number,
): StyledToken[] =>
  tokens.map((token) => {
    const { text } = token
    const style = resolveTokenStyle(
      theme,
      token.classes.filter((className) => className !== 'hljs'),
    )

    return {
      text: expandTabs(text, tabSize),
      color: style.color,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
    }
  })

export const tokensToLines = (tokens: StyledToken[]): StyledToken[][] => {
  const lines: StyledToken[][] = [[]]

  tokens.forEach((token) => {
    const parts = token.text.split('\n')
    parts.forEach((part, index) => {
      if (part.length > 0) {
        lines[lines.length - 1]!.push({ ...token, text: part })
      }
      if (index < parts.length - 1) {
        lines.push([])
      }
    })
  })

  if (lines.length === 0) return [[]]
  return lines
}

export const buildLineNumbers = (count: number, start = 1): string[] =>
  Array.from({ length: Math.max(count, 1) }, (_, index) => `${start + index}`)

const measureTextWidth = (text: string, font: string): number => {
  if (typeof document === 'undefined') return text.length * 8
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return text.length * 8
  context.font = font
  return context.measureText(text).width
}

const buildGradientStops = (colors: string[]) => {
  const step = colors.length > 1 ? 100 / (colors.length - 1) : 100
  return colors
    .map((color, index) => `<stop offset="${index * step}%" stop-color="${color}"/>`)
    .join('')
}

const resolveBackgroundCss = (background: BackgroundConfig): string => {
  if (background.type === 'transparent') return 'transparent'
  if (background.type === 'solid') return background.color

  const { preset } = background
  const colors = preset.colors.join(', ')
  if (preset.type === 'radial') {
    const focus = preset.focus ?? { x: 0.2, y: 0.2 }
    return `radial-gradient(circle at ${focus.x * 100}% ${focus.y * 100}%, ${colors})`
  }
  return `linear-gradient(${preset.angle ?? 135}deg, ${colors})`
}

const resolveBackgroundSvg = (background: BackgroundConfig) => {
  if (background.type === 'transparent') {
    return { defs: '', fill: 'none' }
  }
  if (background.type === 'solid') {
    return { defs: '', fill: background.color }
  }

  const { preset } = background
  if (preset.type === 'radial') {
    const focus = preset.focus ?? { x: 0.2, y: 0.2 }
    return {
      defs: `<radialGradient id="bgGradient" cx="${focus.x}" cy="${focus.y}" r="0.9">${buildGradientStops(
        preset.colors,
      )}</radialGradient>`,
      fill: 'url(#bgGradient)',
    }
  }

  const angle = (preset.angle ?? 135) - 90
  const radians = (angle * Math.PI) / 180
  const x = Math.cos(radians)
  const y = Math.sin(radians)
  const x1 = 0.5 - x / 2
  const y1 = 0.5 - y / 2
  const x2 = 0.5 + x / 2
  const y2 = 0.5 + y / 2

  return {
    defs: `<linearGradient id="bgGradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${buildGradientStops(
      preset.colors,
    )}</linearGradient>`,
    fill: 'url(#bgGradient)',
  }
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const buildCodeShotSvg = (
  lines: StyledToken[][],
  layout: CodeShotLayout,
  theme: Theme,
  background: BackgroundConfig,
): SvgOutput => {
  const safeLines = lines.length > 0 ? lines : [[]]
  const lineCount = safeLines.length
  const lineHeightPx = layout.fontSize * layout.lineHeight
  const fontSpec = `${layout.fontSize}px ${layout.fontFamily}`
  const lineTexts = safeLines.map((line) => line.map((token) => token.text).join(''))
  const codeWidth = Math.max(
    ...lineTexts.map((lineText) => measureTextWidth(lineText, fontSpec)),
    layout.fontSize,
  )
  const lineNumberWidth = layout.showLineNumbers
    ? measureTextWidth(`${lineCount}`, fontSpec) + 8
    : 0
  const lineNumberGap = layout.showLineNumbers ? 16 : 0
  const contentWidth = codeWidth + lineNumberWidth + lineNumberGap
  const contentHeight = lineHeightPx * lineCount
  const headerHeight = layout.windowStyle === 'none' ? 0 : Math.max(layout.fontSize * 1.8, 34)
  const cardWidth = contentWidth + layout.padding * 2
  const cardHeight = contentHeight + layout.padding * 2 + headerHeight
  const canvasWidth = cardWidth + layout.framePadding * 2
  const canvasHeight = cardHeight + layout.framePadding * 2

  const { defs: backgroundDefs, fill: backgroundFill } = resolveBackgroundSvg(background)
  const filterDefs = layout.shadow
    ? `<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity="0.35" />
    </filter>`
    : ''

  const defs = [backgroundDefs, filterDefs].filter(Boolean).join('')

  const frameX = layout.framePadding
  const frameY = layout.framePadding
  const cardRect = `<rect x="${frameX}" y="${frameY}" width="${cardWidth}" height="${cardHeight}" rx="${layout.radius}" fill="${theme.background}" stroke="${theme.border}" ${
    layout.shadow ? 'filter="url(#shadow)"' : ''
  } />`

  const headerRect =
    headerHeight > 0
      ? `<rect x="${frameX}" y="${frameY}" width="${cardWidth}" height="${headerHeight}" rx="${layout.radius}" fill="${theme.header}" />`
      : ''

  let windowControls = ''
  if (layout.windowStyle === 'mac') {
    const radius = 6
    const cy = frameY + headerHeight / 2
    const cx = frameX + layout.padding
    const gap = 14
    const colors = ['#ff5f57', '#febc2e', '#28c840']
    windowControls = colors
      .map(
        (color, index) =>
          `<circle cx="${cx + index * gap}" cy="${cy}" r="${radius}" fill="${color}" />`,
      )
      .join('')
  } else if (layout.windowStyle === 'windows') {
    const size = 10
    const gap = 12
    const top = frameY + headerHeight / 2 - size / 2
    const right = frameX + cardWidth - layout.padding - size * 3 - gap * 2
    const colors = ['#9ca3af', '#9ca3af', '#f87171']
    windowControls = colors
      .map(
        (color, index) =>
          `<rect x="${right + index * (size + gap)}" y="${top}" width="${size}" height="${size}" rx="2" fill="${color}" />`,
      )
      .join('')
  }

  const bodyX = frameX + layout.padding
  const bodyY = frameY + headerHeight + layout.padding

  const lineNumberX = bodyX + lineNumberWidth
  const codeX = bodyX + lineNumberWidth + lineNumberGap

  const lineNumberText = layout.showLineNumbers
    ? buildLineNumbers(lineCount)
        .map(
          (line, index) =>
            `<tspan x="${lineNumberX}" dy="${index === 0 ? 0 : lineHeightPx}">${line}</tspan>`,
        )
        .join('')
    : ''

  const lineNumberSvg = layout.showLineNumbers
    ? `<text x="${lineNumberX}" y="${bodyY}" fill="${theme.lineNumber}" font-family="${layout.fontFamily}" font-size="${layout.fontSize}" text-anchor="end" xml:space="preserve" dominant-baseline="text-before-edge">${lineNumberText}</text>`
    : ''

  const linesSvg = safeLines
    .map((line, index) => {
      const y = bodyY + index * lineHeightPx
      const spans = line
        .map((token) => {
          const fontStyle = token.fontStyle !== 'normal' ? ` font-style="${token.fontStyle}"` : ''
          const fontWeight = token.fontWeight ? ` font-weight="${token.fontWeight}"` : ''
          return `<tspan fill="${token.color}"${fontStyle}${fontWeight}>${escapeXml(
            token.text || ' ',
          )}</tspan>`
        })
        .join('')

      return `<text x="${codeX}" y="${y}" fill="${theme.foreground}" font-family="${layout.fontFamily}" font-size="${layout.fontSize}" xml:space="preserve" dominant-baseline="text-before-edge">${spans || '&#160;'}</text>`
    })
    .join('')

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

const buildTokenStyle = (token: StyledToken): string => {
  const styleParts = [`color: ${token.color}`]
  if (token.fontStyle && token.fontStyle !== 'normal') {
    styleParts.push(`font-style: ${token.fontStyle}`)
  }
  if (token.fontWeight) {
    styleParts.push(`font-weight: ${token.fontWeight}`)
  }
  return styleParts.join('; ')
}

export const buildHtmlSnippet = (
  lines: StyledToken[][],
  layout: CodeShotLayout,
  theme: Theme,
  background: BackgroundConfig,
): string => {
  const lineCount = Math.max(lines.length, 1)
  const lineNumbers = buildLineNumbers(lineCount).join('\n')
  const codeHtml = lines
    .map((line) =>
      line
        .map((token) => `<span style="${buildTokenStyle(token)}">${escapeHtml(token.text)}</span>`)
        .join(''),
    )
    .join('\n')

  const backgroundCss = resolveBackgroundCss(background)
  const headerHeight = layout.windowStyle === 'none' ? 0 : Math.max(layout.fontSize * 1.8, 34)
  const shadow = layout.shadow ? '0 18px 45px rgba(15, 23, 42, 0.35)' : 'none'

  const containerStyle = [
    `display: inline-block`,
    `padding: ${layout.framePadding}px`,
    `background: ${backgroundCss}`,
    `border-radius: ${layout.radius + 8}px`,
  ].join('; ')

  const cardStyle = [
    `background: ${theme.background}`,
    `border-radius: ${layout.radius}px`,
    `box-shadow: ${shadow}`,
    `border: 1px solid ${theme.border}`,
    `overflow: hidden`,
    `display: inline-block`,
  ].join('; ')

  const headerStyle = [
    `height: ${headerHeight}px`,
    `background: ${theme.header}`,
    `display: flex`,
    `align-items: center`,
    `padding: 0 ${layout.padding}px`,
    `box-sizing: border-box`,
  ].join('; ')

  const bodyStyle = [
    `display: flex`,
    `gap: 16px`,
    `padding: ${layout.padding}px`,
    `font-family: ${layout.fontFamily}`,
    `font-size: ${layout.fontSize}px`,
    `line-height: ${layout.lineHeight}`,
    `color: ${theme.foreground}`,
    `box-sizing: border-box`,
  ].join('; ')

  const lineNumberStyle = [
    `margin: 0`,
    `color: ${theme.lineNumber}`,
    `text-align: right`,
    `user-select: none`,
    `white-space: pre`,
  ].join('; ')

  const codeStyle = [`margin: 0`, `white-space: pre`].join('; ')

  const controlMarkup =
    layout.windowStyle === 'mac'
      ? `<div style="display:flex; gap:10px">
          <span style="width:12px;height:12px;border-radius:999px;background:#ff5f57;display:inline-block"></span>
          <span style="width:12px;height:12px;border-radius:999px;background:#febc2e;display:inline-block"></span>
          <span style="width:12px;height:12px;border-radius:999px;background:#28c840;display:inline-block"></span>
        </div>`
      : layout.windowStyle === 'windows'
        ? `<div style="margin-left:auto;display:flex;gap:10px">
            <span style="width:10px;height:10px;border-radius:2px;background:#9ca3af;display:inline-block"></span>
            <span style="width:10px;height:10px;border-radius:2px;background:#9ca3af;display:inline-block"></span>
            <span style="width:10px;height:10px;border-radius:2px;background:#f87171;display:inline-block"></span>
          </div>`
        : ''

  const headerMarkup =
    layout.windowStyle === 'none' ? '' : `<div style="${headerStyle}">${controlMarkup}</div>`

  const lineNumberMarkup = layout.showLineNumbers
    ? `<pre style="${lineNumberStyle}">${lineNumbers}</pre>`
    : ''

  return `<div style="${containerStyle}">
  <div style="${cardStyle}">
    ${headerMarkup}
    <div style="${bodyStyle}">
      ${lineNumberMarkup}
      <pre style="${codeStyle}">${codeHtml}</pre>
    </div>
  </div>
</div>`
}

export const buildHtmlDocument = (snippet: string, background: BackgroundConfig): string => {
  const backgroundCss = resolveBackgroundCss(background)
  const bodyBackground = background.type === 'transparent' ? '#0f172a' : backgroundCss

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Code Screenshot</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: ${bodyBackground}; }
  </style>
</head>
<body>
${snippet}
</body>
</html>`
}

export const getBackgroundPreviewCss = (background: BackgroundConfig): string => {
  if (background.type !== 'transparent') return resolveBackgroundCss(background)
  return 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)'
}

export const getBackgroundPreviewSize = (background: BackgroundConfig): string =>
  background.type === 'transparent' ? '20px 20px' : 'cover'
