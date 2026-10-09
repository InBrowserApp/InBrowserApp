// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, test, vi } from "vitest"
import { parse } from "css-tree"
import { prepare } from "./prepare"
import { dimensions } from "./dimensions"
import { staticRaster } from "./raster"
import { presentationValue, safeValue, staticCss } from "./static-css"

vi.mock("css-tree", async (original) => {
  const module = await original<typeof import("css-tree")>()
  return { ...module, parse: vi.fn(module.parse) }
})

const wrap = (body: string, attrs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${body}</svg>`
const fixture = (name: string) =>
  readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8")

test("preserves genuine W3C illustrations and the local gradient, mask, filter and embedded PNG", () => {
  for (const name of [
    "w3c-viewbox.svg",
    "w3c-gradient.svg",
    "coastal-notes.svg",
  ]) {
    const value = prepare(fixture(name))
    expect(value.omitted).toBe(false)
    expect(value.empty).toBe(false)
    expect(value.absolute).toBe(name !== "w3c-gradient.svg")
    expect(value.svg).toContain("<svg")
  }
  const value = prepare(fixture("coastal-notes.svg"))
  expect(value).toMatchObject({
    width: 960,
    height: 600,
    viewBox: "-80 -40 960 600",
  })
  expect(value.svg).toContain('mask="url(#mist)"')
  expect(value.svg).toContain("data:image/png;base64,")
  expect(value.svg).toContain("feGaussianBlur")
})

test("rebuilds XML namespaces without activating markup, external resources, scripts or animation", () => {
  const value = prepare(fixture("active-content.svg"))
  expect(value.omitted).toBe(true)
  expect(value.svg).not.toMatch(
    /https:|onload|<script|<foreignObject|<animate|@import|@font-face|@keyframes|animation:|data:image\/svg/i
  )
  expect(value.svg).toContain("fill:#278686")
  expect(value.svg).toContain("Static safe preview")
  const namespaced = prepare(
    `<s:svg xmlns:s="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink" xmlns:other="urn:other" xml:space="preserve" xml:lang="en" xml:base="https://svg-test.invalid/" other:flag="x"><s:defs><s:g id="a"/></s:defs><s:use x:href="#a" x:title="local"/><other:script><s:rect/></other:script><s:rect onclick="x" autofocus="true" tabindex="0" fill="url(https://svg-test.invalid/p.svg)"/></s:svg>`
  )
  expect(namespaced.svg).toContain('xml:space="preserve"')
  expect(namespaced.svg).toContain('xml:lang="en"')
  expect(namespaced.svg).toContain('xlink:href="#a"')
  expect(namespaced.svg).not.toMatch(
    /other:|xml:base|onclick|autofocus|tabindex|xlink:title|https:/
  )
})

test("escapes text, attributes and CSS and preserves safe CDATA and fragment references", () => {
  const value = prepare(
    wrap(
      `<title>&lt;script&gt; &amp; &quot;title&quot;</title><style><![CDATA[.a{fill:rgb(2,3,4);stroke:url('#g');animation:spin 1s}]]></style><text data-title="&quot;&amp;&lt;&gt;" style="fill:red;stroke:url(https://svg-test.invalid/x)"><![CDATA[<test> & text]]></text><a href="#local"><text>Link</text></a>`
    )
  )
  expect(value.svg).toContain("&lt;script&gt; &amp; &quot;title&quot;")
  expect(value.svg).toContain("&lt;test&gt; &amp; text")
  expect(value.svg).toContain('style="fill:red"')
  expect(value.svg).toContain('href="#local"')
  expect(value.omitted).toBe(true)
})

test("rejects malformed XML, wrong namespaces, invalid bounds and document type declarations", () => {
  for (const source of [
    "",
    "text",
    "<svg/>",
    "<x xmlns='http://www.w3.org/2000/svg'/>",
    wrap("<rect>"),
    wrap("", 'viewBox="0 0 -1 20"'),
    `<!DOCTYPE svg [<!ENTITY x SYSTEM "https://svg-test.invalid/x">]>${wrap("&x;")}`,
  ])
    expect(() => prepare(source)).toThrow(/INVALID|DOCTYPE|tag|root|document/i)
  expect(() =>
    prepare(`<!DOCTYPE svg SYSTEM "https://svg-test.invalid/dtd">${wrap("")}`)
  ).toThrow("DOCTYPE")
})

test("does not infer visible content from definitions or omitted controls and imposes no element cap", () => {
  expect(
    prepare(
      wrap(
        "<defs><rect/></defs><symbol><circle/></symbol><foreignObject><input/></foreignObject>"
      )
    ).empty
  ).toBe(true)
  const value = prepare(wrap('<rect width="1" height="1"/>'.repeat(1001)))
  expect(value.svg.match(/<rect/g)).toHaveLength(1001)
  expect(value.empty).toBe(false)
})

describe("dimensions", () => {
  test("preserves absolute units, unusual bounds and aspect ratio for incomplete dimensions", () => {
    expect(dimensions("1in", "72pt", "-5 -8 200 300")).toEqual({
      width: 96,
      height: 96,
      absolute: true,
      viewBox: "-5 -8 200 300",
    })
    expect(dimensions("2.54cm", "25.4mm", "")).toMatchObject({
      width: 96,
      height: 96,
    })
    expect(dimensions("6pc", "101.6Q", "")).toMatchObject({
      width: 96,
      height: 96,
    })
    expect(dimensions("+1e2px", ".5e2", "")).toMatchObject({
      width: 100,
      height: 50,
    })
    expect(dimensions("100%", "auto", "-20, -10, 400, 200")).toEqual({
      width: 400,
      height: 200,
      absolute: false,
      viewBox: "-20 -10 400 200",
    })
    expect(dimensions("", "100", "0 0 600 200")).toMatchObject({
      width: 300,
      height: 100,
    })
    expect(dimensions("600", "", "0 0 600 200")).toMatchObject({
      width: 600,
      height: 200,
    })
    expect(dimensions("", "", "")).toEqual({
      width: 300,
      height: 150,
      absolute: false,
      viewBox: "0 0 300 150",
    })
    expect(dimensions("NaN", "auto", "")).toMatchObject({
      width: 300,
      height: 150,
    })
    expect(() => dimensions("1e999", "", "")).toThrow("overflow")
    expect(() => dimensions("0", "10", "")).toThrow("INVALID")
    expect(() => dimensions("10", "-10", "")).toThrow("INVALID")
    expect(() => dimensions("", "100", "0 0 1e-308 1e308")).toThrow("overflow")
    expect(() => dimensions("100", "", "0 0 1e308 1e-308")).toThrow("overflow")
    expect(() => dimensions("", "1e308", "0 0 1e308 1")).toThrow(RangeError)
    for (const viewBox of ["0 0 0 2", "0 0 2 -1", "0 0 1", "0 0 NaN 3"])
      expect(() => dimensions("", "", viewBox)).toThrow("INVALID")
  })
})

test("retains only parsed static CSS declarations and local paint-server references", () => {
  const result = staticCss(
    String.raw`@import 'https://svg-test.invalid/x'; @media screen {rect{fill:blue}} rect{f\69ll:red;stroke:url('#paint');animation:move 1s;--x:url(https://svg-test.invalid/x);filter:u\72l(https://svg-test.invalid/filter);color:var(--x);width:attr(data-width);height:env(x)} broken !!;`
  )
  expect(result.omitted).toBe(true)
  expect(result.css).not.toMatch(/https:|animation|@|--x|var\(|attr\(|env\(/)
  expect(result.css).toContain("red")
  expect(staticCss("fill:blue;stroke-width:2", true)).toEqual({
    css: "fill:blue;stroke-width:2",
    omitted: false,
  })
  expect(presentationValue("url('#local') red")).toBe(true)
  expect(presentationValue("url('https://svg-test.invalid/x')")).toBe(false)
  expect(presentationValue('url("')).toBe(false)
  expect(safeValue({ type: "Raw", value: "malformed" })).toBe(false)
})

test("retains embedded static raster images while excluding animated, nested and malformed data", () => {
  const png = fixture("coastal-notes.svg").match(
    /data:image\/png;base64,[^"]+/
  )![0]
  expect(staticRaster(png)).toBe(true)
  expect(
    staticRaster("data:image/jpeg;base64," + btoa("\xff\xd8\xffx\xff\xd9"))
  ).toBe(true)
  for (const value of [
    "https://svg-test.invalid/x.png",
    "data:image/svg+xml;base64,PHN2Zy8+",
    "data:image/gif;base64,R0lGODlh",
    "data:image/png;base64,A",
    "data:image/png;base64,AAAA",
    "data:image/jpeg;base64,AAAA",
    "data:image/webp;base64,AAAA",
    "data:image/webp;base64," + btoa("RIFFxxxxWEBPANIM"),
    "data:image/png;base64," + btoa("\x89PNG\r\n\x1a\n"),
    "data:image/png;base64," + btoa("\x89PNG\r\n\x1a\n\0\0\0\0acTLxxxx"),
    "data:image/png;base64," + btoa("\x89PNG\r\n\x1a\n\0\0\0\x40IDATxxxx"),
  ])
    expect(staticRaster(value)).toBe(false)
})

test("reads WebP chunk boundaries and animation flags without matching image payload text", () => {
  const size = (value: number) => {
    const bytes = Buffer.alloc(4)
    bytes.writeUInt32LE(value)
    return bytes
  }
  const chunk = (name: string, value: string) =>
    Buffer.concat([
      Buffer.from(name),
      size(value.length),
      Buffer.from(value, "binary"),
      ...(value.length % 2 ? [Buffer.from([0])] : []),
    ])
  const riff = (...chunks: Buffer[]) => {
    const body = Buffer.concat([Buffer.from("WEBP"), ...chunks])
    return (
      "data:image/webp;base64," +
      Buffer.concat([Buffer.from("RIFF"), size(body.length), body]).toString(
        "base64"
      )
    )
  }
  const frame = chunk("VP8 ", "ANIM in a static image payload")
  expect(staticRaster(riff(frame))).toBe(true)
  expect(
    staticRaster(
      riff(
        chunk("VP8X", "\0".repeat(10)),
        chunk("VP8L", "static"),
        chunk("EXIF", "ANIM metadata")
      )
    )
  ).toBe(true)
  for (const chunks of [
    [],
    [chunk("ANIM", "")],
    [chunk("ANMF", "")],
    [chunk("VP8X", "short"), frame],
    [chunk("VP8X", "\x02" + "\0".repeat(9)), frame],
    [Buffer.concat([Buffer.from("VP8 "), size(100)])],
    [Buffer.concat([Buffer.from("VP8 "), size(1), Buffer.from([0])])],
    [frame, Buffer.from([0])],
  ])
    expect(staticRaster(riff(...chunks))).toBe(false)
  expect(staticRaster("data:image/webp;base64," + btoa("RIFFxxxxWRONG"))).toBe(
    false
  )
})

test("does not turn raster allocation or unexpected decoder errors into silent omissions", () => {
  const decode = vi.spyOn(globalThis, "atob")
  for (const reason of [
    new RangeError("raster allocation"),
    new DOMException("decoder stopped", "AbortError"),
  ]) {
    decode.mockImplementationOnce(() => {
      throw reason
    })
    expect(() => staticRaster("data:image/png;base64,AAAA")).toThrow(
      reason.message
    )
  }
  decode.mockRestore()
})

test("malformed CSS is omitted but parser allocation failures reach the resource error", () => {
  for (const run of [
    () => staticCss("fill:red", true),
    () => presentationValue("red"),
  ]) {
    vi.mocked(parse).mockImplementationOnce(() => {
      throw new RangeError("CSS allocation")
    })
    expect(run).toThrow("CSS allocation")
  }
  vi.mocked(parse).mockImplementationOnce(() => {
    throw new SyntaxError("damaged CSS")
  })
  expect(staticCss("bad CSS")).toEqual({ css: "", omitted: true })
  expect(presentationValue(")")).toBe(false)
})
