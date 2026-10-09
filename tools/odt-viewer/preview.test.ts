// @vitest-environment jsdom
import { expect, test } from "vitest"
import { preparePreview } from "./preview"
import m from "./messages/en.json"
import type { OdtDocument } from "./types"
const source = (html: string): OdtDocument => ({
  html,
  parts: {},
  title: "Research",
  template: false,
  limited: false,
  breaks: [],
})
const documentOf = (html: string) =>
  new DOMParser().parseFromString(html, "text/html")

test("blocks executable/navigation/remote-resource paths while preserving inert internal references", () => {
  const result = preparePreview(
    source(
      `<h1>Research</h1><script>parent.hacked=1</script><meta http-equiv="refresh" content="0;url=https://remote.invalid"><link rel="stylesheet" href="https://remote.invalid/style"><iframe src="https://remote.invalid"></iframe><svg><a href="https://remote.invalid"><text>SVG</text></a></svg><form action="https://remote.invalid"><input autofocus></form><a href="#target">Internal</a><a href="https://remote.invalid" target="_top">External</a><a href="javascript:alert(1)">Script link</a><div data-odt-reference="forged" onclick="alert(1)">Forged</div><p id="target" style="background:u/**/rl(https://remote.invalid)">Target</p><img src="https://remote.invalid/image" srcset="https://remote.invalid/2x 2x"><img src="data:image/svg+xml;base64,PHN2Zz4=">`
    ),
    m
  )
  const doc = documentOf(result.html)
  expect(doc.head.firstElementChild?.getAttribute("http-equiv")).toBe(
    "Content-Security-Policy"
  )
  expect(doc.head.firstElementChild?.getAttribute("content")).toContain(
    "script-src 'none'"
  )
  expect(
    doc.querySelector(
      "script,iframe,form,input,link,svg,[href],[onclick],[srcset],[target]"
    )
  ).toBeNull()
  expect(doc.querySelectorAll("[data-odt-reference]")).toHaveLength(1)
  expect(doc.querySelector("[data-odt-reference]")?.getAttribute("role")).toBe(
    "link"
  )
  expect(
    doc.getElementById("user-content-target")?.getAttribute("style")
  ).toBeNull()
  expect(doc.querySelector("img[src]")).toBeNull()
  expect(result.limited).toBe(true)
})

test("retains supported image and formatting, generates outline, localizes breaks and separate page parts", () => {
  const book = source(
    '<h1 id="original">Main title</h1><p style="text-align:right">עברית<a id="break"></a></p><h2>Subheading</h2><img src="data:image/png;base64,iVBORw0KGgo=">'
  )
  book.parts = {
    header: "<p>Default header</p>",
    firstPageFooter: "<p>First footer</p>",
  }
  book.breaks = ["break"]
  const result = preparePreview(book, m)
  const doc = documentOf(result.html)
  expect(result.outline.map((heading) => heading.label)).toEqual([
    "Main title",
    "Subheading",
  ])
  expect(result.outline.map((heading) => heading.level)).toEqual([1, 2])
  expect(doc.getElementById("user-content-original")).not.toBeNull()
  expect(doc.querySelector("hr")?.getAttribute("aria-label")).toBe(m.pageBreak)
  expect(doc.querySelector("details")?.textContent).toContain(m.firstPageFooter)
  expect(doc.querySelector("img")?.src).toContain("data:image/png")
  expect(doc.querySelector("main p")?.getAttribute("dir")).toBe("auto")
  expect(result.limited).toBe(false)
  expect(result.empty).toBe(false)
})

test("makes blank content and missing images explicit and ignores forged page-break IDs", () => {
  expect(preparePreview(source(""), m).html).toContain(m.noContent)
  expect(preparePreview(source(""), m).empty).toBe(true)
  const result = preparePreview(
    source(
      '<a id="break">A bookmark</a><img alt="Missing photograph"><h2></h2>'
    ),
    m
  )
  expect(result.limited).toBe(true)
  expect(result.outline[0]?.label).toBe(m.documentBody)
  expect(
    documentOf(result.html).getElementById("user-content-break")
  ).not.toBeNull()
})
