import { readFileSync } from "node:fs"
import { afterEach, expect, test, vi } from "vitest"
import { convert, decode } from "./convert"
import { failure } from "./failure"
const fixture = (name: string) =>
  readFileSync(`tools/asciidoc-viewer/fixtures/${name}`, "utf8")
afterEach(() => vi.unstubAllGlobals())

test("converts a structured manual with ordinary AsciiDoc features", async () => {
  const { html, warnings } = await convert(fixture("field-manual.adoc"))
  expect(warnings).toBe(false)
  for (const text of [
    "River Observatory",
    "<h2",
    "<h3",
    "<h4",
    "<table",
    "admonitionblock",
    "colist",
    "<code",
    "<ol",
    "<ul",
    "<dl",
    "#observations",
    "日本語",
    "العربية",
  ])
    expect(html).toContain(text)
  expect(html).not.toContain('rel="stylesheet"')
})

test("secure mode leaves includes unresolved and never retrieves resources", async () => {
  const fetch = vi.fn(() => {
    throw new Error("Network is forbidden")
  })
  vi.stubGlobal("fetch", fetch)
  const { html, warnings } = await convert(
    fixture("unavailable-resources.adoc")
  )
  expect(html).toMatch(/class="[^"]*include"/)
  expect(html).toContain("graph TD")
  expect(html).toContain("{project-attribute}")
  expect(warnings).toBe(true)
  // Passthrough is not sanitized by the parser; the next stage must remove it.
  expect(html).toContain("<script>")
  expect(fetch).not.toHaveBeenCalled()
})

test("empty content, literal include examples, and all 1001 headings remain valid", async () => {
  expect(
    (await convert("// A comment\n:attribute: value\n")).html
  ).not.toContain("<p>")
  const example = await convert("----\n\\include::example.adoc[]\n----")
  expect(example.html).not.toMatch(/class="[^"]*include"/)
  const many = await convert(
    "= Manual\n\n" +
      Array.from(
        { length: 1001 },
        (_, i) => `== Section ${i}\n\nReading.\n`
      ).join("\n")
  )
  expect(many.html.match(/<h2 /g)).toHaveLength(1001)
})

test("decodes UTF-8 and byte-marked UTF-16, rejects invalid encodings and binary input", () => {
  expect(decode(new TextEncoder().encode("日本語 café"))).toBe("日本語 café")
  expect(decode(new Uint8Array([0xff, 0xfe, 65, 0]))).toBe("A")
  expect(decode(new Uint8Array([0xfe, 0xff, 0, 65]))).toBe("A")
  expect(decode(new Uint8Array())).toBe("")
  expect(decode(new Uint8Array([0xef, 0xbb, 0xbf, 65]))).toBe("A")
  expect(() => decode(new Uint8Array([0xff]))).toThrow("ENCODING")
  expect(() => decode(new Uint8Array([0]))).toThrow("INVALID")
})

test("distinguishes resource, encoding, and general failures", () => {
  for (const error of [new RangeError(), new Error("allocation failed")])
    expect(failure(error)).toBe("resourceLimit")
  expect(failure(new Error("ENCODING"))).toBe("encoding")
  expect(failure(new Error("bad"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
})

test("preserves a decoder allocation failure as a resource error", () => {
  vi.stubGlobal(
    "TextDecoder",
    class {
      decode() {
        throw new RangeError("allocation failed")
      }
    }
  )
  expect(() => decode(new Uint8Array([65]))).toThrow(RangeError)
})

test("preserves attribute values beyond the processor's secure-mode default", async () => {
  const value = "Unabridged reading. ".repeat(300) + "ATTRIBUTE END"
  const result = await convert(`= Manual\n:passage: ${value}\n\n{passage}`)
  expect(result.html).toContain(value)
  expect(result.warnings).toBe(false)
})
