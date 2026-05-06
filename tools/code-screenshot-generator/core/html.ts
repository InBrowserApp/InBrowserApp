import { resolveBackgroundCss, type BackgroundConfig } from "./backgrounds"
import {
  buildLineNumbers,
  escapeHtml,
  type StyledToken,
  type WindowStyle,
} from "./tokens"
import type { CodeShotLayout } from "./layout"
import type { Theme } from "./themes"

const buildTokenStyle = (token: StyledToken): string => {
  const styleParts = [`color: ${token.color}`]

  if (token.fontStyle !== "normal") {
    styleParts.push(`font-style: ${token.fontStyle}`)
  }

  if (token.fontWeight) {
    styleParts.push(`font-weight: ${token.fontWeight}`)
  }

  return styleParts.join("; ")
}

const buildHtmlWindowControls = (style: WindowStyle): string => {
  if (style === "mac") {
    return `<div style="display:flex; gap:10px">
          <span style="width:12px;height:12px;border-radius:999px;background:#ff5f57;display:inline-block"></span>
          <span style="width:12px;height:12px;border-radius:999px;background:#febc2e;display:inline-block"></span>
          <span style="width:12px;height:12px;border-radius:999px;background:#28c840;display:inline-block"></span>
        </div>`
  }

  if (style === "windows") {
    return `<div style="margin-left:auto;display:flex;gap:10px">
            <span style="width:10px;height:10px;border-radius:2px;background:#9ca3af;display:inline-block"></span>
            <span style="width:10px;height:10px;border-radius:2px;background:#9ca3af;display:inline-block"></span>
            <span style="width:10px;height:10px;border-radius:2px;background:#f87171;display:inline-block"></span>
          </div>`
  }

  return ""
}

const buildHtmlSnippet = (
  lines: readonly (readonly StyledToken[])[],
  layout: CodeShotLayout,
  theme: Theme,
  background: BackgroundConfig
): string => {
  const lineCount = Math.max(lines.length, 1)
  const lineNumbers = buildLineNumbers(lineCount).join("\n")
  const codeHtml = lines
    .map((line) =>
      line
        .map(
          (token) =>
            `<span style="${buildTokenStyle(token)}">${escapeHtml(token.text)}</span>`
        )
        .join("")
    )
    .join("\n")
  const backgroundCss = resolveBackgroundCss(background)
  const headerHeight =
    layout.windowStyle === "none" ? 0 : Math.max(layout.fontSize * 1.8, 34)
  const shadow = layout.shadow ? "0 18px 45px rgba(15, 23, 42, 0.35)" : "none"
  const containerStyle = [
    "display: inline-block",
    `padding: ${layout.framePadding}px`,
    `background: ${backgroundCss}`,
    `border-radius: ${layout.radius + 8}px`,
  ].join("; ")
  const cardStyle = [
    `background: ${theme.background}`,
    `border-radius: ${layout.radius}px`,
    `box-shadow: ${shadow}`,
    `border: 1px solid ${theme.border}`,
    "overflow: hidden",
    "display: inline-block",
  ].join("; ")
  const headerStyle = [
    `height: ${headerHeight}px`,
    `background: ${theme.header}`,
    "display: flex",
    "align-items: center",
    `padding: 0 ${layout.padding}px`,
    "box-sizing: border-box",
  ].join("; ")
  const bodyStyle = [
    "display: flex",
    "gap: 16px",
    `padding: ${layout.padding}px`,
    `font-family: ${layout.fontFamily}`,
    `font-size: ${layout.fontSize}px`,
    `line-height: ${layout.lineHeight}`,
    `color: ${theme.foreground}`,
    "box-sizing: border-box",
  ].join("; ")
  const lineNumberStyle = [
    "margin: 0",
    `color: ${theme.lineNumber}`,
    "text-align: right",
    "user-select: none",
    "white-space: pre",
  ].join("; ")
  const controlMarkup = buildHtmlWindowControls(layout.windowStyle)
  const headerMarkup =
    layout.windowStyle === "none"
      ? ""
      : `<div style="${headerStyle}">${controlMarkup}</div>`
  const lineNumberMarkup = layout.showLineNumbers
    ? `<pre style="${lineNumberStyle}">${lineNumbers}</pre>`
    : ""

  return `<div style="${containerStyle}">
  <div style="${cardStyle}">
    ${headerMarkup}
    <div style="${bodyStyle}">
      ${lineNumberMarkup}
      <pre style="margin: 0; white-space: pre">${codeHtml}</pre>
    </div>
  </div>
</div>`
}

const buildHtmlDocument = (snippet: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Code Screenshot</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; }
  </style>
</head>
<body>
${snippet}
</body>
</html>`

export { buildHtmlDocument, buildHtmlSnippet }
