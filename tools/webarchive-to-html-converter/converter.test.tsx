// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { buildBinaryPlist, buildXmlPlist } from "rork-plist"
import type { PlistValue } from "rork-plist"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import { convertWebArchive } from "./convert"
import m from "./messages/en.json"

afterEach(cleanup)
const utf8 = new TextEncoder()
const url = "https://example.org/market/index.html"
const png = Uint8Array.of(0x89, 0x50, 0x4e, 0x47)
const resource = (
  path: string,
  type: string,
  contents: string | Uint8Array
) => ({
  WebResourceURL: path,
  WebResourceMIMEType: type,
  WebResourceData:
    typeof contents === "string" ? utf8.encode(contents) : contents,
})
const archive = (html: string, extras: PlistValue[] = []) => ({
  WebMainResource: resource(url, "text/html", html),
  WebSubresources: extras,
})
const parse = (html: string) =>
  new DOMParser().parseFromString(html, "text/html")

test("inlines assets in HTML, linked CSS, and inline styles, retaining language and local bookmarks", () => {
  const bytes = buildBinaryPlist(
    archive(
      '<html lang="ar" dir="rtl"><head><title>سوق</title><link rel="stylesheet" href="css/page.css"><link rel="canonical" href="https://example.org/market/"><style>aside{background-image:url(photo.png)}</style></head><body><p id="top" style="background-image:url(photo.png)">Market</p><img src="photo.png" srcset="unused.png 2x"><a href="./other.html#section">Other</a><a href="#top">Top</a></body></html>',
      [
        resource(
          "https://example.org/market/css/page.css",
          "text/css",
          "p { background-image:url(../photo.png) }"
        ),
        resource("https://example.org/market/photo.png", "image/png", png),
      ]
    )
  )
  const output = convertWebArchive(bytes, m.preview)
  const doc = parse(output.html)
  expect(output).toMatchObject({ title: "سوق", missing: false })
  expect(doc.documentElement.getAttribute("lang")).toBe("ar")
  expect(doc.documentElement.dir).toBe("rtl")
  expect(doc.querySelector("img")?.getAttribute("src")).toBe(
    "data:image/png;base64,iVBORw=="
  )
  expect(doc.querySelector("img")?.hasAttribute("srcset")).toBe(false)
  expect(doc.querySelector("[style]")?.getAttribute("style")).toContain(
    "data:image/png;base64,iVBORw=="
  )
  expect(
    doc.head.textContent?.match(/data:image\/png;base64,iVBORw==/g)
  ).toHaveLength(2)
  expect(doc.querySelectorAll("a")[0]?.href).toBe(
    "https://example.org/market/other.html#section"
  )
  expect(doc.querySelectorAll("a")[1]?.getAttribute("href")).toBe("#top")
})

test("converts XML archives while preserving recoverable text and omitting active and missing content", () => {
  const source = archive(
    '<base href="/assets/"><link rel="stylesheet" href="missing.css"><link rel="stylesheet" media="screen" href="saved.css"><p>Saved content</p><img src="https://missing.example/photo.png"><a href="javascript:alert(1)">Unsupported link</a><script>window.evil = 1</script><iframe src="https://missing.example/frame"></iframe>',
    [
      false,
      resource(
        "https://example.org/assets/saved.css",
        "text/css",
        "p { color: red }"
      ),
    ]
  )
  const output = convertWebArchive(
    utf8.encode(buildXmlPlist(source)),
    m.preview
  )
  const doc = parse(output.html)
  expect(output.missing).toBe(true)
  expect(doc.body.textContent).toContain("Saved content")
  expect(doc.head.textContent).toContain("@media screen")
  expect(
    doc.querySelector("meta[http-equiv]")?.getAttribute("content")
  ).toContain("default-src 'none'")
  expect(
    doc.querySelector("link, img[src], a[href], script, iframe")
  ).toBeNull()
})

test("reads the resource's Safari encoding and handles a missing subresource list", () => {
  const bytes = buildBinaryPlist({
    WebMainResource: {
      ...resource(
        url,
        "text/html",
        Uint8Array.from([60, 112, 62, 128, 60, 47, 112, 62])
      ),
      WebResourceTextEncodingName: "windows-1252",
    },
    WebSubframeArchives: [],
  })
  const output = convertWebArchive(bytes, m.preview)
  expect(output.html).toContain("€")
  expect(output.missing).toBe(false)
})

test("offers an HTML file even when a stylesheet is missing and allows retrying after an error", async () => {
  const file = (bytes: Uint8Array, name: string) => {
    const input = new File([new Uint8Array(bytes)], name)
    Object.defineProperty(input, "arrayBuffer", {
      value: async () => new Uint8Array(bytes).buffer,
    })
    return input
  }
  render(<Client messages={m} />)
  const picker = screen.getByLabelText(m.open)
  const click = vi.spyOn(picker, "click")
  fireEvent.click(screen.getByRole("button", { name: m.open }))
  expect(click).toHaveBeenCalledOnce()
  fireEvent.change(picker, {
    target: {
      files: [file(buildBinaryPlist({ example: true }), "bad.webarchive")],
    },
  })
  await screen.findByText(m.invalid)
  fireEvent.change(picker, {
    target: {
      files: [
        file(
          buildBinaryPlist(
            archive(
              '<title>Daily</title><p>Safe</p><link rel="stylesheet" href="missing.css">'
            )
          ),
          "daily.webarchive"
        ),
      ],
    },
  })
  await screen.findByText(m.missing)
  expect(screen.getByText("Daily")).toBeTruthy()
  expect(
    (await screen.findByRole("link", { name: m.download })).getAttribute(
      "download"
    )
  ).toBe("daily.html")
  expect(screen.getByTitle(m.preview).getAttribute("srcdoc")).toContain("Safe")
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("opens the built-in archive and shows its saved page", async () => {
  const original = Object.getOwnPropertyDescriptor(
    File.prototype,
    "arrayBuffer"
  )
  Object.defineProperty(File.prototype, "arrayBuffer", {
    configurable: true,
    value(this: File) {
      return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as ArrayBuffer)
        reader.onerror = reject
        reader.readAsArrayBuffer(this)
      })
    },
  })
  try {
    render(<Client messages={m} />)
    fireEvent.click(screen.getByRole("button", { name: m.example }))
    await waitFor(() =>
      expect(screen.getByTitle(m.preview).getAttribute("srcdoc")).toContain(
        "Saturday at the market"
      )
    )
    expect(screen.queryByText(m.missing)).toBeNull()
  } finally {
    if (original) Object.defineProperty(File.prototype, "arrayBuffer", original)
    else Reflect.deleteProperty(File.prototype, "arrayBuffer")
  }
})
