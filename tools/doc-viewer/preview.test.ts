// @vitest-environment jsdom
import { expect, test } from "vitest"
import { preparePreview } from "./preview"
import m from "./messages/en.json"

const prepare = (html: string) =>
  preparePreview({ html, css: "", template: false, limited: false }, m)
const parse = (html: string) =>
  new DOMParser().parseFromString(html, "text/html")

test("isolates untrusted markup and resource-bearing attributes before iframe display", () => {
  const preview = prepare(`
    <script>parent.evil()</script><style>@import 'https://example.invalid/a'</style>
    <base href="https://example.invalid/"><meta http-equiv="refresh" content="0;url=https://example.invalid">
    <iframe srcdoc="bad"></iframe><object data="https://example.invalid"></object>
    <form action="https://example.invalid"><input autofocus></form>
    <svg><image href="https://example.invalid"/></svg>
    <p id="body" name="documentElement" style="background:url(https://example.invalid/a)">Safe text</p>
    <img src="https://example.invalid/pixel" srcset="https://example.invalid/pixel 1x" onerror="parent.evil()">
    <a href="https://example.invalid" ping="https://example.invalid">External</a>
    <a href="#body" target="_top">Internal</a>
    <img src="data:image/png;base64,AAAA" style="width:240px">
  `)
  const doc = parse(preview.html)
  expect(preview.limited).toBe(true)
  expect(
    doc.querySelector("script,iframe,object,form,input,svg,base")
  ).toBeNull()
  expect(doc.head.firstElementChild?.getAttribute("content")).toContain(
    "default-src 'none'"
  )
  expect(
    doc.querySelector("[href],[srcset],[ping],[onerror],[autofocus]")
  ).toBeNull()
  expect(doc.querySelector("p")?.id).toBe("user-content-body")
  expect(doc.querySelector("p")?.getAttribute("style")).toBeNull()
  expect(
    doc
      .querySelector("[data-doc-reference]")
      ?.getAttribute("data-doc-reference")
  ).toBe("user-content-body")
  expect(
    doc.querySelector("[data-doc-reference]")?.getAttribute("tabindex")
  ).toBe("0")
  expect(doc.querySelectorAll("img")).toHaveLength(1)
  expect(doc.querySelector("img")?.getAttribute("style")).toBe("width:240px")
  expect(doc.querySelector("[role=img]")?.getAttribute("aria-label")).toBe(
    m.limited
  )
})

test("recognizes Word and Chinese heading styles without losing original bookmarks", () => {
  const preview = prepare(
    '<p id="book" class="msdoc-style-heading-1">First</p><p class="msdoc-style-标题-2">中文</p><p>Body</p><h3></h3><span class="msdoc-page-break"></span>'
  )
  expect(preview.outline.map(({ label, level }) => [label, level])).toEqual([
    ["First", 1],
    ["中文", 2],
    [m.documentBody, 3],
  ])
  const doc = parse(preview.html)
  expect(doc.querySelector("h1")?.id).toBe("user-content-book")
  expect(doc.querySelector("h1 span")?.id).toBe(preview.outline[0]!.id)
  expect(
    doc.querySelector(".msdoc-page-break")?.getAttribute("aria-label")
  ).toBe(m.pageBreak)
  expect(doc.querySelector("p")?.getAttribute("dir")).toBe("auto")
})

test("reports blank or unsupported-only content instead of an unexplained empty page", () => {
  expect(parse(prepare("").html).body.textContent).toContain(m.noContent)
  const removed = prepare(
    '<section class="msdoc-attachments">Embedded attachments<a href="data:application/octet-stream;base64,AAAA">Payload</a></section>'
  )
  expect(removed.limited).toBe(true)
  expect(parse(removed.html).body.textContent).toContain(m.noContent)
  const linked = prepare(
    '<span class="msdoc-image-fallback">https://example.invalid/a</span>'
  )
  expect(linked.limited).toBe(true)
  expect(parse(linked.html).body.textContent).not.toContain("example.invalid")
})
