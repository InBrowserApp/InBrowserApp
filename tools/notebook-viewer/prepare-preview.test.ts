// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { parse } from "./core/parse"
import { preparePreview } from "./prepare-preview"
import { fragment } from "./fragment"
import { staticSvg } from "./static-svg"
import m from "./messages/en.json"
const signal = () => new AbortController().signal
const documentOf = (html: string) =>
  new DOMParser().parseFromString(html, "text/html")

test("preserves cell order, counts, independent disclosures, headings and cell-local attachments", async () => {
  const preview = await preparePreview(
    parse(readFileSync("tools/notebook-viewer/fixtures/survey.ipynb", "utf8")),
    m,
    signal()
  )
  const doc = documentOf(preview.html)
  expect(doc.querySelectorAll("section.nb-cell")).toHaveLength(7)
  expect(doc.querySelectorAll("details.nb-section")).toHaveLength(7)
  expect(doc.body.textContent).toContain("Execution 7")
  expect(doc.body.textContent).toContain(m.notExecuted)
  expect(doc.body.textContent).toContain(m.noOutput)
  expect(preview.outline).toHaveLength(9)
  const target = Array.from(doc.querySelectorAll("h2")).find(
    (h) => h.textContent === "Observations 100%"
  )!
  expect(
    doc.querySelector("[data-web-link]")?.getAttribute("data-web-link")
  ).toBe(`#${target.id}`)
  expect(doc.querySelectorAll('img[src^="data:image/png"]')).toHaveLength(1)
  expect(doc.querySelectorAll('img[src^="data:image/svg+xml"]')).toHaveLength(1)
  expect(doc.querySelector("svg,script")).toBeNull()
  const ids = Array.from(doc.querySelectorAll("[id]"), (x) => x.id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(doc.head.firstElementChild?.getAttribute("http-equiv")).toBe(
    "Content-Security-Policy"
  )
  expect(preview.empty).toBe(false)
})

test("reports unsupported cells, widgets and missing resources while stripping active content", async () => {
  const preview = await preparePreview(
    parse(
      readFileSync("tools/notebook-viewer/fixtures/unavailable.ipynb", "utf8")
    ),
    m,
    signal()
  )
  const doc = documentOf(preview.html)
  expect(preview.limited).toBe(true)
  expect(preview.notes).toEqual({ local: true, remote: true, active: true })
  for (const value of [
    m.interactive,
    m.unsupportedCell,
    "Widget static text",
    "Safe output survives.",
    "Unknown cell source retained.",
  ])
    expect(doc.body.textContent).toContain(value)
  expect(doc.querySelector("script,iframe,form,button,[onerror]")).toBeNull()
  expect(doc.querySelector('img[src^="https:"]')).toBeNull()
})

test("keeps fragment IDs unique across outputs, resolves fragments once and contains output markup", async () => {
  const cell = {
    kind: "code" as const,
    html: "<pre>Code</pre>",
    attachments: {},
    count: 0,
    outputs: [
      {
        label: "result" as const,
        html: '<style>body{display:none}</style><h2 id="é%">First</h2><a href="#%C3%A9%25">Local</a><div style="position:fixed;top:0;color:red">Inside</div>',
        interactive: false,
        unsupported: false,
      },
      {
        label: "result" as const,
        html: '</section><h2 id="é%">Second</h2><a href="#%C3%A9%25">Other</a><a href="#bad%">Missing</a><a href="https://example.org">External</a><h3></h3>',
        interactive: false,
        unsupported: true,
      },
      {
        label: "result" as const,
        html: "<script>alert(1)</script>",
        interactive: false,
        unsupported: false,
      },
    ],
  }
  const preview = await preparePreview({ cells: [cell] }, m, signal())
  const doc = documentOf(preview.html)
  const headings = doc.querySelectorAll("h2")
  expect(headings[0]!.id).not.toBe(headings[1]!.id)
  const links = doc.querySelectorAll("[data-web-link]")
  expect(links[0]?.getAttribute("data-web-link")).toBe(`#${headings[0]!.id}`)
  expect(links[1]?.getAttribute("data-web-link")).toBe(`#${headings[1]!.id}`)
  expect(links[2]?.getAttribute("data-web-link")).toBe("#bad%")
  expect(doc.querySelectorAll("section.nb-cell")).toHaveLength(1)
  expect(doc.body.querySelector("style")).toBeNull()
  expect(doc.querySelector<HTMLElement>("[style]")?.style.position).toBe("")
  expect(doc.body.textContent).toContain(m.unsupportedOutput)
})

test("handles empty notebooks and cells and yields so cancellation stays usable", async () => {
  expect((await preparePreview({ cells: [] }, m, signal())).html).toContain(
    m.noContent
  )
  const cell = {
    kind: "markdown" as const,
    html: "",
    attachments: {},
    count: null,
    outputs: [],
  }
  expect((await preparePreview({ cells: [cell] }, m, signal())).html).toContain(
    m.emptyCell
  )
  const controller = new AbortController()
  const pending = preparePreview(
    { cells: Array.from({ length: 1001 }, () => cell) },
    m,
    controller.signal
  )
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
})

test("uses saved plain text when richer output is removed or has no readable image", async () => {
  const source = JSON.stringify({
    nbformat: 4,
    nbformat_minor: 5,
    cells: [
      {
        cell_type: "code",
        source: "display(result)",
        execution_count: 1,
        outputs: [
          {
            output_type: "display_data",
            data: {
              "text/html": "<script>alert(1)</script>",
              "text/plain": "Script fallback",
            },
          },
          {
            output_type: "display_data",
            data: {
              "image/svg+xml": "invalid SVG",
              "text/plain": "Image fallback",
            },
          },
          {
            output_type: "display_data",
            data: { "text/html": "", "text/plain": "Empty HTML fallback" },
          },
        ],
      },
    ],
  })
  const doc = documentOf(
    (await preparePreview(parse(source), m, signal())).html
  )
  expect(doc.body.textContent).toContain("Script fallback")
  expect(doc.body.textContent).toContain("Image fallback")
  expect(doc.body.textContent).toContain("Empty HTML fallback")
  expect(doc.body.textContent).not.toContain(m.unsupportedOutput)
})

test("resolves encoded attachment names only within the cell and removes unsafe SVG references", () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg"><defs><path id="p" d="M0 0h10"/></defs><use href="#p"/><image href="data:image/png;base64,AA=="/><image href="folder/image.png"/><image href="https://example.invalid/i"/><script>alert(1)</script><style>@import "https://example.invalid/s";</style><rect style="fill:red;background:image-set(url(https://example.invalid/bg) 1x)"/><rect fill="url(#p)"/><rect style="stroke:blue"/></svg>'
  const result = staticSvg(svg)
  expect(result.url).toBeTruthy()
  const clean = decodeURIComponent(result.url!.split(",").slice(1).join(","))
  expect(clean).toContain('href="#p"')
  expect(clean).not.toContain("https://")
  expect(clean).not.toContain("<script")
  expect(clean).not.toContain("folder/")
  expect(result.notes).toEqual({ local: true, remote: true, active: true })
  expect(staticSvg("not SVG").url).toBeNull()
  expect(staticSvg("<g/>").url).toBeNull()
  const value = fragment(
    '<img src="attachment:plot%20one.svg"><img src="attachment:bad%"><svg><rect width="10" height="10"/></svg>',
    { "plot one.svg": { "image/svg+xml": "<svg><rect/></svg>" } },
    m
  )
  expect(
    value.body.querySelectorAll('img[src^="data:image/svg+xml"]')
  ).toHaveLength(2)
  expect(value.notes.local).toBe(true)
  expect(fragment("", {}, m, "invalid SVG").body.textContent).toBe("")
})
