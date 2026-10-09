// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { preparePreview } from "./preview"
import type { Email } from "./types"
const create = vi.fn(() => "blob:http://local/included-image")
const revoke = vi.fn()
beforeEach(() => {
  vi.stubGlobal(
    "URL",
    class extends URL {
      static override createObjectURL = create
      static override revokeObjectURL = revoke
    }
  )
  vi.clearAllMocks()
})
afterEach(() => vi.unstubAllGlobals())
const message = (html: string): Email => ({
  format: "EML",
  subject: "",
  from: "",
  to: "",
  cc: "",
  bcc: "",
  date: "",
  text: "",
  html,
  notices: [],
  attachments: [
    {
      name: "image.png",
      type: "image/png",
      size: 1,
      kind: "inline",
      cid: "image@local",
      bytes: new Uint8Array([1]),
    },
  ],
})

test("keeps text, safe layout and owned CID images under a first-in-head CSP", () => {
  const preview = preparePreview(
    message(
      '<html><head><style>p{color:red}</style></head><body><h1>世界</h1><img src="cid:image%40local" alt="Local image"><table><tr><td>Hello</td></tr></table></body></html>'
    )
  )
  const document = new DOMParser().parseFromString(preview.html, "text/html")
  expect(document.head.firstElementChild?.getAttribute("http-equiv")).toBe(
    "Content-Security-Policy"
  )
  expect(document.head.firstElementChild?.getAttribute("content")).toContain(
    "default-src 'none'"
  )
  expect(document.head.firstElementChild?.getAttribute("content")).toContain(
    "script-src 'none'"
  )
  expect(document.querySelector("img")?.getAttribute("src")).toBe(
    "blob:http://local/included-image"
  )
  expect(document.querySelector("td")?.textContent).toBe("Hello")
  expect(document.querySelector("h1")?.textContent).toBe("世界")
  expect(preview.limited).toBe(false)
  preview.dispose()
  expect(revoke).toHaveBeenCalledWith("blob:http://local/included-image")
})

test("removes script, frame, SVG, event, form and every navigable link surface", () => {
  const preview = preparePreview(
    message(
      `<base href="https://tracking.invalid"><meta http-equiv="refresh" content="0;url=https://tracking.invalid"><script>top.alert(1)</script><iframe srcdoc="bad"></iframe><object data="bad"></object><form action="https://tracking.invalid"><input autofocus><button>Send</button></form><svg><a href="https://tracking.invalid">go</a></svg><math href="bad"><mi>x</mi></math><a href="https://tracking.invalid" ping="https://tracking.invalid" target="_top" download>Link</a><map><area href="https://tracking.invalid"></map><div onclick="bad()" contenteditable data-command="bad">Text</div>`
    )
  )
  const document = new DOMParser().parseFromString(preview.html, "text/html")
  expect(
    document.querySelector(
      "script,iframe,object,form,input,button,svg,math,base"
    )
  ).toBeNull()
  expect(
    document.querySelector(
      "[href],[ping],[onclick],[contenteditable],[data-command],[target],[download]"
    )
  ).toBeNull()
  expect(document.querySelectorAll("meta")).toHaveLength(1)
  expect(document.body.textContent).toContain("Link")
  expect(preview.limited).toBe(true)
})

test("blocks remote/relative/blob/svg sources and srcset while retaining included raster data", () => {
  const preview = preparePreview(
    message(
      '<img src="https://tracking.invalid"><img src="/relative"><img src="blob:unowned"><img src="data:image/svg+xml,test"><img srcset="https://tracking.invalid 2x"><img src="cid:missing"><img src="cid:%invalid"><img src="data:image/png;base64,AAAA"><div background="https://tracking.invalid" style="background:url(https://tracking.invalid)">Local text</div><style>@import "https://tracking.invalid";</style>'
    )
  )
  const document = new DOMParser().parseFromString(preview.html, "text/html")
  expect(Array.from(document.images, (img) => img.getAttribute("src"))).toEqual(
    [null, null, null, null, null, null, null, "data:image/png;base64,AAAA"]
  )
  expect(document.querySelector("[srcset],[background]")).toBeNull()
  expect(preview.limited).toBe(true)
  expect(
    document.head.firstElementChild?.getAttribute("content")
  ).not.toContain("https:")
})

test("does not allocate blobs for unsupported or missing inline content", () => {
  const email = message("<p>Read me</p>")
  email.attachments.push(
    {
      name: "vector.svg",
      type: "image/svg+xml",
      size: 1,
      kind: "attachment",
      cid: "vector",
      bytes: new Uint8Array([1]),
    },
    {
      name: "broken",
      type: "image/png",
      size: null,
      kind: "inline",
      cid: "missing",
    }
  )
  const preview = preparePreview(email)
  expect(create).toHaveBeenCalledTimes(1)
  preview.dispose()
})

test("releases already allocated URLs when preparation fails", () => {
  const email = message("<p>test</p>")
  email.attachments.push({ ...email.attachments[0]! })
  create
    .mockImplementationOnce(() => "blob:first")
    .mockImplementationOnce(() => {
      throw new RangeError("memory")
    })
  expect(() => preparePreview(email)).toThrow("memory")
  expect(revoke).toHaveBeenCalledWith("blob:first")
})

test("removes CSS resource references, including escaped and image-set tokens, before parsing the frame", () => {
  const preview = preparePreview(
    message(
      String.raw`<style>@import "https://tracking.invalid/style";</style><style>.a { background: u\72l(https://tracking.invalid/escaped) }</style><style>.b { background: image-set("https://tracking.invalid/set" 1x) }</style><div style="background:url(https://tracking.invalid/inline)">Content</div><p style="color:navy">Safe color</p>`
    )
  )
  const document = new DOMParser().parseFromString(preview.html, "text/html")
  expect(preview.html).not.toContain("tracking.invalid")
  expect(document.querySelector("div")?.hasAttribute("style")).toBe(false)
  expect(document.querySelector("p")?.getAttribute("style")).toBe("color:navy")
  expect(preview.limited).toBe(true)
})

test("places plain text literally in an isolated document without interpreting markup", () => {
  const email = message("")
  email.text =
    '<script>top.alert(1)</script>\n<img src="https://tracking.invalid"> & <a href="bad">Link</a>\n> Quoted reply مرحبا'
  const preview = preparePreview(email)
  const document = new DOMParser().parseFromString(
    preview.plainHtml,
    "text/html"
  )
  expect(document.head.firstElementChild?.getAttribute("http-equiv")).toBe(
    "Content-Security-Policy"
  )
  expect(document.querySelector("pre")?.textContent).toBe(email.text)
  expect(document.querySelector("pre")?.getAttribute("dir")).toBe("auto")
  expect(document.querySelector("script,img,a")).toBeNull()
  expect(preview.limited).toBe(false)
})
