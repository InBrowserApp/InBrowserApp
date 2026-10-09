// @vitest-environment jsdom
import { expect, test } from "vitest"
import { prepareWebDocument } from "./index"
import { cleanStyle } from "./styles"
const options = { emptyText: "No content", headingText: "Untitled heading" }
const parse = (html: string) =>
  new DOMParser().parseFromString(html, "text/html")

test("preserves standalone content, styling, title, images, anchors and scrollable wide content", () => {
  const result = prepareWebDocument(
    '<title>Field notes</title><style>h1 {color: red} @media(min-width:1px){p{color:blue}}</style><h1 id="start">Start</h1><h2></h2><p style="font-weight: bold">Text</p><img src="data:image/png;base64,AA=="><a href="#start">Back</a><a href="https://example.org/">External</a><a name="legacy">Bookmark</a><table><tr><td>A</td></tr></table><pre>Wide code</pre>',
    options
  )
  const doc = parse(result.html)
  expect(result.title).toBe("Field notes")
  expect(result.empty).toBe(false)
  expect(result.outline.map((x) => [x.label, x.level])).toEqual([
    ["Start", 1],
    ["Untitled heading", 2],
  ])
  expect(doc.getElementById("start")).toBeTruthy()
  expect(doc.getElementById("legacy")).toBeTruthy()
  expect(doc.querySelectorAll("[data-web-wide]")).toHaveLength(2)
  expect(doc.querySelectorAll("[data-web-link]")).toHaveLength(2)
  expect(doc.querySelector("a[href]")).toBeNull()
  expect(doc.querySelector("p")?.style.fontWeight).toBe("bold")
  expect(doc.querySelectorAll("style")[1]?.textContent).toContain("color: red")
  expect(doc.head.firstElementChild?.getAttribute("http-equiv")).toBe(
    "Content-Security-Policy"
  )
})

test("removes active content, network paths, forged controls and dangerous styles before display", () => {
  const result = prepareWebDocument(
    '<meta http-equiv="refresh" content="0;url=https://remote.invalid"><link rel="stylesheet" href="https://remote.invalid/css"><style>@import "https://remote.invalid/import"; p {color:red;background:url(https://remote.invalid/bg)} @media(min-width:1px){p{background:image-set("https://remote.invalid/img" 1x)}}</style><script>alert(1)</script><form><input autofocus><button>Send</button><p>Readable</p></form><iframe src="https://remote.invalid/frame"></iframe><img src="folder/image.png" srcset="https://remote.invalid/img 2x"><svg><script>alert(1)</script></svg><a href="javascript:alert(1)" data-web-link="#forged">Unsafe</a><p onclick="alert(1)" style="background:url(local.png);font-size:18px">Content</p>',
    options
  )
  const doc = parse(result.html)
  expect(result.notes).toEqual({ active: true, local: true, remote: true })
  expect(
    doc.querySelector(
      "script,iframe,form,input,button,svg,link,[onclick],[srcset],[src],[data-web-link]"
    )
  ).toBeNull()
  expect(doc.head.querySelectorAll("meta")).toHaveLength(1)
  expect(doc.querySelectorAll("style")[1]?.textContent).not.toMatch(
    /url\(|image-set|@import/
  )
  expect(doc.querySelectorAll("style")[1]?.textContent).toContain("color: red")
  expect(doc.body.textContent).toContain("Readable")
})

test("handles empty and malformed HTML without a heading cap", () => {
  expect(prepareWebDocument(" ", options).empty).toBe(true)
  expect(
    prepareWebDocument("<!--comment--><script>1</script>", options).html
  ).toContain("No content")
  expect(prepareWebDocument("<h1>Title<p>Open paragraph", options).empty).toBe(
    false
  )
  expect(
    prepareWebDocument(
      Array.from({ length: 1001 }, (_, i) => `<h2>Heading ${i}</h2>`).join(""),
      options
    ).outline
  ).toHaveLength(1001)
})

test("validates XHTML and serializes XML empty elements into safe HTML", () => {
  const result = prepareWebDocument(
    '<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" dir="rtl"><head><title>Unicode</title></head><body><h1>العربية</h1><p/><p>After</p></body></html>',
    { ...options, xhtml: true }
  )
  expect(result.title).toBe("Unicode")
  const doc = parse(result.html)
  expect(doc.documentElement.dir).toBe("rtl")
  expect(doc.querySelectorAll("p")).toHaveLength(2)
  expect(() =>
    prepareWebDocument(
      '<html xmlns="http://www.w3.org/1999/xhtml"><body><p></body></html>',
      { ...options, xhtml: true }
    )
  ).toThrow("INVALID")
  expect(() =>
    prepareWebDocument("<html><body>Unnamespaced</body></html>", {
      ...options,
      xhtml: true,
    })
  ).toThrow("INVALID")
})

test("retains approved embedded CSS images and fonts while removing mixed remote fallbacks", () => {
  const result = prepareWebDocument(
    '<style>p{background-image:url("data:image/png;base64,AA==")} @font-face{font-family:Included;src:url("data:font/woff2;base64,AA==")} div{background-image:url("data:image/png;base64,AA=="),url(https://remote.invalid/image)}</style><p>Text</p>',
    options
  )
  const css = parse(result.html).querySelectorAll("style")[1]!.textContent
  expect(css).toContain("data:image/png;base64,AA==")
  // jsdom's font-face parser omits src; exercise the same value filter through
  // a custom property and verify actual embedded font CSS in real browsers.
  expect(
    cleanStyle('--font:url("data:font/woff2;base64,AA==")', {
      local: false,
      remote: false,
      active: false,
    })
  ).toContain("data:font/woff2;base64,AA==")
  expect(css).not.toContain("remote.invalid")
  expect(result.notes.remote).toBe(true)
})

test("does not reintroduce markup from XHTML CSS CDATA when serialized into HTML", () => {
  const result = prepareWebDocument(
    "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head><style><![CDATA[p::before { content: \"</style><img src='https://remote.invalid/leak' onerror='alert(1)'>\" }]]></style></head><body><p>Safe</p></body></html>",
    { ...options, xhtml: true }
  )
  const doc = parse(result.html)
  expect(doc.querySelector("img,[onerror],script")).toBeNull()
})
