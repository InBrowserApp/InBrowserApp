// @vitest-environment jsdom
import { expect, test } from "vitest"
import { prepare } from "./prepare"
import { failure } from "./errors"

const document = {
  html: '<h1>Manual café</h1><div class="admonitionblock note"><table><tr><td class="icon">Note</td><td>Reading</td></tr></table></div><pre>code</pre><div class="page-break"></div><p>Next page</p><img src="data:image/png;base64,YQ==">',
  warnings: false,
}

test("prepares semantic blocks, embedded images and explicit page breaks", () => {
  const result = prepare(document)
  for (const text of [
    "Manual café",
    "Note",
    "Reading",
    "Next page",
    "data:image/png;base64,YQ==",
  ])
    expect(result.html).toContain(text)
  expect(result.css).toContain("#pdf-content .admonitionblock")
  expect(result.css).toContain("break-after: page")
})

test("rejects warning-bearing output and unavailable includes", () => {
  expect(() => prepare({ ...document, warnings: true })).toThrow("warnings")
  expect(() =>
    prepare({
      html: '<p><a class="bare include" href="chapter.adoc">chapter.adoc</a></p>',
      warnings: false,
    })
  ).toThrow("includes")
  expect(() =>
    prepare({ html: "<pre>include::example.adoc[]</pre>", warnings: false })
  ).not.toThrow()
})

test("rejects missing resources and empty output but removes active passthrough", () => {
  expect(() =>
    prepare({ html: '<h1>Manual</h1><img src="missing.png">', warnings: false })
  ).toThrow("unsupported")
  expect(() =>
    prepare({ html: "<script>bad()</script>", warnings: false })
  ).toThrow("invalid")
  const result = prepare({
    ...document,
    html: document.html + "<script>bad()</script><form>Hidden form</form>",
  })
  expect(result.html).not.toContain("<script")
  expect(result.html).not.toContain("<form")
})

test("maps parser, print and resource failures to user-facing categories", () => {
  for (const code of [
    "invalid",
    "unsupported",
    "encoding",
    "includes",
    "warnings",
    "resource",
    "engineUnavailable",
  ])
    expect(failure(new Error(code)).code).toBe(code)
  expect(failure(new Error("ENCODING")).code).toBe("encoding")
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
