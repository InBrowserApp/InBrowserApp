// @vitest-environment jsdom
import { expect, test, vi } from "vitest"
import { prepare } from "./prepare"
import { failure } from "./errors"

const bytes = (text: string) => new TextEncoder().encode(text)
test("retains document structure and scopes print styles without reader decorations", () => {
  const result = prepare(
    bytes(
      '<html lang="ar" dir="rtl"><head><style>html, body { color: red } :root h1 {font-size:24pt} @media print {p{break-before:page}} @media screen {p{color:blue}} @page{size:letter}</style></head><body class="report" style="font-family:serif"><h1>العربية</h1><ol start="3"><li>Third</li></ol><pre>code</pre><table><tr><td>Cell</td></tr></table></body></html>'
    ),
    false
  )
  expect(result.html).toContain('dir="rtl"')
  expect(result.html).toContain('lang="ar"')
  expect(result.html).toContain('start="3"')
  expect(result.html).toContain("report pdf-body")
  expect(result.html).not.toContain("data-web-wide")
  expect(result.html).not.toContain("web-heading-")
  expect(result.css).toContain("#pdf-content .pdf-html")
  expect(result.css).toContain("#pdf-content .pdf-body")
  expect(result.css).toContain("break-before:page")
  expect(result.css).not.toContain("color:blue")
  expect(result.css).not.toContain("size:letter")
})
test("omits executable content while retaining static text and embedded images", () => {
  const result = prepare(
    bytes(
      '<script>window.pwned=true</script><h1 onclick="alert(1)">Safe</h1><img src="data:image/png;base64,AA=="><a href="javascript:alert(1)">Label</a>'
    ),
    false
  )
  expect(result.html).toContain("Safe")
  expect(result.html).toContain("data:image/png;base64,AA==")
  expect(result.html).not.toMatch(/script|onclick|javascript|pwned/)
})
test.each([
  '<h1>Report</h1><img src="missing.png">',
  '<h1>Report</h1><link rel="stylesheet" href="https://example.invalid/a.css">',
  "<h1>Report</h1><style>p{background:url(https://example.invalid/a.png)}</style>",
])("rejects missing resources before rendering: %s", (source) => {
  expect(() => prepare(bytes(source), false)).toThrow("unsupported")
})
test("decodes legacy text and rejects unreadable/empty input", () => {
  expect(
    prepare(
      new Uint8Array([
        ...bytes('<meta charset="windows-1252"><p>caf'),
        233,
        ...bytes("</p>"),
      ]),
      false
    ).html
  ).toContain("café")
  expect(() =>
    prepare(bytes('<meta charset="unknown"><p>Text</p>'), false)
  ).toThrow("encoding")
  expect(() => prepare(bytes("\0bad"), false)).toThrow("invalid")
  expect(() => prepare(bytes("<!-- empty -->"), false)).toThrow("invalid")
  expect(() => prepare(bytes("<html><body>Text</body></html>"), true)).toThrow(
    "INVALID"
  )
  expect(
    prepare(
      bytes(
        '<html xmlns="http://www.w3.org/1999/xhtml"><head><style/></head><body><p>Text</p></body></html>'
      ),
      true
    ).html
  ).toContain("Text")
})

test("classifies failures without exposing parser internals", () => {
  for (const code of [
    "invalid",
    "unsupported",
    "encoding",
    "resource",
    "engineUnavailable",
  ])
    expect(failure(new Error(code)).code).toBe(code)
  expect(failure(new RangeError("array buffer allocation failed"))).toEqual({
    code: "resource",
    page: undefined,
  })
  expect(
    failure(Object.assign(new Error("private details"), { page: 4 }))
  ).toEqual({ code: "unsupported", page: 4 })
  expect(
    failure(Object.assign(new Error("private details"), { page: "4" })).page
  ).toBeUndefined()
  expect(failure(null).code).toBe("invalid")
})

test("does not misreport decoder memory failure as a text encoding problem", () => {
  const error = new RangeError("allocation failed")
  const decode = vi
    .spyOn(TextDecoder.prototype, "decode")
    .mockImplementation(() => {
      throw error
    })
  try {
    expect(() => prepare(bytes("<p>Text</p>"), false)).toThrow(error)
  } finally {
    decode.mockRestore()
  }
})
