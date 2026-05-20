import { describe, expect, test } from "vitest"

import { escapeHtmlAttribute } from "./escape-html"

describe("escapeHtmlAttribute", () => {
  test("passes through ASCII without special characters", () => {
    expect(escapeHtmlAttribute("/assets/icons/")).toBe("/assets/icons/")
    expect(escapeHtmlAttribute("#FF8800")).toBe("#FF8800")
  })

  test("escapes the five html attribute special characters", () => {
    expect(escapeHtmlAttribute("&")).toBe("&amp;")
    expect(escapeHtmlAttribute('"')).toBe("&quot;")
    expect(escapeHtmlAttribute("<")).toBe("&lt;")
    expect(escapeHtmlAttribute(">")).toBe("&gt;")
    expect(escapeHtmlAttribute("'")).toBe("&#39;")
  })

  test("escapes ampersand before other entities to avoid double-escaping", () => {
    expect(escapeHtmlAttribute('&"')).toBe("&amp;&quot;")
    expect(escapeHtmlAttribute("a&b")).toBe("a&amp;b")
  })

  test("neutralizes an injection attempt embedded in a path", () => {
    expect(escapeHtmlAttribute('/assets/"><script>alert(1)</script>')).toBe(
      "/assets/&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"
    )
  })
})
