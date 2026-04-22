import { marked, type Tokens } from "marked"

import type { TocItem } from "../types"

function slugifyHeading(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractHeadingText(value: string): string {
  return stripHtml(
    value
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[*_~#>]/g, " ")
  )
}

function createHeadingIdFactory() {
  const seen = new Map<string, number>()

  return (value: string) => {
    const base = slugifyHeading(value) || "section"
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }
}

function buildMarkdownPreview(
  source: string,
  untitledHeading: string
): Readonly<{
  html: string
  toc: readonly TocItem[]
}> {
  const createHeadingId = createHeadingIdFactory()
  const toc: TocItem[] = []
  const renderer = new marked.Renderer()

  renderer.heading = (token: Tokens.Heading) => {
    const plainText = extractHeadingText(token.text)
    const id = createHeadingId(plainText)
    const inlineHtml = renderer.parser.parseInline(token.tokens) as string

    toc.push({
      id,
      level: token.depth,
      text: plainText || untitledHeading,
    })

    return `<h${token.depth} id="${id}">${inlineHtml}</h${token.depth}>`
  }

  return {
    html: marked.parse(source, { renderer }) as string,
    toc,
  }
}

function buildExportDocument(renderedHtml: string, themeCss: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${themeCss}</style>
  </head>
  <body>
    <article class="markdown-body">${renderedHtml}</article>
  </body>
</html>`
}

export { buildExportDocument, buildMarkdownPreview, slugifyHeading }
