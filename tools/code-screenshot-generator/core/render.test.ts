import { describe, expect, test } from "vitest"

import { buildHtmlDocument, buildHtmlSnippet } from "./html"
import { estimateTextWidth } from "./layout"
import { buildCodeShotSvg } from "./svg"
import { applyTokenStyles, tokensToLines } from "./tokens"
import { DEFAULT_MONO_FONT, getThemeById } from "./themes"
import type { BackgroundConfig } from "./backgrounds"
import type { CodeShotLayout } from "./layout"

const baseLayout: CodeShotLayout = {
  fontSize: 16,
  lineHeight: 1.5,
  padding: 20,
  framePadding: 32,
  radius: 14,
  shadow: true,
  windowStyle: "mac",
  showLineNumbers: true,
  tabSize: 2,
  fontFamily: DEFAULT_MONO_FONT,
}

const theme = getThemeById("nebula")
const background: BackgroundConfig = {
  type: "solid",
  color: "#111827",
}
const lines = tokensToLines(
  applyTokenStyles(
    [
      { text: "const", classes: ["hljs-keyword"] },
      { text: " value = 1", classes: [] },
    ],
    theme,
    2
  )
)
const emphasizedLines = [
  [
    {
      text: "important",
      color: "#f8fafc",
      fontStyle: "italic",
      fontWeight: "bold",
    },
    {
      text: "",
      color: "#e2e8f0",
      fontStyle: "normal",
    },
  ],
] as const

describe("code screenshot render output", () => {
  test("estimates text width from font size", () => {
    expect(estimateTextWidth("abcd", "20px monospace")).toBeCloseTo(49.6)
    expect(estimateTextWidth("ab", "monospace")).toBeCloseTo(19.84)
  })

  test("builds SVG with mac frame, shadow, and line numbers", () => {
    const output = buildCodeShotSvg(
      lines,
      baseLayout,
      theme,
      background,
      () => 80
    )

    expect(output.width).toBeGreaterThan(0)
    expect(output.height).toBeGreaterThan(0)
    expect(output.svg).toContain("<svg")
    expect(output.svg).toContain('filter="url(#shadow)"')
    expect(output.svg).toContain("#ff5f57")
    expect(output.svg).toContain("const")
    expect(output.svg).toContain(">1</tspan>")
  })

  test("builds SVG variants for windows and unframed output", () => {
    const windows = buildCodeShotSvg(
      [[]],
      { ...baseLayout, windowStyle: "windows", shadow: false },
      theme,
      { type: "transparent" },
      () => 10
    )
    const unframed = buildCodeShotSvg(
      lines,
      {
        ...baseLayout,
        framePadding: 0,
        showLineNumbers: false,
        windowStyle: "none",
      },
      theme,
      { type: "none" },
      () => 10
    )
    const emptyInput = buildCodeShotSvg(
      [],
      { ...baseLayout, windowStyle: "none" },
      theme,
      { type: "none" },
      () => 10
    )

    expect(windows.svg).toContain("#f87171")
    expect(windows.svg).not.toContain("feDropShadow")
    expect(unframed.svg).not.toContain("#ff5f57")
    expect(unframed.svg).not.toContain('text-anchor="end"')
    expect(emptyInput.svg).toContain("&#160;")
  })

  test("renders emphasized SVG tokens", () => {
    const output = buildCodeShotSvg(
      emphasizedLines,
      baseLayout,
      theme,
      background,
      () => 120
    )

    expect(output.svg).toContain('font-style="italic"')
    expect(output.svg).toContain('font-weight="bold"')
    expect(output.svg).toContain("> </tspan>")
  })

  test("renders multi-line SVG line-number spacing", () => {
    const output = buildCodeShotSvg(
      tokensToLines(
        applyTokenStyles(
          [
            { text: "one\n", classes: [] },
            { text: "two", classes: [] },
          ],
          theme,
          2
        )
      ),
      baseLayout,
      theme,
      background,
      () => 120
    )

    expect(output.svg).toContain(
      `dy="${baseLayout.fontSize * baseLayout.lineHeight}"`
    )
  })

  test("builds portable HTML snippets and documents", () => {
    const snippet = buildHtmlSnippet(lines, baseLayout, theme, background)
    const plainSnippet = buildHtmlSnippet(
      lines,
      {
        ...baseLayout,
        shadow: false,
        windowStyle: "windows",
        showLineNumbers: false,
      },
      theme,
      { type: "none" }
    )
    const document = buildHtmlDocument(snippet)

    expect(snippet).toContain("box-shadow: 0 18px 45px")
    expect(snippet).toContain("#ff5f57")
    expect(snippet).toContain("<pre")
    expect(plainSnippet).toContain("box-shadow: none")
    expect(plainSnippet).toContain("#f87171")
    expect(plainSnippet).not.toContain("user-select: none")
    expect(document).toContain("<!DOCTYPE html>")
    expect(document).toContain(snippet)
  })

  test("builds HTML token styles for emphasized snippets", () => {
    const snippet = buildHtmlSnippet(
      emphasizedLines,
      baseLayout,
      theme,
      background
    )

    expect(snippet).toContain("font-style: italic")
    expect(snippet).toContain("font-weight: bold")
  })

  test("builds HTML without a window header", () => {
    const snippet = buildHtmlSnippet(
      lines,
      { ...baseLayout, windowStyle: "none" },
      theme,
      background
    )

    expect(snippet).not.toContain("#ff5f57")
    expect(snippet).not.toContain("#f87171")
  })

  test("falls back unknown themes", () => {
    expect(getThemeById("missing").id).toBe("nebula")
  })
})
