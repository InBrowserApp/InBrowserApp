// @vitest-environment jsdom
import { expect, test } from "vitest"
import { readableText } from "./text"

const read = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html")
  return readableText(doc.body)
}
test("retains readable paragraphs, literal entities, line breaks, quotes and list items", () => {
  const text = read(
    "<h1>Mail &amp; notes</h1><p>Hello <b>世界</b><br>Second line</p><ul><li>First</li><li>Second</li></ul><blockquote><p>Earlier reply</p><p>Another paragraph</p></blockquote>"
  )
  expect(text).toContain("Mail & notes\n\nHello 世界\nSecond line")
  expect(text).toContain("- First")
  expect(text).toContain("- Second")
  expect(text).toContain("> Earlier reply")
  expect(text).toContain("> Another paragraph")
})
test("keeps headers together, table cells separated, and preformatted text readable", () => {
  const text = read(
    "<dl><dt>From</dt><dd>Mina &lt;mina@example.test&gt;</dd><dt>Date</dt><dd>Saved +0200</dd></dl><table><tr><th>Name</th><th>Count</th></tr><tr><td>世界</td><td>2</td></tr></table><pre>line 1\n  indented line 2</pre>"
  )
  expect(text).toContain("From: Mina <mina@example.test>\nDate: Saved +0200")
  expect(text).toContain("Name\tCount\n世界\t2")
  expect(text).toContain("line 1\n  indented line 2")
})
test("includes safe link destinations without embedding image bytes or comment content", () => {
  const text = read(
    '<a href="https://example.test/doc">Reference</a><br><a href="mailto:team@example.test">Contact</a><br><a href="https://example.test">https://example.test</a><a href="#note">Footnote</a><a>Unlinked</a><img src="data:image/png;base64,SECRET" alt="Field chart"><img><!-- hidden -->'
  )
  expect(text).toContain("Reference (https://example.test/doc)")
  expect(text).toContain("Contact (mailto:team@example.test)")
  expect(text).not.toContain("https://example.test (https://example.test)")
  expect(text).toContain("Field chart")
  expect(text).not.toContain("SECRET")
  expect(text).not.toContain("hidden")
})

test("handles empty text and explicit horizontal separators", () => {
  const element = document.createElement("div")
  element.append(document.createTextNode(""), document.createElement("hr"))
  expect(readableText(element)).toBe("")
})
