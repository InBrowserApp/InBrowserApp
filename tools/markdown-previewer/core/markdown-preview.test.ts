import { afterEach, describe, expect, test, vi } from "vitest"
import { marked } from "marked"

import {
  buildMarkdownPreview,
  createExportHtmlDocument,
  slugifyHeading,
} from "./markdown-preview"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("slugifyHeading", () => {
  test("normalizes headings into stable ids", () => {
    expect(slugifyHeading("  Hello, World!  ")).toBe("hello-world")
    expect(slugifyHeading("Déjà vu")).toBe("deja-vu")
    expect(slugifyHeading("Rock &amp; Roll")).toBe("rock-roll")
  })

  test("falls back when a heading has no plain text", () => {
    expect(slugifyHeading("<span></span>")).toBe("section")
  })
})

describe("buildMarkdownPreview", () => {
  test("renders markdown, builds a unique table of contents, and counts items", () => {
    const preview = buildMarkdownPreview(
      [
        "# <span></span>",
        "## Release *notes*",
        "## Release *notes*",
        "",
        "[Docs](https://example.com)",
        "",
        "![Diagram](https://example.com/diagram.png)",
      ].join("\n"),
      "Untitled"
    )

    expect(preview.documentTitle).toBe("Untitled")
    expect(preview.toc).toEqual([
      { id: "untitled", level: 1, text: "Untitled" },
      { id: "release-notes", level: 2, text: "Release notes" },
      { id: "release-notes-1", level: 2, text: "Release notes" },
    ])
    expect(preview.html).toContain('<h1 id="untitled">Untitled</h1>')
    expect(preview.html).toContain(
      '<h2 id="release-notes">Release <em>notes</em></h2>'
    )
    expect(preview.stats.headings).toBe(3)
    expect(preview.stats.links).toBe(1)
    expect(preview.stats.images).toBe(1)
    expect(preview.stats.words).toBeGreaterThan(0)
    expect(preview.stats.readTimeMinutes).toBe(1)
  })

  test("handles empty documents and empty heading text", () => {
    const emptyPreview = buildMarkdownPreview("", "Untitled")

    expect(emptyPreview.documentTitle).toBe("Untitled")
    expect(emptyPreview.toc).toEqual([])
    expect(emptyPreview.stats.words).toBe(0)
    expect(emptyPreview.stats.readTimeMinutes).toBe(0)

    const headingPreview = buildMarkdownPreview("#\n", "Untitled")

    expect(headingPreview.toc).toEqual([
      { id: "untitled", level: 1, text: "Untitled" },
    ])
    expect(headingPreview.html).toContain('<h1 id="untitled">Untitled</h1>')
  })

  test("avoids double-counting repeated token references", () => {
    const repeatedLink = {
      type: "link",
      href: "https://example.com",
    }
    const repeatedTokens = [
      { type: "paragraph", tokens: [repeatedLink, repeatedLink] },
      {
        type: "paragraph",
        tokens: [{ type: "image", href: "https://example.com/image.png" }],
      },
    ]

    vi.spyOn(marked, "lexer").mockReturnValue(repeatedTokens as never)

    const preview = buildMarkdownPreview(
      "[Docs](https://example.com)",
      "Untitled"
    )

    expect(preview.stats.links).toBe(1)
    expect(preview.stats.images).toBe(1)
  })
})

describe("createExportHtmlDocument", () => {
  test("builds a standalone html document for the selected theme", () => {
    const document = createExportHtmlDocument({
      title: `Roadmap "v2"`,
      html: "<h1>Roadmap</h1><p>Ready.</p>",
      theme: "slate",
    })

    expect(document).toContain("<!doctype html>")
    expect(document).toContain("<title>Roadmap &quot;v2&quot;</title>")
    expect(document).toContain("color-scheme: dark;")
    expect(document).toContain(
      "<article><h1>Roadmap</h1><p>Ready.</p></article>"
    )
  })
})
