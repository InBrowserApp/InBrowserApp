// @vitest-environment jsdom
import { expect, test } from "vitest"
import { readingDocument } from "./reading-document"

function read(html: string) {
  const result = readingDocument(html)
  const doc = new DOMParser().parseFromString(result.html, "text/html")
  return { ...result, doc }
}

test("retains book semantics, local images, styling and internal chapter links", () => {
  const { doc, limited, html } = read(
    `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="author" content="Reader"><title>Book</title><style>p { color: navy; background: url(blob:background); }</style><link rel="stylesheet" href="blob:stylesheet"></head><body><h1 id="chapter">Chapter</h1><p><em>Words</em> with <ruby>字<rt>zì</rt></ruby></p><img src="blob:image" alt="Illustration"><img src="data:image/png;base64,AA==" alt="Inline"><a href="two.xhtml#note">Next</a><a href="#chapter">Top</a><table><tbody><tr><td>Cell</td></tr></tbody></table></body></html>`
  )
  expect(html.startsWith("<!doctype html>")).toBe(true)
  expect(limited).toBe(false)
  expect(doc.documentElement.getAttribute("dir")).toBe("rtl")
  expect(doc.querySelector("ruby")?.textContent).toBe("字zì")
  expect(doc.querySelector("table td")?.textContent).toBe("Cell")
  expect(doc.querySelector("img")?.getAttribute("src")).toBe("blob:image")
  expect(doc.querySelector("link")?.getAttribute("href")).toBe(
    "blob:stylesheet"
  )
  expect(doc.querySelector("a")?.getAttribute("data-epub-href")).toBe(
    "two.xhtml#note"
  )
  expect(doc.querySelector("a")?.hasAttribute("href")).toBe(false)
  expect(doc.querySelector("a")?.getAttribute("role")).toBe("link")
  expect(doc.querySelector("a")?.getAttribute("tabindex")).toBe("0")
  expect(doc.querySelector("style")?.textContent).toContain("color: navy")
})

test("places a restrictive CSP before any book styles or assets", () => {
  const { doc } = read(
    '<style>@import "https://example.invalid/track.css";</style><p style="background:url(https://example.invalid/pixel)">Words</p>'
  )
  const first = doc.head.firstElementChild!
  expect(first.getAttribute("http-equiv")).toBe("Content-Security-Policy")
  for (const directive of [
    "default-src 'none'",
    "script-src 'none'",
    "img-src blob: data:",
    "style-src 'unsafe-inline' blob: data:",
    "font-src blob: data:",
    "base-uri 'none'",
    "form-action 'none'",
  ])
    expect(first.getAttribute("content")).toContain(directive)
  expect(doc.querySelector("#reader-presentation")?.textContent).toContain(
    "overflow-wrap: anywhere"
  )
})

test("removes active content while leaving the readable chapter", () => {
  const { doc, limited } = read(
    `<meta http-equiv="refresh" content="0;url=https://example.invalid/"><base href="https://example.invalid/"><h1>Read me</h1><script>parent.postMessage(document.cookie, '*')</script><iframe srcdoc="<script>alert(1)</script>" src="https://example.invalid/"></iframe><object data="https://example.invalid/payload"></object><embed src="https://example.invalid/payload"><form action="https://example.invalid/"><input autofocus name="secret"><button>Submit</button><select><option>One</option></select><textarea>Data</textarea></form><audio src="https://example.invalid/audio"></audio><video poster="https://example.invalid/poster"><source src="https://example.invalid/video"><track src="https://example.invalid/captions"></video>`
  )
  expect(limited).toBe(true)
  expect(doc.querySelector("h1")?.textContent).toBe("Read me")
  expect(
    doc.querySelector(
      "script, iframe, object, embed, form, input, button, select, textarea, audio, video, source, track, base"
    )
  ).toBeNull()
  expect(doc.querySelectorAll("meta")).toHaveLength(1)
})

test("removes event handlers, active attributes and executable links", () => {
  const { doc, limited } = read(
    `<p contenteditable="true" onclick="fetch('https://example.invalid/')">Text</p><a href="javascript:alert(1)" ping="https://example.invalid/track" download="file" target="_top">Danger</a><img src="blob:local" onerror="alert(1)"><svg xmlns="http://www.w3.org/2000/svg"><a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="javascript:alert(1)">SVG link</a></svg>`
  )
  expect(limited).toBe(true)
  expect(
    doc.querySelector(
      "[onclick], [onerror], [contenteditable], [ping], [target], [download]"
    )
  ).toBeNull()
  expect(doc.querySelector("a")?.hasAttribute("href")).toBe(false)
  expect(doc.querySelector("svg a")?.getAttribute("xlink:href")).toBeNull()
})

test("removes all automatic remote and unresolved resource URLs but keeps ordinary links", () => {
  const { doc, limited } = read(
    `<link rel="stylesheet" href="//example.invalid/style"><img src="https://example.invalid/pixel"><img src="http://example.invalid/pixel"><img src="../missing.png"><img srcset="blob:local 1x, https://example.invalid/pixel 2x"><svg xmlns="http://www.w3.org/2000/svg"><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://example.invalid/svg"/><use href="#shape"/><path id="shape" d="M0 0"/></svg><a href="https://example.com/read">Web</a><a href="mailto:reader@example.com">Mail</a>`
  )
  expect(limited).toBe(true)
  expect(doc.querySelector("link")?.getAttribute("href")).toBeNull()
  for (const image of doc.querySelectorAll("img")) {
    expect(image.getAttribute("src")).toBeNull()
    expect(image.getAttribute("srcset")).toBeNull()
  }
  expect(doc.querySelector("svg image")?.getAttribute("xlink:href")).toBeNull()
  expect(doc.querySelector("svg use")).toBeNull()
  expect(doc.querySelector("a")?.getAttribute("data-epub-href")).toBe(
    "https://example.com/read"
  )
})

test("makes HTML, SVG and MathML navigation inert before any event handler is installed", () => {
  const { doc, limited } = read(
    `<a href="https://example.invalid/" target="_top">Web</a><a href="blob:book-document">Blob</a><map name="image-map"><area href="blob:book-document" shape="rect" coords="0,0,20,20" alt="Map link"></map><svg><a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="blob:book-document"><text>SVG link</text></a><image href="blob:illustration"/></svg><math><mi href="blob:book-document">x</mi></math>`
  )
  expect(limited).toBe(false)
  const links = doc.querySelectorAll("[data-epub-href]")
  expect(links).toHaveLength(5)
  for (const link of links) {
    expect(link.hasAttribute("href")).toBe(false)
    expect(link.hasAttribute("xlink:href")).toBe(false)
    expect(link.hasAttribute("target")).toBe(false)
    expect(link.getAttribute("role")).toBe("link")
    expect(link.getAttribute("tabindex")).toBe("0")
  }
  expect(doc.querySelector("svg image")?.getAttribute("href")).toBe(
    "blob:illustration"
  )
})

test("does not trust forged reader commands or unsafe links removed by the sanitizer", () => {
  const { doc } = read(
    `<p data-epub-href="https://example.invalid/">Forged paragraph</p><a data-epub-href="https://example.invalid/">Forged link</a><a href="javascript:alert(1)" data-epub-href="https://example.invalid/">Unsafe link</a><a href="chapter.xhtml#note" data-epub-href="https://example.invalid/">Genuine link</a><svg><a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="javascript:alert(1)" data-epub-href="https://example.invalid/"><text>Unsafe SVG link</text></a></svg>`
  )
  expect(doc.querySelectorAll("[data-epub-href]")).toHaveLength(1)
  expect(doc.querySelector("[data-epub-href]")?.textContent).toBe(
    "Genuine link"
  )
  expect(
    doc.querySelector("[data-epub-href]")?.getAttribute("data-epub-href")
  ).toBe("chapter.xhtml#note")
})

test("removes SVG animation that could restore a navigable href after sanitization", () => {
  const { doc, limited } = read(
    `<svg xmlns:xlink="http://www.w3.org/1999/xlink"><a id="link" href="chapter.xhtml"><text>Chapter</text><animate attributeName="href" values="blob:book-document" dur="1ms" fill="freeze"/><set attributeName="xlink:href" to="https://example.invalid/" begin="0s"/><animateColor attributeName="href" to="blob:book-document"/><animateTransform attributeName="href" to="blob:book-document"/><animateMotion path="M0 0 L20 0"/><discard begin="0s"/></a></svg>`
  )
  expect(limited).toBe(true)
  expect(
    doc.querySelector(
      "animate, set, animateColor, animateTransform, animateMotion, discard"
    )
  ).toBeNull()
  expect(doc.querySelector("a")?.hasAttribute("href")).toBe(false)
  expect(doc.querySelector("a")?.hasAttribute("xlink:href")).toBe(false)
  expect(doc.querySelector("a")?.getAttribute("data-epub-href")).toBe(
    "chapter.xhtml"
  )
})

test.each([
  '<style>body { background:url("https://example.invalid/pixel") }</style>',
  '<style>@import "//example.invalid/style";</style>',
  '<p style="background:url(missing.png)">Text</p>',
  '<meta http-equiv=" Refresh " content="0;url=https://example.invalid/">',
  '<input name="field">',
])("flags unavailable interactive or remote content: %s", (html) => {
  expect(read(html).limited).toBe(true)
})

test("does not carry warnings between chapters and does not report inert metadata as missing content", () => {
  expect(read("<script>alert(1)</script>").limited).toBe(true)
  expect(
    read(
      '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="generator" content="Editor"><meta http-equiv="Content-Type" content="application/xhtml+xml"></head><body><p>Just words</p></body></html>'
    ).limited
  ).toBe(false)
})

test("sanitizes malformed SVG and MathML mutation payloads without removing ordinary math", () => {
  const { doc, limited } = read(
    '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=alert(1)>"></mglyph></table></mtext></math><math><mi>x</mi><mo>+</mo><mn>1</mn></math><svg><g onload="alert(2)"><text>Drawing</text></g></svg>'
  )
  expect(limited).toBe(true)
  expect(doc.querySelector("[onerror], [onload], script")).toBeNull()
  expect(doc.querySelector("mi")?.textContent).toBe("x")
})

test("keeps MOBI and KF8 destinations inert until the reader handles activation", () => {
  const result = readingDocument(
    '<a href="filepos:123">MOBI note</a><a href="kindle:pos:fid:0001:off:000000000A">KF8 note</a>'
  )
  const doc = new DOMParser().parseFromString(result.html, "text/html")
  expect(doc.querySelectorAll("a[href]")).toHaveLength(0)
  expect(
    Array.from(doc.querySelectorAll("a"), (a) =>
      a.getAttribute("data-epub-href")
    )
  ).toEqual(["filepos:123", "kindle:pos:fid:0001:off:000000000A"])
  expect(doc.querySelector("meta")?.getAttribute("content")).toContain(
    "script-src 'none'"
  )
})
