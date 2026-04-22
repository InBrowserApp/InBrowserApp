import DOMPurify from "dompurify"
import { marked } from "marked"

import { previewStyles } from "./preview-styles"

type RenderMarkdownOptions = Readonly<{
  sanitize?: boolean
}>

type TextMetrics = Readonly<{
  characters: number
  lines: number
  nonEmptyLines: number
}>

function renderMarkdownToHtml(
  markdown: string,
  options: RenderMarkdownOptions = {}
) {
  if (markdown.trim().length === 0) {
    return ""
  }

  const rendered = marked.parse(markdown) as string

  if (options.sanitize === false) {
    return rendered
  }

  return DOMPurify.sanitize(rendered)
}

function getTextMetrics(text: string): TextMetrics {
  const normalized = text.replace(/\r\n/g, "\n")

  if (normalized.length === 0) {
    return {
      characters: 0,
      lines: 0,
      nonEmptyLines: 0,
    }
  }

  const lines = normalized.split("\n")

  return {
    characters: normalized.length,
    lines: lines.length,
    nonEmptyLines: lines.filter((line) => line.trim().length > 0).length,
  }
}

function buildPreviewDocument(renderedHtml: string, title: string) {
  const escapedTitle = escapeHtml(title)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapedTitle}</title>
    <style>${previewStyles}</style>
  </head>
  <body>
    <article>${renderedHtml}</article>
  </body>
</html>`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export { buildPreviewDocument, getTextMetrics, renderMarkdownToHtml }
export type { TextMetrics }
