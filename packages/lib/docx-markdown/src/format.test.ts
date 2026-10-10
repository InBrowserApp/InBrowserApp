import { expect, test } from "vitest"
import { marked } from "marked"
import type {
  BodyElement,
  DocParagraph,
  DocRun,
  DocxDocumentModel,
} from "@silurus/ooxml/docx"
import { formatDocument } from "./format"
import { identifier } from "./inline"

const labels = {
  headers: "Headers",
  footers: "Footers",
  footnotes: "Footnotes",
  endnotes: "Endnotes",
  comments: "Comments",
  replyTo: "Reply to",
  image: "[Image omitted]",
  chart: "[Chart omitted]",
  equation: "[Equation omitted]",
  shape: "[Shape omitted]",
}
const text = (value: string, extra = {}) =>
  ({ type: "text", text: value, ...extra }) as DocRun
const paragraph = (runs: DocRun[], extra = {}) =>
  ({ type: "paragraph", runs, ...extra }) as BodyElement & DocParagraph
const p = (value: string, extra = {}) => paragraph([text(value)], extra)
const model = (body: BodyElement[], extra = {}) =>
  ({ body, headers: {}, footers: {}, ...extra }) as DocxDocumentModel
function html(doc: DocxDocumentModel) {
  const element = document.createElement("div")
  element.innerHTML = marked.parse(formatDocument(doc, labels), {
    async: false,
  })
  return element
}

test("escapes source syntax without losing Unicode, HTML, entities or punctuation", () => {
  const values = [
    "# literal title",
    "---",
    "1. text",
    "1) text",
    "> quote",
    "a | b",
    "<script>alert(1)</script>",
    "&lt;tag&gt;",
    "![x](javascript:alert(1))",
    "`code` *stars* _under_ \\slash",
    "中文 日本語 العربية 😀",
  ]
  const doc = model([
    p("Actual heading", { styleId: "Heading1" }),
    ...values.map((value) => p(value)),
  ])
  const result = html(doc)
  expect(result.querySelectorAll("h1")).toHaveLength(1)
  expect(
    result.querySelectorAll("script,img,blockquote,ol,hr,code,em")
  ).toHaveLength(0)
  expect(
    [...result.querySelectorAll("p")].map((item) => item.textContent)
  ).toEqual(values)
})

test("preserves custom headings, basic emphasis, safe links and internal bookmarks", () => {
  const doc = model([
    p("Custom", { outlineLevel: 2, bookmarks: ['目标"<x>'] }),
    paragraph([
      text(" bold ", { bold: true }),
      text("italic", { italic: true }),
      text(" strike", { strikethrough: true }),
    ]),
    paragraph([
      text("label [x]", { hyperlink: "https://example.test/a_(b)?x=1&y=2" }),
    ]),
    paragraph([text("target", { hyperlinkAnchor: '目标"<x>' })]),
    paragraph([text("bad", { hyperlink: "javascript:alert(1)" })]),
    paragraph([text("fallback", { hyperlinkAnchor: "missing" })]),
  ])
  const result = html(doc)
  expect(result.querySelector("h3")?.textContent).toBe("Custom")
  expect(result.querySelector("strong")?.textContent).toBe("bold")
  expect(result.querySelector("em")?.textContent).toBe("italic")
  expect(result.querySelector("del")?.textContent).toBe("strike")
  expect(result.querySelector('a[href^="https"]')?.getAttribute("href")).toBe(
    "https://example.test/a_(b)?x=1&y=2"
  )
  const anchor = identifier("bookmark", '目标"<x>')
  expect(result.querySelector(`a[id="${anchor}"]`)).toBeTruthy()
  expect(result.querySelector('a[href^="#"]')?.getAttribute("href")).toBe(
    `#${anchor}`
  )
  expect(result.querySelector('a[href^="javascript"]')).toBeNull()
  expect(result.textContent).toContain("bad (javascript:alert(1))")
})

test("keeps pipe tables rectangular with literal delimiters and multiline/nested cells", () => {
  const cell = (content: BodyElement[], colSpan = 1) => ({ content, colSpan })
  const table = {
    type: "table",
    rows: [
      { cells: [cell([p("A | B")]), cell([p("line one\nline two")])] },
      {
        cells: [
          cell(
            [
              p("merged"),
              {
                type: "table",
                rows: [{ cells: [cell([p("nested")]), cell([p("inner")])] }],
              } as BodyElement,
            ],
            2
          ),
        ],
      },
    ],
  } as BodyElement
  const result = html(model([table]))
  expect(result.querySelectorAll("table")).toHaveLength(1)
  expect(
    [...result.querySelectorAll("thead th")].map((item) => item.textContent)
  ).toEqual(["", ""])
  expect(result.querySelectorAll("tbody tr")).toHaveLength(2)
  const cells = result.querySelectorAll("td")
  expect(cells).toHaveLength(4)
  expect(cells[0]?.textContent).toBe("A | B")
  expect(cells[1]?.innerHTML).toBe("line one<br>line two")
  expect(cells[2]?.textContent).toContain("nested · inner")
})

test("retains ordered and nested lists without turning orphaned levels into code", () => {
  const num = (level: number, value: string, format = "bullet") => ({
    numbering: { level, text: value, format },
  })
  const result = html(
    model([
      p("parent", num(2, "•")),
      p("child", num(3, "•")),
      p("sibling", num(2, "•")),
      p("between"),
      p("fourth", num(0, "4.", "decimal")),
      p("fifth", num(0, "5.", "decimal")),
    ])
  )
  expect(result.querySelectorAll("pre,code")).toHaveLength(0)
  expect(result.querySelector("ul ul li")?.textContent?.trim()).toBe("child")
  expect(result.querySelector("ol")?.getAttribute("start")).toBe("4")
  expect(result.querySelectorAll("ol > li")).toHaveLength(2)
})

test("links available notes/comments to separate escaped definitions and deduplicates headers", () => {
  const header = { body: [p("Header *literal*")] }
  const doc = model(
    [
      paragraph(
        [
          text("Body"),
          text("1", { noteRef: { kind: "footnote", id: "1" } }),
          text("1", { noteRef: { kind: "endnote", id: "1" } }),
        ],
        {
          commentMarks: [
            { id: "0", kind: "rangeStart" },
            { id: "0", kind: "reference" },
          ],
        }
      ),
      { type: "sectionBreak", headers: { default: header } } as BodyElement,
    ],
    {
      headers: { default: header, first: header },
      footers: { default: { body: [p("Footer")] } },
      footnotes: [{ id: "1", content: [p("Foot *literal*")] }],
      endnotes: [{ id: "1", content: [p("End 中文")] }],
      comments: [
        { id: "0", author: "A <x>", text: "comment" },
        { id: "reply", parentId: "0", text: "answer" },
      ],
    }
  )
  const output = formatDocument(doc, labels)
  expect(output).toContain("Body[^footnote-31][^endnote-31][^comment-30]")
  expect(output.match(/Header/g)).toHaveLength(2) // title and one body
  expect(output).toContain("[^footnote-31]: Foot \\*literal\\*")
  expect(output).toContain("[^endnote-31]: End 中文")
  expect(output).toContain("[^comment-30]: A \\<x\\>: comment")
  expect(output).toContain("Reply to [^comment-30]. answer")
})

test("uses saved fields and final revision text, retains shape text and marks omissions", () => {
  const doc = model([
    paragraph([
      text("deleted", { revision: { kind: "deletion" } }),
      text("moved away", { revision: { kind: "moveFrom" } }),
      text("inserted ", { revision: { kind: "insertion" } }),
      { type: "field", fallbackText: "saved value" },
      { type: "break", breakType: "line" },
      { type: "shape", textBlocks: [{ text: "shape text" }] },
      { type: "image" },
      { type: "chart" },
      { type: "math" },
      { type: "shape" },
    ] as DocRun[]),
  ])
  const result = html(doc)
  expect(result.textContent).toContain("inserted saved value")
  expect(result.textContent).toContain(
    "shape text[Image omitted][Chart omitted][Equation omitted][Shape omitted]"
  )
  expect(result.textContent).not.toContain("deleted")
  expect(result.textContent).not.toContain("moved away")
})

test("rejects parser failures, blank and image-only documents without pretending to transcribe", () => {
  expect(() =>
    formatDocument(model([p("partial")], { parseError: "truncated" }), labels)
  ).toThrow("invalid")
  expect(() => formatDocument(model([p(" \t")]), labels)).toThrow("noText")
  expect(() =>
    formatDocument(model([paragraph([{ type: "image" } as DocRun])]), labels)
  ).toThrow("noText")
})

test("joins adjacent formatting runs without injecting Markdown delimiter characters", () => {
  const styles = Array.from({ length: 8 }, (_, index) => ({
    bold: Boolean(index & 1),
    italic: Boolean(index & 2),
    strikethrough: Boolean(index & 4),
  }))
  for (const first of styles)
    for (const second of styles) {
      const result = html(
        model([paragraph([text("a", first), text("b", second)])])
      )
      expect(result.textContent?.trim()).toBe("ab")
    }
  const result = html(
    model([
      paragraph([
        text("bold", { bold: true, hyperlink: null }),
        { type: "field", fallbackText: " saved", bold: true } as DocRun,
      ]),
    ])
  )
  expect(result.querySelector("strong")?.textContent).toBe("bold saved")
})
