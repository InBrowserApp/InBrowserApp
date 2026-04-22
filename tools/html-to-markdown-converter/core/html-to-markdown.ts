import TurndownService from "turndown/lib/turndown.browser.es.js"

const HEADING_STYLE_VALUES = ["atx", "setext"] as const
const BULLET_LIST_MARKER_VALUES = ["-", "*", "+"] as const
const CODE_BLOCK_STYLE_VALUES = ["fenced", "indented"] as const

type HeadingStyle = (typeof HEADING_STYLE_VALUES)[number]
type BulletListMarker = (typeof BULLET_LIST_MARKER_VALUES)[number]
type CodeBlockStyle = (typeof CODE_BLOCK_STYLE_VALUES)[number]

type HtmlToMarkdownOptions = Readonly<{
  headingStyle: HeadingStyle
  bulletListMarker: BulletListMarker
  codeBlockStyle: CodeBlockStyle
}>

type HtmlToMarkdownResult =
  | Readonly<{
      state: "idle"
      markdown: string
    }>
  | Readonly<{
      state: "converted"
      markdown: string
    }>
  | Readonly<{
      state: "error"
      markdown: string
      message: string
    }>

const DEFAULT_HTML_TO_MARKDOWN_OPTIONS: HtmlToMarkdownOptions = {
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
}

function isHeadingStyle(value: string): value is HeadingStyle {
  return HEADING_STYLE_VALUES.includes(value as HeadingStyle)
}

function isBulletListMarker(value: string): value is BulletListMarker {
  return BULLET_LIST_MARKER_VALUES.includes(value as BulletListMarker)
}

function isCodeBlockStyle(value: string): value is CodeBlockStyle {
  return CODE_BLOCK_STYLE_VALUES.includes(value as CodeBlockStyle)
}

function getHtmlToMarkdownErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function createTurndownService(options: HtmlToMarkdownOptions) {
  return new TurndownService({
    headingStyle: options.headingStyle,
    bulletListMarker: options.bulletListMarker,
    codeBlockStyle: options.codeBlockStyle,
  })
}

function convertHtmlToMarkdown(
  html: string,
  options: HtmlToMarkdownOptions = DEFAULT_HTML_TO_MARKDOWN_OPTIONS
): HtmlToMarkdownResult {
  if (html.trim().length === 0) {
    return {
      state: "idle",
      markdown: "",
    }
  }

  try {
    return {
      state: "converted",
      markdown: createTurndownService(options).turndown(html),
    }
  } catch (error) {
    return {
      state: "error",
      markdown: "",
      message: getHtmlToMarkdownErrorMessage(error),
    }
  }
}

export {
  BULLET_LIST_MARKER_VALUES,
  CODE_BLOCK_STYLE_VALUES,
  DEFAULT_HTML_TO_MARKDOWN_OPTIONS,
  HEADING_STYLE_VALUES,
  convertHtmlToMarkdown,
  getHtmlToMarkdownErrorMessage,
  isBulletListMarker,
  isCodeBlockStyle,
  isHeadingStyle,
}
export type {
  BulletListMarker,
  CodeBlockStyle,
  HeadingStyle,
  HtmlToMarkdownOptions,
  HtmlToMarkdownResult,
}
