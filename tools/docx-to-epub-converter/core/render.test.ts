import type { BodyElement, DocParagraph, DocRun } from "@silurus/ooxml/docx"
import { expect, test } from "vitest"
import { renderBlocks, type ImageRun, type RenderContext } from "./render"

type TextRun = Extract<DocRun, { type: "text" }>
type FieldRun = Extract<DocRun, { type: "field" }>

const runFormatting = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  fontSize: 12,
  color: null,
  fontFamily: null,
  background: null,
  vertAlign: null,
}

function text(value: string, properties: Partial<TextRun> = {}): TextRun {
  return {
    ...runFormatting,
    type: "text",
    text: value,
    isLink: Boolean(properties.hyperlink || properties.hyperlinkAnchor),
    hyperlink: null,
    ...properties,
  }
}

function field(instruction: string, fallbackText: string): FieldRun {
  return {
    ...runFormatting,
    type: "field",
    fieldType: instruction.trim().split(/\s+/)[0] ?? "",
    instruction,
    fallbackText,
  }
}

function paragraph(
  content: string | DocRun[],
  properties: Partial<DocParagraph> = {}
): Extract<BodyElement, { type: "paragraph" }> {
  return {
    type: "paragraph",
    alignment: "left",
    indentLeft: 0,
    indentRight: 0,
    indentFirst: 0,
    spaceBefore: 0,
    spaceAfter: 0,
    lineSpacing: null,
    numbering: null,
    tabStops: [],
    runs: typeof content === "string" ? [text(content)] : content,
    ...properties,
  }
}

function numbering(marker: string, level = 0, numId = 4, format = "decimal") {
  return {
    text: marker,
    level,
    numId,
    format,
    indentLeft: 0,
    tab: 0,
    suff: "tab",
  }
}

function documentContext(options: Partial<RenderContext> = {}) {
  const doc = document.implementation.createHTMLDocument("")
  const ctx: RenderContext = {
    doc,
    signal: new AbortController().signal,
    anchors: new Set(),
    missing: false,
    image: async () => null,
    imageUnavailable: "[Image unavailable]",
    note: () => undefined,
    ...options,
  }
  return { ctx, root: doc.body }
}

test("uses terminal numbering for multilevel lists and prints numbered headings", async () => {
  const { ctx, root } = documentContext()
  await renderBlocks(
    root,
    [
      paragraph("First main item", { numbering: numbering("1.") }),
      paragraph("First detail", { numbering: numbering("1.1.", 1) }),
      paragraph("Second detail", { numbering: numbering("1.2.", 1) }),
      paragraph("Second main item", { numbering: numbering("2.") }),
      paragraph("Third detail", { numbering: numbering("2.1.", 1) }),
      paragraph("Fourth detail", { numbering: numbering("2.2.", 1) }),
      paragraph("Numbered chapter", {
        outlineLevel: 0,
        numbering: numbering("3.\t"),
      }),
      paragraph("Style heading", { outlineLevel: -1, styleId: "Heading2" }),
      paragraph("Deep outline heading", { outlineLevel: 8 }),
      paragraph("Deep style heading", { outlineLevel: 9, styleId: "Heading9" }),
      paragraph("Normal text", { styleId: "BodyText" }),
    ],
    ctx
  )

  expect(
    Array.from(root.querySelectorAll<HTMLLIElement>(":scope > ol > li")).map(
      (item) => item.value
    )
  ).toEqual([1, 2])
  expect(
    Array.from(root.querySelectorAll("li > ol")).map((list) =>
      Array.from(list.querySelectorAll("li")).map((item) => item.value)
    )
  ).toEqual([
    [1, 2],
    [1, 2],
  ])
  expect(
    Array.from(root.children)
      .slice(1)
      .map((element) => [element.localName, element.textContent])
  ).toEqual([
    ["h1", "3. Numbered chapter"],
    ["h2", "Style heading"],
    ["h6", "Deep outline heading"],
    ["h6", "Deep style heading"],
    ["p", "Normal text"],
  ])
})

test("preserves list restarts, alphabetic and Roman markers, and style-based nesting", async () => {
  const { ctx, root } = documentContext()
  await renderBlocks(
    root,
    [
      paragraph("Roman marker", {
        numbering: numbering("I.", 0, 1, "upperRoman"),
      }),
      paragraph("Nested alphabetic marker", {
        styleId: "ListNumber2",
        numbering: numbering("a)", 0, 2, "lowerLetter"),
      }),
      paragraph("Independent list", { numbering: numbering("8)", 0, 3) }),
      paragraph("Paragraph break between lists"),
      paragraph("Custom numeric bullet", {
        numbering: numbering("4.", 0, 4, "bullet"),
      }),
      paragraph("Conventional bullet", {
        numbering: numbering("•", 0, 4, "bullet"),
      }),
    ],
    ctx
  )

  expect(Array.from(root.children, (element) => element.localName)).toEqual([
    "ol",
    "ol",
    "p",
    "ul",
  ])
  const roman = root.querySelector("ol:first-child")!
  const restarted = root.querySelector("ol:nth-child(2)")!
  const bullets = root.querySelector("ul")!
  expect(roman.getAttribute("type")).toBe("I")
  expect(roman.querySelector("li > ol")?.getAttribute("type")).toBe("a")
  expect(roman.querySelector("li > ol > li")?.textContent).toBe(
    "Nested alphabetic marker"
  )
  expect(restarted.querySelector("li")?.value).toBe(8)
  expect(
    Array.from(bullets.children).map((item) => [
      item.textContent,
      item.getAttribute("value"),
    ])
  ).toEqual([
    ["Custom numeric bullet", null],
    ["Conventional bullet", null],
  ])
})

test("keeps Word cross-references and hyperlinks connected to their destinations", async () => {
  const { ctx, root } = documentContext()
  const section = "#word-bookmark-53656374696f6e33"
  const sectionWithSpaces = "#word-bookmark-53656374696f6e2033"
  await renderBlocks(
    root,
    [
      paragraph("Chapter 3", {
        bookmarks: ["Section3", "Section 3", "Section3"],
      }),
      paragraph([
        text("Inline internal link", { hyperlink: " #Section3 " }),
        text("Inline bookmark", { hyperlinkAnchor: "Section 3" }),
        field(" REF Section3 \\h", "3.1"),
        field('PAGEREF "Section 3" \\h \\p', "above"),
        field("REF Section3", "Reference without a link"),
        field("HYPERLINK \\l Section3", "Field with local destination"),
        text("Inline external link", {
          hyperlink: "https://example.com/chapters?order=3",
          hyperlinkAnchor: "Résumé",
        }),
        field(
          'HYPERLINK "https://example.com/manual?layout=print" \\l "Part 3"',
          "Quoted external destination"
        ),
        field(
          "HYPERLINK https://example.com/manual \\l chapter3",
          "Unquoted external destination"
        ),
        field(
          'HYPERLINK "https://example.com/manual#chapter4"',
          "Existing external fragment"
        ),
        text("Email", { hyperlink: "mailto:editor@example.com" }),
        text("Unsafe destination", { hyperlink: "javascript:alert(1)" }),
        field("HYPERLINK", "Incomplete link field"),
      ]),
    ],
    ctx
  )

  expect(root.querySelectorAll(`span${section}`)).toHaveLength(1)
  expect(root.querySelectorAll(`span${sectionWithSpaces}`)).toHaveLength(1)
  expect(
    Array.from(root.querySelectorAll("a")).map((link) => [
      link.textContent,
      link.getAttribute("href"),
    ])
  ).toEqual([
    ["Inline internal link", section],
    ["Inline bookmark", sectionWithSpaces],
    ["3.1", section],
    ["above", sectionWithSpaces],
    ["Field with local destination", section],
    [
      "Inline external link",
      "https://example.com/chapters?order=3#R%C3%A9sum%C3%A9",
    ],
    [
      "Quoted external destination",
      "https://example.com/manual?layout=print#Part%203",
    ],
    ["Unquoted external destination", "https://example.com/manual#chapter3"],
    ["Existing external fragment", "https://example.com/manual#chapter4"],
    ["Email", "mailto:editor@example.com"],
  ])
  expect(root.textContent).toContain("Reference without a link")
  expect(root.textContent).toContain("Unsafe destination")
  expect(root.textContent).toContain("Incomplete link field")
})

function image(imagePath: string): ImageRun {
  return {
    type: "image",
    imagePath,
    mimeType: "image/png",
    widthPt: 48,
    heightPt: 24,
  }
}

test("retains readable inline content and marks unavailable images", async () => {
  const src = "data:image/png;base64,local-figure"
  const { ctx, root } = documentContext({
    image: async (run) =>
      run.imagePath === "word/media/figure.png" ? src : null,
    note: (kind, id) =>
      kind === "footnote" && id === "1"
        ? { id: "note-1", label: "1" }
        : undefined,
  })
  await renderBlocks(
    root,
    [
      paragraph(
        [
          text("Formula", {
            bold: true,
            italic: true,
            underline: true,
            strikethrough: true,
            vertAlign: "super",
          }),
          text("₂", { vertAlign: "sub" }),
          text("Removed", { revision: { kind: "deletion" } }),
          text("Move source", { revision: { kind: "moveFrom" } }),
          text("Retained", { revision: { kind: "insertion" } }),
          { type: "break", breakType: "line" },
          { type: "break", breakType: "page" },
          {
            type: "ptab",
            alignment: "left",
            relativeTo: "margin",
            leader: "none",
            fontSize: 12,
          },
          text("Note source", { noteRef: { kind: "footnote", id: "1" } }),
          text("*", { noteRef: { kind: "endnote", id: "unresolved" } }),
          image("word/media/figure.png"),
          image("word/media/missing.png"),
          { type: "anchorHost", fontSize: 12 },
        ],
        { bidi: true }
      ),
    ],
    ctx
  )

  const node = root.querySelector("p")!
  expect(node.dir).toBe("rtl")
  expect(node.querySelector("sup > s > u > em > strong")?.textContent).toBe(
    "Formula"
  )
  expect(node.querySelector("sub")?.textContent).toBe("₂")
  expect(node.querySelectorAll("br")).toHaveLength(1)
  expect(node.querySelector('a[href="#note-1"] > sup')?.textContent).toBe("1")
  expect(node.querySelectorAll("img")).toHaveLength(1)
  expect(node.querySelector("img")?.getAttribute("src")).toBe(src)
  expect(node.textContent).toBe("Formula₂Retained 1*[Image unavailable]")
  expect(ctx.missing).toBe(true)
})

test("keeps text in drawing shapes and flags objects requiring a different renderer", async () => {
  const { ctx, root } = documentContext()
  const shape: Extract<DocRun, { type: "shape" }> = {
    type: "shape",
    widthPt: 60,
    heightPt: 24,
    anchorXPt: 0,
    anchorYPt: 0,
    anchorXFromMargin: false,
    anchorYFromPara: false,
    zOrder: 0,
    subpaths: [],
    stroke: null,
  }
  await renderBlocks(
    root,
    [
      paragraph([
        {
          ...shape,
          textBlocks: [
            { text: " First line", fontSizePt: 12, alignment: "left" },
            { text: "second line ", fontSizePt: 12, alignment: "left" },
          ],
        },
      ]),
      paragraph([
        {
          ...shape,
          textBlocks: [],
          textPath: { string: "WordArt" },
        },
      ]),
      paragraph([shape]),
      paragraph([{ type: "math", display: false, fontSize: 12, nodes: [] }]),
      paragraph([
        {
          type: "chart",
          widthPt: 96,
          heightPt: 48,
          anchor: false,
          chart: {
            chartType: "pie",
            title: "Sales",
            categories: [],
            series: [],
            showDataLabels: false,
            valMin: null,
            valMax: null,
            catAxisTitle: null,
            valAxisTitle: null,
            catAxisHidden: true,
            valAxisHidden: true,
            catAxisLineHidden: true,
            valAxisLineHidden: true,
            plotAreaBg: null,
            chartBg: null,
            showLegend: true,
            legendPos: "r",
            catAxisCrossBetween: "between",
            valAxisMajorTickMark: "none",
            catAxisMajorTickMark: "none",
            titleFontSizeHpt: null,
            titleFontColor: null,
            titleFontFace: null,
            catAxisFontSizeHpt: null,
            valAxisFontSizeHpt: null,
            dataLabelFontSizeHpt: null,
            subtotalIndices: [],
          },
        },
      ]),
    ],
    ctx
  )

  expect(Array.from(root.children).map((node) => node.textContent)).toEqual([
    "First line second line",
    "WordArt",
  ])
  expect(ctx.missing).toBe(true)
})

test("preserves table headers, grid gaps, and cells continued across rows", async () => {
  const { ctx, root } = documentContext()
  const borders = {
    top: null,
    bottom: null,
    left: null,
    right: null,
    insideH: null,
    insideV: null,
  }
  const cell = (content: string, colSpan: number, vMerge: boolean | null) => ({
    content: [paragraph(content, { styleId: "Heading2" })],
    colSpan,
    vMerge,
    borders,
    background: null,
    vAlign: "top" as const,
    widthPt: null,
  })
  const row = { rowHeight: null, rowHeightRule: "auto" }
  await renderBlocks(
    root,
    [
      paragraph("Before table", { numbering: numbering("1.") }),
      {
        type: "table",
        colWidths: [48, 48, 48, 48, 48, 48],
        borders,
        cellMarginTop: 0,
        cellMarginBottom: 0,
        cellMarginLeft: 0,
        cellMarginRight: 0,
        jc: "left",
        rows: [
          {
            ...row,
            isHeader: true,
            gridBefore: 1,
            gridAfter: 2,
            cells: [cell("Region", 2, true), cell("Quarter", 1, null)],
          },
          {
            ...row,
            isHeader: false,
            gridBefore: 1,
            cells: [
              cell("Continued", 2, false),
              cell("Metric", 1, false),
              cell("Results", 2, null),
            ],
          },
          { ...row, isHeader: false, cells: [cell("All regions", 6, null)] },
        ],
      },
      paragraph("After table", { numbering: numbering("2.") }),
    ],
    ctx
  )
  const rows = Array.from(root.querySelectorAll("tr"))
  expect(
    rows.map((tr) =>
      Array.from(tr.cells, (td) => [
        td.localName,
        td.colSpan,
        td.rowSpan,
        td.textContent,
      ])
    )
  ).toEqual([
    [
      ["td", 1, 1, ""],
      ["th", 2, 2, "Region"],
      ["th", 1, 1, "Quarter"],
      ["td", 2, 1, ""],
    ],
    [
      ["td", 1, 1, ""],
      ["td", 1, 1, "Metric"],
      ["td", 2, 1, "Results"],
    ],
    [["td", 6, 1, "All regions"]],
  ])
  expect(root.querySelector("th > p")?.textContent).toBe("Region")
  expect(root.querySelector("table h2")).toBeNull()
  expect(Array.from(root.children).map((node) => node.localName)).toEqual([
    "ol",
    "table",
    "ol",
  ])
})

test("renders beyond a cooperative yield and omits empty or layout-only blocks", async () => {
  const { ctx, root } = documentContext()
  await renderBlocks(
    root,
    [
      { type: "sectionBreak", kind: "nextPage" },
      paragraph([]),
      ...Array.from({ length: 65 }, (_, index) =>
        paragraph(`Paragraph ${index + 1}`)
      ),
    ],
    ctx
  )

  expect(root.children).toHaveLength(65)
  expect(root.lastElementChild?.textContent).toBe("Paragraph 65")
  expect(ctx.missing).toBe(false)
})

test("aborts while resolving an inline image without appending the partial paragraph", async () => {
  const controller = new AbortController()
  const reason = new DOMException("Conversion cancelled", "AbortError")
  const { ctx, root } = documentContext({
    signal: controller.signal,
    image: async () => {
      controller.abort(reason)
      return null
    },
  })
  const blocks = [
    paragraph("Completed paragraph"),
    paragraph([image("word/media/figure.png"), text("Later text")]),
    paragraph("Later paragraph"),
  ]

  await expect(renderBlocks(root, blocks, ctx)).rejects.toBe(reason)
  expect(root.textContent).toBe("Completed paragraph")
})
