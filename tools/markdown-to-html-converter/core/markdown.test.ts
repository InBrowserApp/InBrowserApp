import { describe, expect, test } from "vitest"

import {
  buildPreviewDocument,
  getTextMetrics,
  renderMarkdownToHtml,
} from "./markdown"

describe("renderMarkdownToHtml", () => {
  test("returns an empty string for blank markdown", () => {
    expect(renderMarkdownToHtml("   ")).toBe("")
  })

  test("sanitizes unsafe html by default", () => {
    const rendered = renderMarkdownToHtml(
      '# Hello\n\n<img src="x" onerror="alert(1)">'
    )

    expect(rendered).toContain(">Hello</h1>")
    expect(rendered).not.toContain("onerror")
  })

  test("keeps raw html when sanitization is disabled", () => {
    const rendered = renderMarkdownToHtml(
      '# Hello\n\n<img src="x" onerror="alert(1)">',
      { sanitize: false }
    )

    expect(rendered).toContain("onerror")
  })
})

describe("getTextMetrics", () => {
  test("counts characters, lines, and non-empty lines", () => {
    expect(getTextMetrics("alpha\n\nbeta")).toEqual({
      characters: 11,
      lines: 3,
      nonEmptyLines: 2,
    })
  })

  test("normalizes windows line endings", () => {
    expect(getTextMetrics("alpha\r\nbeta")).toEqual({
      characters: 10,
      lines: 2,
      nonEmptyLines: 2,
    })
  })
})

describe("buildPreviewDocument", () => {
  test("builds a complete html document with escaped title", () => {
    const document = buildPreviewDocument(
      "<h1>Ready</h1>",
      'Unsafe <title> "x"'
    )

    expect(document).toContain("<!doctype html>")
    expect(document).toContain("<article><h1>Ready</h1></article>")
    expect(document).toContain("&lt;title&gt; &quot;x&quot;")
    expect(document).toContain("IBM Plex Sans")
  })
})
