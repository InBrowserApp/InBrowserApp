import TurndownService from "turndown/lib/turndown.browser.es.js"
import { describe, expect, test, vi } from "vitest"

import {
  DEFAULT_HTML_TO_MARKDOWN_OPTIONS,
  convertHtmlToMarkdown,
  getHtmlToMarkdownErrorMessage,
  isBulletListMarker,
  isCodeBlockStyle,
  isHeadingStyle,
} from "./html-to-markdown"

describe("getHtmlToMarkdownErrorMessage", () => {
  test("returns the message from Error instances", () => {
    expect(getHtmlToMarkdownErrorMessage(new Error("boom"))).toBe("boom")
  })

  test("falls back to an unknown error label for non-errors", () => {
    expect(getHtmlToMarkdownErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("html-to-markdown option guards", () => {
  test("accepts only supported heading styles", () => {
    expect(isHeadingStyle("atx")).toBe(true)
    expect(isHeadingStyle("setext")).toBe(true)
    expect(isHeadingStyle("markdown")).toBe(false)
  })

  test("accepts only supported bullet markers and code block styles", () => {
    expect(isBulletListMarker("-")).toBe(true)
    expect(isBulletListMarker("*")).toBe(true)
    expect(isBulletListMarker("+")).toBe(true)
    expect(isBulletListMarker("•")).toBe(false)

    expect(isCodeBlockStyle("fenced")).toBe(true)
    expect(isCodeBlockStyle("indented")).toBe(true)
    expect(isCodeBlockStyle("code")).toBe(false)
  })
})

describe("convertHtmlToMarkdown", () => {
  test("returns idle for empty input", () => {
    expect(convertHtmlToMarkdown("   ")).toEqual({
      state: "idle",
      markdown: "",
    })
  })

  test("converts valid HTML into Markdown with the default options", () => {
    const result = convertHtmlToMarkdown("<h1>Hello</h1><p>World</p>")

    expect(result).toEqual({
      state: "converted",
      markdown: "# Hello\n\nWorld",
    })
    expect(DEFAULT_HTML_TO_MARKDOWN_OPTIONS).toEqual({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
    })
  })

  test("applies formatting options to the generated Markdown", () => {
    const result = convertHtmlToMarkdown(
      "<h1>Hello</h1><ul><li>One</li></ul><pre><code>pnpm build</code></pre>",
      {
        headingStyle: "setext",
        bulletListMarker: "*",
        codeBlockStyle: "indented",
      }
    )

    expect(result.state).toBe("converted")
    expect(result.markdown).toContain("Hello\n=====")
    expect(result.markdown).toContain("*   One")
    expect(result.markdown).toContain("    pnpm build")
  })

  test("returns an error state when Turndown throws", () => {
    const turndownSpy = vi
      .spyOn(TurndownService.prototype, "turndown")
      .mockImplementation(() => {
        throw new Error("conversion failed")
      })

    expect(convertHtmlToMarkdown("<p>Hello</p>")).toEqual({
      state: "error",
      markdown: "",
      message: "conversion failed",
    })

    turndownSpy.mockRestore()
  })

  test("uses the unknown error fallback when a non-error is thrown", () => {
    const turndownSpy = vi
      .spyOn(TurndownService.prototype, "turndown")
      .mockImplementation(() => {
        throw "boom"
      })

    expect(convertHtmlToMarkdown("<p>Hello</p>")).toEqual({
      state: "error",
      markdown: "",
      message: "Unknown error",
    })

    turndownSpy.mockRestore()
  })
})
