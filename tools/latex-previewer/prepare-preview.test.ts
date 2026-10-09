// @vitest-environment jsdom
import { expect, test } from "vitest"
import { preparePreview } from "./prepare-preview"
import m from "./messages/en.json"

test("keeps semantic MathML, alignment, headings, and isolated wide content", () => {
  const result = preparePreview(
    '<article><h1>Title</h1><h2></h2><p><math display="inline"><mfrac><mi>x</mi><mn>2</mn></mfrac></math></p><table><tr><td style="text-align:right;font-size:1em;font-weight:bold;background:url(https://bad.invalid)">Value</td></tr></table><pre>code</pre><a href="#section">Reference</a></article>',
    ".fl-article{color:black}",
    m
  )
  const doc = new DOMParser().parseFromString(result.html, "text/html")
  expect(doc.querySelector("math mfrac mi")?.textContent).toBe("x")
  expect(doc.querySelector("[data-latex-inline-math] > math")).toBeTruthy()
  expect(
    doc.querySelector("[data-latex-inline-math]")?.getAttribute("tabindex")
  ).toBe("0")
  expect(doc.querySelector("td")?.getAttribute("style")).toContain(
    "text-align:right"
  )
  expect(doc.querySelector("td")?.getAttribute("style")).not.toContain("url")
  expect(doc.querySelectorAll("[data-latex-wide]")).toHaveLength(2)
  expect(doc.querySelector("a")?.getAttribute("data-latex-link")).toBe(
    "section"
  )
  expect(result.outline.map(({ label }) => label)).toEqual([
    "Title",
    m.documentBody,
  ])
  expect(doc.getElementById(result.outline[0]!.id)).toBeTruthy()
  expect(result.images).toBe(false)
})
test("blocks active HTML, SVG, MathML navigation and resource requests", () => {
  const result = preparePreview(
    '<script>window.pwned=1</script><style>@import "https://bad.invalid"</style><iframe src="https://bad.invalid"></iframe><math href="https://bad.invalid"><annotation-xml encoding="text/html"><img src="https://bad.invalid"></annotation-xml><mi onclick="alert(1)">x</mi></math><svg><use href="https://bad.invalid/a.svg#x"/></svg><img src="https://bad.invalid/figure.png" alt="Figure"><img><a href="javascript:alert(1)">bad</a><a href="https://bad.invalid">external</a><input autofocus><div style="font-size:var(--evil);color:red" data-latex-link="bad">safe</div>',
    "",
    m
  )
  const doc = new DOMParser().parseFromString(result.html, "text/html")
  expect(
    doc.querySelector(
      "script,iframe,img,svg,annotation-xml,input,[href],[src],[onclick],[data-latex-link]"
    )
  ).toBeNull()
  expect(doc.querySelector("body style")).toBeNull()
  expect(doc.head.firstElementChild?.getAttribute("http-equiv")).toBe(
    "Content-Security-Policy"
  )
  expect(doc.head.firstElementChild?.getAttribute("content")).toContain(
    "default-src 'none'"
  )
  expect(doc.body.textContent).toContain(`${m.imagePlaceholder}: Figure`)
  expect(result.images).toBe(true)
  expect(doc.body.textContent).not.toContain("window.pwned")
})
test("explains empty previews without hiding mathematics-only documents", () => {
  expect(preparePreview("", "", m).html).toContain(m.noContent)
  expect(
    preparePreview(
      '<div class="fl-display-math"><math><mspace width="1em"/></math></div>',
      "",
      m
    ).html
  ).not.toContain(m.noContent)
  expect(preparePreview('<img src="relative.png">', "", m).html).toContain(
    "relative.png"
  )
  expect(
    preparePreview(
      '<p style="font-size:expression(alert(1));text-align:left">x</p>',
      "</style><script>bad()</script>",
      m
    ).html
  ).not.toContain("</style><script>")
})
