// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { exportWebDocument, imageSources } from "./export"

class TestImage {
  static images: TestImage[] = []
  static manual = false
  static fail = false
  static width = 1
  static throwing = false
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  naturalWidth = TestImage.width
  removeAttribute = vi.fn()
  set src(value: string) {
    if (TestImage.throwing) throw new RangeError("allocation")
    this.url = value
    if (!TestImage.manual)
      queueMicrotask(() =>
        TestImage.fail ? this.onerror?.() : this.onload?.()
      )
  }
  url = ""
  constructor() {
    TestImage.images.push(this)
  }
}
beforeEach(() => {
  TestImage.images = []
  TestImage.manual = false
  TestImage.fail = false
  TestImage.width = 1
  TestImage.throwing = false
  vi.stubGlobal("Image", TestImage)
})
afterEach(() => vi.unstubAllGlobals())
const image = "data:image/png;base64,YQ=="

// CSSOM replaceSync is not supplied by jsdom, so source-resource discovery is
// exercised directly; full archive CSS and loading are verified in real browsers.
test("discovers unique inline and CSS raster images without treating fonts as images", () => {
  expect([
    ...imageSources(
      `<p style="background:url('${image}')">Text</p><style>@media screen{p{background:url('${image}')}}@font-face{font-family:Example;src:url(data:font/woff;base64,YQ==)}</style><img src="${image}">`
    ),
  ]).toEqual([image])
  expect(() => imageSources('<img alt="Missing">')).toThrow("unsupported")
})

test("writes UTF-8 HTML, safe direct links and the same contained content as preview", async () => {
  const source = `<h1 id="chapter">Café 中文</h1><img src="${image}"><a href="#chapter">Internal</a><a href="https://example.test/a?x=1&amp;y=2">External</a><a href="mailto:a@example.test">Mail</a><a href="javascript:bad()">Bad</a><a data-web-link="https://forged.test">Forged</a><script>bad()</script><form><input value="secret"></form>`
  const result = await exportWebDocument(
    source,
    new AbortController().signal,
    "Section"
  )
  const exported = await result.file.text()
  expect(result.file.type).toBe("text/html;charset=utf-8")
  expect(exported).toContain('<meta charset="utf-8">')
  expect(exported.indexOf("Content-Security-Policy")).toBeLessThan(
    exported.indexOf("charset=")
  )
  expect(exported).toContain('href="#chapter"')
  expect(exported).toContain('href="https://example.test/a?x=1&amp;y=2"')
  expect(exported).toContain('rel="noopener noreferrer" target="_blank"')
  expect(exported).not.toMatch(/javascript:|forged\.test|<script|<form|secret/)
  const parsed = new DOMParser().parseFromString(exported, "text/html")
  expect(parsed.querySelector("[data-web-link]")).toBeNull()
  expect(result.preview.html).not.toContain("href=")
  expect(result.preview.html).toContain('data-web-link="#chapter"')
  for (const html of [exported, result.preview.html]) {
    expect(html).toContain("Café 中文")
    expect(html).toContain(image)
    expect(html).toContain("script-src 'none'")
    expect(html).toContain("img-src data:")
  }
  expect(TestImage.images).toHaveLength(1)
  expect(TestImage.images[0]!.removeAttribute).toHaveBeenCalledWith("src")
})

test("rejects empty content, missing resources and unsupported image URLs before decoding", async () => {
  const signal = new AbortController().signal
  await expect(
    exportWebDocument("<script>bad()</script>", signal, "Section")
  ).rejects.toThrow("invalid")
  await expect(
    exportWebDocument('<p>Text</p><img src="missing.png">', signal, "Section")
  ).rejects.toThrow("unsupported")
  await expect(
    exportWebDocument("<p>Text</p><img>", signal, "Section")
  ).rejects.toThrow("unsupported")
  expect(TestImage.images).toHaveLength(0)
})

test("rejects image decode failures and genuine allocation failures", async () => {
  TestImage.fail = true
  await expect(
    exportWebDocument(
      `<img src="${image}">`,
      new AbortController().signal,
      "Section"
    )
  ).rejects.toThrow("unsupported")
  TestImage.fail = false
  TestImage.width = 0
  await expect(
    exportWebDocument(
      `<img src="${image}">`,
      new AbortController().signal,
      "Section"
    )
  ).rejects.toThrow("unsupported")
  TestImage.throwing = true
  await expect(
    exportWebDocument(
      `<img src="${image}">`,
      new AbortController().signal,
      "Section"
    )
  ).rejects.toThrow("allocation")
  expect(
    TestImage.images.every((img) => img.removeAttribute.mock.calls.length === 1)
  ).toBe(true)
})

test("cancels image decoding and discards a result canceled before serialization", async () => {
  TestImage.manual = true
  const controller = new AbortController()
  const pending = exportWebDocument(
    `<img src="${image}">`,
    controller.signal,
    "Section"
  )
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(TestImage.images[0]!.removeAttribute).toHaveBeenCalledWith("src")
  await expect(
    exportWebDocument("Text", controller.signal, "Section")
  ).rejects.toMatchObject({ name: "AbortError" })
  const next = new AbortController()
  const late = exportWebDocument(`<img src="${image}">`, next.signal, "Section")
  TestImage.images.at(-1)!.onload!()
  next.abort()
  await expect(late).rejects.toMatchObject({ name: "AbortError" })
})
