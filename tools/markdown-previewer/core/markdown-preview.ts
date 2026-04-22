import { marked, type Tokens } from "marked"

import { EXPORT_BASE_STYLES, EXPORT_THEME_STYLES } from "./export-styles"
import type { PreviewMode, PreviewTheme } from "./preview-options"

type TocItem = Readonly<{
  id: string
  text: string
  level: number
}>

type PreviewStats = Readonly<{
  words: number
  characters: number
  headings: number
  links: number
  images: number
  readTimeMinutes: number
}>

type MarkdownPreviewResult = Readonly<{
  documentTitle: string
  html: string
  plainText: string
  toc: readonly TocItem[]
  stats: PreviewStats
}>

type ExportHtmlOptions = Readonly<{
  title: string
  html: string
  theme: PreviewTheme
}>

const FALLBACK_SECTION_ID = "section"
const WORDS_PER_MINUTE = 200

const HTML_ENTITY_MAP: Readonly<Record<string, string>> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
}

function stripHtmlTags(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (match) => HTML_ENTITY_MAP[match])
    .replace(/\s+/g, " ")
    .trim()
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function slugifyHeading(value: string) {
  const normalized = stripHtmlTags(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/[\s-]+/g, "-")

  return normalized || FALLBACK_SECTION_ID
}

function createSlugger() {
  const seen = new Map<string, number>()

  return (value: string) => {
    const base = slugifyHeading(value)
    const count = seen.get(base) ?? 0

    seen.set(base, count + 1)

    return count === 0 ? base : `${base}-${count}`
  }
}

function countWords(value: string) {
  return value.match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu)?.length ?? 0
}

function collectLinkAndImageCounts(tokens: unknown) {
  const seen = new Set<object>()
  let links = 0
  let images = 0

  function visit(value: unknown): void {
    if (value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item)
      }
      return
    }

    if (typeof value !== "object") {
      return
    }

    if (seen.has(value)) {
      return
    }

    seen.add(value)

    const record = value as Record<string, unknown>

    if (record.type === "link") {
      links += 1
    }

    if (record.type === "image") {
      images += 1
    }

    for (const nested of Object.values(record)) {
      visit(nested)
    }
  }

  visit(tokens)

  return { images, links }
}

function buildMarkdownPreview(
  source: string,
  untitledHeadingLabel: string
): MarkdownPreviewResult {
  const toc: TocItem[] = []
  const nextHeadingId = createSlugger()
  const renderer = new marked.Renderer()

  renderer.heading = (token: Tokens.Heading) => {
    const headingHtml =
      token.text.length > 0 ? (marked.parseInline(token.text) as string) : ""
    const headingText = stripHtmlTags(headingHtml)
    const visibleHeadingText = headingText || untitledHeadingLabel
    const renderedHeadingHtml = headingText ? headingHtml : visibleHeadingText
    const id = nextHeadingId(visibleHeadingText)

    toc.push({
      id,
      level: token.depth,
      text: visibleHeadingText,
    })

    return `<h${token.depth} id="${id}">${renderedHeadingHtml}</h${token.depth}>`
  }

  const html = marked.parse(source, {
    gfm: true,
    breaks: false,
    renderer,
  }) as string

  const plainText = stripHtmlTags(html)
  const words = countWords(plainText)
  const counts = collectLinkAndImageCounts(marked.lexer(source))

  return {
    documentTitle: toc[0]?.text || untitledHeadingLabel,
    html,
    plainText,
    toc,
    stats: {
      words,
      characters: plainText.length,
      headings: toc.length,
      links: counts.links,
      images: counts.images,
      readTimeMinutes:
        words === 0 ? 0 : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
    },
  }
}

function createExportHtmlDocument({ title, html, theme }: ExportHtmlOptions) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>${EXPORT_BASE_STYLES}${EXPORT_THEME_STYLES[theme]}</style>
  </head>
  <body>
    <main>
      <article>${html}</article>
    </main>
  </body>
</html>`
}

export { buildMarkdownPreview, createExportHtmlDocument, slugifyHeading }
export type {
  MarkdownPreviewResult,
  PreviewMode,
  PreviewStats,
  PreviewTheme,
  TocItem,
}
