// @vitest-environment jsdom
import { expect, test } from "vitest"
import { notebookMarkdown } from "./markdown"

const documentFor = (html: string) =>
  new DOMParser().parseFromString(html, "text/html")

test("keeps destinations, links, table structure and embedded images in readable Markdown", () => {
  const doc = documentFor(
    '<section id="cell"><h1 id="heading">Résumé 世界</h1><p><a href="#heading">Jump</a> and <strong>bold</strong></p><table><tr><th>City</th><th>Value</th></tr><tr><td>東京</td><td>42</td></tr></table><img id="plot" src="data:image/png;base64,AA==" alt="Plot"><p>Tail</p></section>'
  )
  const result = notebookMarkdown(doc)
  expect(result).toContain('<a id="cell"></a>')
  expect(result).toContain('<a id="heading"></a>')
  expect(result).toContain("# Résumé 世界")
  expect(result).toContain("[Jump](#heading)")
  expect(result).toContain("**bold**")
  expect(result).toContain("<table>")
  expect(result).toContain("<td>東京</td>")
  expect(result).toContain('<a id="plot"></a>')
  expect(result).toContain("![Plot](data:image/png;base64,AA==)")
  expect(result).toContain("Tail")
  expect(doc.querySelector("h1")!.id).toBe("heading")
})

test("uses fences longer than content and preserves code whitespace and final newlines", () => {
  const doc = documentFor(
    '<pre><code>  x = "````"\n\n  y = 2\n</code></pre><pre>tail</pre><pre></pre><div> </div><span> </span>'
  )
  const result = notebookMarkdown(doc)
  expect(result).toContain('`````\n  x = "````"\n\n  y = 2\n`````')
  expect(result).toContain("```\ntail\n```")
  expect(result.endsWith("\n")).toBe(true)
  expect(notebookMarkdown(documentFor(""))).toBe("\n")
})

test("keeps inline heading anchors within the heading and separates execution labels", () => {
  const doc = documentFor(
    '<h1><a id="survey">Estuary survey</a></h1><header class="nb-label"><strong>Cell 2 · Code</strong><span>Execution 7</span></header>'
  )
  expect(notebookMarkdown(doc)).toContain('# <a id="survey"></a>Estuary survey')
  expect(notebookMarkdown(doc)).toContain("**Cell 2 · Code** · Execution 7")
})

test("retains sanitized embedded SVG as HTML for Markdown readers that reject SVG image syntax", () => {
  const doc = documentFor(
    '<img src="data:image/svg+xml;charset=utf-8,%3Csvg%2F%3E" alt="Plot"><img alt="Missing">'
  )
  expect(notebookMarkdown(doc)).toContain(
    '<img src="data:image/svg+xml;charset=utf-8,%3Csvg%2F%3E" alt="Plot">'
  )
})
