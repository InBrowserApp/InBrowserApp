import { describe, expect, test } from "vitest"
import { inflateSync } from "node:zlib"
import { createPdf } from "./export-pdf"
import { millimeters, pageLayout, prepareSvg } from "./svg"

const ns = 'xmlns="http://www.w3.org/2000/svg"'

function svg(attributes = "", content = "") {
  return `<svg ${ns} ${attributes}>${content}</svg>`
}

describe("SVG page dimensions", () => {
  test.each([
    ['width="960" height="480"', 960, 480],
    ['width="2in" height="72pt"', 192, 96],
    ['viewBox="-10, 20, 640, 400"', 640, 400],
    ['width="100%" viewBox="0 0 640 400"', 640, 400],
    ['width="320" viewBox="0 0 640 400"', 320, 200],
    ['height="200" viewBox="0 0 640 400"', 320, 200],
    ['style="width: 96px; height: 48px"', 96, 48],
    ["", 300, 150],
  ])("uses the canvas dimensions from %s", (attributes, width, height) => {
    expect(prepareSvg(svg(attributes))).toMatchObject({ width, height })
  })

  test.each(["no SVG here", svg('width="0"'), svg('height="1e309"')])(
    "rejects an unreadable canvas %s",
    (source) => expect(() => prepareSvg(source)).toThrow(/Invalid SVG/)
  )

  test("centers artwork in a landscape A4 sheet and uses 12 mm margins", () => {
    const layout = pageLayout({ width: 640, height: 400 }, "a4")
    expect(millimeters(layout.width)).toBeCloseTo(297)
    expect(millimeters(layout.height)).toBeCloseTo(210)
    expect(millimeters(layout.x)).toBeCloseTo(12)
    expect(millimeters(layout.y)).toBeGreaterThan(12)
    expect(layout.artworkWidth / layout.artworkHeight).toBeCloseTo(1.6)
    expect(layout.x * 2 + layout.artworkWidth).toBeCloseTo(layout.width)
  })

  test("fits portrait artwork on a Letter sheet", () => {
    const layout = pageLayout({ width: 200, height: 300 }, "letter")
    expect(millimeters(layout.width)).toBeCloseTo(215.9)
    expect(millimeters(layout.height)).toBeCloseTo(279.4)
    expect(layout.y * 2 + layout.artworkHeight).toBeCloseTo(layout.height)
  })

  test("preserves proportions when the original exceeds the PDF page limit", () => {
    const layout = pageLayout({ width: 30_000, height: 15_000 }, "original")
    expect(millimeters(layout.width)).toBeCloseTo(5080)
    expect(layout.artworkWidth / layout.artworkHeight).toBe(2)
  })
})

describe("SVG preparation", () => {
  test("accepts a missing default namespace and normalizes SVG prefixes", () => {
    expect(
      prepareSvg('<svg width="100" height="50"><rect/></svg>').root.namespaceURI
    ).toBe("http://www.w3.org/2000/svg")
    const prefixed = prepareSvg(
      '<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:rect id="box"/></s:svg>'
    )
    expect(prefixed.root.tagName).toBe("svg")
    expect(prefixed.root.firstElementChild?.tagName).toBe("rect")
  })

  test("keeps local references and embedded bitmaps and removes unresolved and external references", () => {
    const embedded = "data:image/png;base64,AABB"
    const { root } = prepareSvg(
      svg(
        'xmlns:xlink="http://www.w3.org/1999/xlink"',
        `
      <rect id="shape"/>
      <use id="keep" href=" #shape "/>
      <use id="missing" href="#missing-shape"/>
      <image id="external" xlink:href="https://example.com/art.png"/>
      <image id="bitmap" href="${embedded}"/>
      <a id="link" href="https://example.com"><rect/></a>
    `
      )
    )
    expect(root.querySelector("#keep")?.getAttribute("href")).toBe("#shape")
    expect(root.querySelector("#missing")?.hasAttribute("href")).toBe(false)
    expect(root.querySelector("#external")?.hasAttribute("xlink:href")).toBe(
      false
    )
    expect(root.querySelector("#bitmap")?.getAttribute("href")).toBe(embedded)
    expect(root.querySelector("#link")?.hasAttribute("href")).toBe(false)
  })

  test("converts object-bounding-box gradient percentages into fractions", () => {
    const { root } = prepareSvg(
      svg(
        "",
        `
      <linearGradient id="box" x2="75%"/>
      <radialGradient id="user" gradientUnits="userSpaceOnUse" r="100"/>
    `
      )
    )
    expect(root.querySelector("#box")?.getAttribute("x2")).toBe("0.75")
    expect(root.querySelector("#user")?.getAttribute("r")).toBe("100")
  })
})

test("exports PDF vector drawing commands at the original physical size", async () => {
  const doc = await createPdf(
    prepareSvg(
      svg(
        'width="960" height="480"',
        '<path d="M0 0C5 10 15 15 30 0" fill="none" stroke="#00f"/>'
      )
    ),
    "original"
  )
  const data = doc.output()
  const start = data.indexOf("stream\n") + "stream\n".length
  const end = data.indexOf("\nendstream", start)
  const instructions = inflateSync(
    Buffer.from(data.slice(start, end), "latin1")
  ).toString()

  expect(data).toContain("/MediaBox [0 0 720. 360.]")
  expect(data).not.toContain("/Subtype /Image")
  expect(instructions).toMatch(/5\. 10\. 15\. 15\. 30\. 0\. c\nS/)
})
