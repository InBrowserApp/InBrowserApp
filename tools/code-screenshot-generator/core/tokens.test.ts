import { describe, expect, test } from "vitest"

import {
  applyTokenStyles,
  buildLineNumbers,
  escapeHtml,
  escapeXml,
  expandTabs,
  normalizeCode,
  tokensToLines,
} from "./tokens"
import { getThemeById } from "./themes"
import type { Theme } from "./themes"

describe("code screenshot tokens", () => {
  test("normalizes line endings and escapes markup", () => {
    expect(normalizeCode("one\r\ntwo")).toBe("one\ntwo")
    expect(escapeHtml(`<tag attr="x">&'</tag>`)).toBe(
      "&lt;tag attr=&quot;x&quot;&gt;&amp;&#39;&lt;/tag&gt;"
    )
    expect(escapeXml("<svg>&</svg>")).toBe("&lt;svg&gt;&amp;&lt;/svg&gt;")
  })

  test("expands tabs with clamped spacing", () => {
    expect(expandTabs("a\tb", 4)).toBe("a    b")
    expect(expandTabs("a\tb", -1)).toBe("ab")
  })

  test("applies theme token styles and keeps defaults for unknown classes", () => {
    const theme = getThemeById("nebula")
    const styled = applyTokenStyles(
      [
        { text: "const", classes: ["hljs", "hljs-keyword"] },
        { text: " // note", classes: ["hljs-comment"] },
        { text: " value", classes: ["unknown"] },
      ],
      theme,
      2
    )

    expect(styled[0]).toMatchObject({
      text: "const",
      color: "#60a5fa",
      fontStyle: "normal",
    })
    expect(styled[1]).toMatchObject({
      color: "#94a3b8",
      fontStyle: "italic",
    })
    expect(styled[2]).toMatchObject({
      color: theme.foreground,
      fontStyle: "normal",
    })
  })

  test("keeps token defaults when a theme style only overrides color", () => {
    const theme: Theme = {
      ...getThemeById("nebula"),
      tokenStyles: {
        "hljs-color-only": {
          color: "#123456",
        },
        "hljs-bold": {
          color: "#abcdef",
          fontWeight: "bold",
        },
      },
    }
    const styled = applyTokenStyles(
      [
        { text: "color", classes: ["hljs-color-only"] },
        { text: "weight", classes: ["hljs-bold"] },
      ],
      theme,
      2
    )

    expect(styled[0]).toMatchObject({
      color: "#123456",
      fontStyle: "normal",
      fontWeight: undefined,
    })
    expect(styled[1]).toMatchObject({
      color: "#abcdef",
      fontStyle: "normal",
      fontWeight: "bold",
    })
  })

  test("splits styled tokens into rendered lines", () => {
    const theme = getThemeById("paper")
    const lines = tokensToLines(
      applyTokenStyles(
        [
          { text: "one\n", classes: [] },
          { text: "two\nthree", classes: ["hljs-string"] },
        ],
        theme,
        2
      )
    )

    expect(lines).toHaveLength(3)
    expect(lines[0]!.map((token) => token.text).join("")).toBe("one")
    expect(lines[1]!.map((token) => token.text).join("")).toBe("two")
    expect(lines[2]!.map((token) => token.text).join("")).toBe("three")
  })

  test("builds one-based line numbers", () => {
    expect(buildLineNumbers(3)).toEqual(["1", "2", "3"])
    expect(buildLineNumbers(0, 7)).toEqual(["7"])
  })
})
