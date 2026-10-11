// @vitest-environment jsdom
import { expect, test } from "vitest"
import { prepare } from "./prepare"
import { failure } from "./errors"

test("retains task states, disclosure content, tables, code and raster images", () => {
  const result = prepare(
    '<h1>Manual café</h1><ul><li><input type="checkbox" checked>Done</li><li><input type="checkbox">Pending</li></ul><details id="section" dir="rtl" lang="ar" open><summary>Details</summary><p>Hidden text</p></details><table><tr><td align="right">42</td></tr></table><pre>code</pre><img src="data:image/png;base64,YQ==">'
  )
  for (const text of [
    "Manual café",
    "[x] Done",
    "[ ] Pending",
    'class="markdown-details"',
    "Hidden text",
    'id="markdown-section"',
    'dir="rtl"',
    'lang="ar"',
    'align="right"',
    "<pre>code</pre>",
    "data:image/png;base64,YQ==",
  ])
    expect(result.html).toContain(text)
  expect(result.html).not.toContain("<input")
  expect(result.css).toContain("#pdf-content blockquote")
})

test("rejects missing images and empty output while sanitizing active HTML and custom CSS", () => {
  for (const src of [
    "missing.png",
    "https://example.test/image.png",
    "//example.test/image.png",
    "data:image/svg+xml;base64,YQ==",
  ])
    expect(() => prepare(`<h1>Manual</h1><img src="${src}">`)).toThrow(
      "unsupported"
    )
  expect(() => prepare("<script>bad()</script>")).toThrow("invalid")
  const result = prepare(
    '<p style="display:none" onclick="bad()">Visible</p><script>bad()</script><form><input value="secret"></form><style>p{display:none}</style><iframe src="https://example.test"></iframe>'
  )
  expect(result.html).toContain("Visible")
  for (const text of [
    "<script",
    "<form",
    "<iframe",
    "display:none",
    "onclick",
    "secret",
  ])
    expect(result.html).not.toContain(text)
})

test("maps parsing, print and resource failures without leaking document content", () => {
  for (const code of [
    "invalid",
    "unsupported",
    "encoding",
    "resource",
    "engineUnavailable",
  ])
    expect(failure(new Error(code)).code).toBe(code)
  expect(failure(new Error("INVALID")).code).toBe("invalid")
  expect(failure(new Error("resourceLimit")).code).toBe("resource")
  expect(failure(new RangeError("allocation failed")).code).toBe("resource")
  expect(failure(Object.assign(new Error("private"), { page: 4 }))).toEqual({
    code: "unsupported",
    page: 4,
  })
  expect(failure(Object.assign(new Error("private"), { page: "4" }))).toEqual({
    code: "invalid",
    page: undefined,
  })
  expect(failure(null).code).toBe("invalid")
})
