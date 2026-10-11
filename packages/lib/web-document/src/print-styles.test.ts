import { expect, test } from "vitest"
import { printStyles } from "./print-styles"

test("keeps print/all rules and refuses unsupported CSS constructs", () => {
  expect(printStyles("@media all {a {color:red}}")).toContain("#pdf-content a")
  for (const css of [
    "@font-face{font-family:Included;src:url(data:font/woff2;base64,AA==)}",
    "@supports(display:grid){p{display:grid}}",
    "@unknown;",
    "broken",
  ])
    expect(() => printStyles(css)).toThrow(Error)
  expect(printStyles("")).toBe("")
})

test("removes keep constraints from source CSS without losing explicit breaks", () => {
  const css = printStyles(
    "h1{break-after:avoid;page-break-inside:avoid;color:red}p{break-before:page}"
  )
  expect(css).not.toContain("avoid")
  expect(css).toContain("break-before:page")
  expect(css).toContain("color:red")
})
