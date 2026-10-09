// @vitest-environment jsdom
import { expect, test } from "vitest"
import { sanitizePage } from "./sanitize"
const svg = (content: string, attributes = 'viewBox="0 0 800 1100"') =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${attributes}>${content}</svg>`
test("retains Korean text, table geometry, embedded raster images and local clips", () => {
  const result = sanitizePage(
    svg(
      '<defs><clipPath id="c"><rect width="2" height="2"/></clipPath></defs><text style="font-family:serif;fill:#000">한글 River</text><image href="data:image/png;base64,AAAA"/><g clip-path="url(#c)"/>'
    )
  )
  expect(result).toMatchObject({ width: 800, height: 1100 })
  expect(result.svg).toContain("한글 River")
  expect(result.svg).toContain("data:image/png;base64,AAAA")
  expect(result.svg).toContain("url(#c)")
})
test("makes active and external SVG content inert", () => {
  const result = sanitizePage(
    svg(
      '<script>alert(1)</script><foreignObject><iframe src="https://example.invalid"/></foreignObject><style>@import "https://example.invalid";</style><image href="https://example.invalid/image"/><image href="data:image/svg+xml;base64,PHN2Zy8+"/><g style="fill:url(https://example.invalid/a)"/><g style="fill:im\\61ge(\'x\')"/><rect onclick="fetch(1)"/><a href="https://example.invalid"><text>link</text></a><use href="#symbol"/>'
    )
  )
  expect(result.svg).not.toMatch(
    /script|foreignObject|iframe|https:|onclick|PHN2Zy8\+|@import|im\\61ge/
  )
})
test.each([
  "<html/>",
  svg("", 'width="NaN" height="1"'),
  svg("", 'viewBox="0 0 -1 2"'),
  svg("", 'viewBox="0 0 2 0"'),
])("rejects malformed page bounds", (source) => {
  expect(() => sanitizePage(source)).toThrow("pageError")
})
test("reads explicit page dimensions when there is no viewBox", () => {
  expect(sanitizePage(svg("", 'width="400px" height="500px"'))).toMatchObject({
    width: 400,
    height: 500,
  })
})
test("retains text when removing a hyperlink wrapper and blocks CSS image sources on the root", () => {
  const result = sanitizePage(
    svg(
      '<a href="https://example.invalid"><text>Readable link</text></a><g style="background-image:image-set(&quot;https://example.invalid/x&quot; 1x)"/><g style="fill:url(https://example.invalid/a)"/>',
      'width="400" height="500" style="background-image:url(https://example.invalid/root)"'
    )
  )
  expect(result.svg).toContain("Readable link")
  expect(result.svg).not.toContain("https://")
})
test("retains nested vector charts while sanitizing every level", () => {
  const inner = svg(
    '<script>alert(1)</script><rect fill="red" width="20" height="30"/><image href="https://example.invalid/pixel"/>'
  )
  const middle = svg(
    `<image href="data:image/svg+xml;base64,${btoa(inner)}"/><text>Chart label</text>`
  )
  const result = sanitizePage(
    svg(`<image href="data:image/svg+xml;base64,${btoa(middle)}"/>`)
  )
  const page = new DOMParser().parseFromString(result.svg, "image/svg+xml")
  const chart = decodeURIComponent(
    page
      .querySelector("image")!
      .getAttribute("href")!
      .split(",")
      .slice(1)
      .join(",")
  )
  expect(chart).toContain("Chart label")
  const nested = new DOMParser().parseFromString(chart, "image/svg+xml")
  const shape = decodeURIComponent(
    nested
      .querySelector("image")!
      .getAttribute("href")!
      .split(",")
      .slice(1)
      .join(",")
  )
  expect(shape).toContain('fill="red"')
  expect(shape).not.toMatch(/script|https:/)
})
test("removes corrupt or non-SVG embedded vector content", () => {
  const result = sanitizePage(
    svg(
      '<image href="data:image/svg+xml;base64,===="/><image href="data:image/svg+xml;base64,/w=="/><image href="data:image/svg+xml;base64,PGh0bWwvPg=="/>'
    )
  )
  expect(result.svg).not.toContain("href=")
  expect(result.limited).toBe(true)
})
