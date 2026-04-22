import { describe, expect, test } from "vitest"

import {
  buildExportDocument,
  buildMarkdownPreview,
  slugifyHeading,
} from "./markdown-preview"

describe("slugifyHeading", () => {
  test("normalizes whitespace, case, and punctuation", () => {
    expect(slugifyHeading("  Hello, Markdown World!  ")).toBe(
      "hello-markdown-world"
    )
  })

  test("keeps unicode letters and numbers", () => {
    expect(slugifyHeading("Cafe numero 42")).toBe("cafe-numero-42")
    expect(slugifyHeading("Ti tulo 2026")).toBe("ti-tulo-2026")
  })
})

describe("buildMarkdownPreview", () => {
  test("builds html and a table of contents with stable ids", () => {
    const preview = buildMarkdownPreview(
      `# Intro\n## Details\n## Details`,
      "Untitled"
    )

    expect(preview.html).toContain('<h1 id="intro">Intro</h1>')
    expect(preview.html).toContain('<h2 id="details">Details</h2>')
    expect(preview.html).toContain('<h2 id="details-1">Details</h2>')
    expect(preview.toc).toEqual([
      { id: "intro", level: 1, text: "Intro" },
      { id: "details", level: 2, text: "Details" },
      { id: "details-1", level: 2, text: "Details" },
    ])
  })

  test("falls back to an untitled label when heading text is empty", () => {
    const preview = buildMarkdownPreview("## ![](/logo.png)", "Untitled")

    expect(preview.toc).toEqual([
      {
        id: "section",
        level: 2,
        text: "Untitled",
      },
    ])
  })
})

describe("buildExportDocument", () => {
  test("wraps rendered html with a standalone document shell", () => {
    const document = buildExportDocument("<h1>Hello</h1>", ".markdown-body {}")

    expect(document).toContain("<!DOCTYPE html>")
    expect(document).toContain("<style>.markdown-body {}</style>")
    expect(document).toContain('<article class="markdown-body"><h1>Hello</h1>')
  })
})
