import { readFileSync } from "node:fs"
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate"
import { marked } from "marked"
import { expect, test } from "vitest"
import { formatPresentation } from "./format"
import { convert } from "./convert"
import { parseXml, children, attr, P, A, R, REL } from "./xml"
import { resolvePath } from "./archive"

const labels = {
  slide: "Slide {number}",
  hidden: "Hidden slide",
  notes: "Speaker notes",
  image: "[Image omitted]",
  chart: "[Chart omitted]",
  equation: "[Equation omitted]",
  media: "[Media omitted]",
  object: "[Embedded object omitted]",
  shape: "[Shape omitted]",
}
const fixture = readFileSync(
  "tools/pptx-to-markdown-converter/fixtures/structured.pptx"
)
const source = unzipSync(fixture)
const xml = (path: string) => strFromU8(source[path]!)
function modified(changes: Record<string, string | null | undefined>) {
  const files = { ...source }
  for (const [path, text] of Object.entries(changes)) {
    if (text == null) delete files[path]
    else files[path] = strToU8(text)
  }
  return zipSync(files)
}
function html(markdown: string) {
  const node = document.createElement("div")
  node.innerHTML = marked.parse(markdown) as string
  return node
}
const slidePath = "ppt/slides/slide1.xml"
const slideRels = "ppt/slides/_rels/slide1.xml.rels"
const namespaces = `xmlns:p="${P}" xmlns:a="${A}" xmlns:r="${R}"`
const shape = (body: string, ph = "") =>
  `<p:sp><p:nvSpPr><p:nvPr>${ph}</p:nvPr></p:nvSpPr><p:txBody><a:bodyPr/><a:lstStyle/>${body}</p:txBody></p:sp>`
const paragraph = (text: string, properties = "", runProperties = "") =>
  `<a:p>${properties}<a:r>${runProperties}<a:t>${text}</a:t></a:r></a:p>`
function withSlide(content: string, extra = "") {
  return modified({
    [slidePath]: `<p:sld ${namespaces} ${extra}><p:cSld><p:spTree>${content}</p:spTree></p:cSld></p:sld>`,
  })
}

test("exports a real PowerPoint package in presentation order with notes and hidden slides", () => {
  const output = formatPresentation(fixture, labels)
  const node = html(output)
  expect(
    [...node.querySelectorAll("h1")].map((item) => item.textContent)
  ).toEqual(["Slide 1 — Slide one title", "Slide 2 — Slide two table"])
  expect(node.textContent).toContain(
    "# literal *stars* <script> 中文 العربية 😀"
  )
  expect(node.querySelector("script")).toBeNull()
  expect(node.querySelector("ul ul")?.textContent).toContain("Child bullet")
  expect(node.textContent).toContain("Hidden slide")
  expect(
    [...node.querySelectorAll("h2")].map((item) => item.textContent)
  ).toEqual([labels.notes, labels.notes])
  expect(node.textContent).toContain("# literal notes *text*")
  expect(node.querySelector("a[href^='https:']")?.textContent).toBe(
    "link [label]"
  )
  expect(node.querySelector("table")?.textContent).toContain("A | B")
  expect(node.querySelector("table br")).toBeTruthy()
  expect(output.indexOf("Speaker notes 中文")).toBeLessThan(
    output.indexOf("Slide 2")
  )
})

test("uses the slide ID list, not archive or filename order; resolves internal links", () => {
  const main = xml("ppt/presentation.xml").replace(
    /(<p:sldId[^>]+\/>)(<p:sldId[^>]+\/>)/,
    "$2$1"
  )
  const rels = xml(slideRels).replace(
    /Type="[^"]+\/hyperlink" Target="[^"]+" TargetMode="External"/,
    `Type="${R}/slide" Target="slide2.xml"`
  )
  const node = html(
    formatPresentation(
      modified({ "ppt/presentation.xml": main, [slideRels]: rels }),
      labels
    )
  )
  expect(node.querySelector("h1")?.textContent).toBe(
    "Slide 1 — Slide two table"
  )
  expect(node.querySelector('a[href="#slide-1"]')?.textContent).toBe(
    "link [label]"
  )
})

test("keeps inherited bullets and explicit no-bullet overrides", () => {
  const body = shape(
    paragraph("Parent") +
      paragraph("Child", '<a:pPr lvl="1"/>') +
      paragraph("Plain", "<a:pPr><a:buNone/></a:pPr>"),
    '<p:ph idx="1"/>'
  )
  const node = html(formatPresentation(withSlide(body), labels))
  expect(node.querySelector("ul ul")?.textContent).toContain("Child")
  expect(
    [...node.querySelectorAll("li")].some(
      (item) => item.textContent === "Plain"
    )
  ).toBe(false)
  expect(
    [...node.querySelectorAll("p")].map((item) => item.textContent)
  ).toContain("Plain")
})

test("preserves punctuation, saved fields, breaks, adjacent formatting and literal HTML", () => {
  const body = shape(
    `<a:p><a:r><a:t>a</a:t></a:r><a:r><a:rPr b="1"/><a:t>!</a:t></a:r><a:r><a:rPr b="true"/><a:t>?</a:t></a:r><a:r><a:t>b</a:t></a:r><a:br/><a:fld id="x" type="datetime"><a:rPr i="1" strike="sngStrike"/><a:t>Saved &amp; &lt;img src=x&gt;</a:t></a:fld></a:p>`
  )
  const node = html(formatPresentation(withSlide(body), labels))
  expect(node.querySelector("strong")?.textContent).toBe("!?")
  expect(node.querySelectorAll("strong")).toHaveLength(1)
  expect(node.querySelector("em")?.textContent).toBe("Saved & <img src=x>")
  expect(node.querySelector("del")).toBeTruthy()
  expect(node.querySelector("img")).toBeNull()
  expect(node.textContent).toContain("a!?b")
})

test("marks unsupported objects, keeps shape text, and avoids duplicate fallback content", () => {
  const body =
    `<p:grpSp>${shape(paragraph("Grouped text"))}<p:pic/></p:grpSp><p:pic><p:videoFile/></p:pic><p:graphicFrame><a:graphic><c:chart xmlns:c="${A.replace("/main", "/chart")}"/></a:graphic></p:graphicFrame><p:graphicFrame><p:oleObj/></p:graphicFrame><p:cxnSp/>` +
    shape(
      `<a:p><a14:m xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main"/></a:p>`
    ) +
    `<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice Requires="unknown" xmlns:unknown="urn:unknown">${shape(paragraph("Unknown branch"))}</mc:Choice><mc:Fallback>${shape(paragraph("Fallback"))}</mc:Fallback></mc:AlternateContent>`
  const node = html(formatPresentation(withSlide(body), labels))
  for (const kind of [
    "image",
    "chart",
    "media",
    "object",
    "shape",
    "equation",
  ] as const)
    expect(node.textContent).toContain(labels[kind])
  expect(node.textContent).toContain("Grouped text")
  expect(node.textContent).toContain("Fallback")
  expect(node.textContent).not.toContain("Unknown branch")
})

test("escapes table delimiters, keeps multiline cells, and does not assume a header", () => {
  const cell = (text: string) =>
    `<a:tc><a:txBody>${paragraph(text)}</a:txBody></a:tc>`
  const table = `<p:graphicFrame><a:graphic><a:graphicData><a:tbl><a:tblPr/><a:tblGrid><a:gridCol/><a:gridCol/></a:tblGrid><a:tr>${cell("A|B")}${cell("x&#10;y")}</a:tr><a:tr>${cell("&lt;script&gt;*")}${cell("&#x1f600;")}</a:tr></a:tbl></a:graphicData></a:graphic></p:graphicFrame>`
  const node = html(formatPresentation(withSlide(table), labels))
  expect(
    [...node.querySelector("table")!.querySelectorAll("th")].map(
      (cell) => cell.textContent
    )
  ).toEqual(["", ""])
  expect(
    [...node.querySelector("table")!.querySelectorAll("td")].map(
      (cell) => cell.textContent
    )
  ).toEqual(["A|B", "xy", "<script>*", "😀"])
  expect(node.querySelector("td br")).toBeTruthy()
  expect(node.querySelector("script")).toBeNull()
})

test("does not create executable links or include notes-page template placeholders", () => {
  const notesPath = "ppt/notesSlides/notesSlide1.xml"
  const notes = xml(notesPath).replace(
    "<p:spTree>",
    `<p:spTree>${shape(paragraph("Template footer"), '<p:ph type="ftr"/>')}`
  )
  const rels = xml(slideRels).replace(
    /Target="https:[^"]+"/,
    'Target="javascript:alert(1)"'
  )
  const node = html(
    formatPresentation(
      modified({ [slideRels]: rels, [notesPath]: notes }),
      labels
    )
  )
  expect(node.querySelector('a[href^="javascript:"]')).toBeNull()
  expect(node.textContent).toContain("link [label]")
  expect(node.textContent).not.toContain("Template footer")
})

test("supports Strict namespaces and UTF-16 XML without resolving external entities", () => {
  const files = { ...source }
  for (const [path, bytes] of Object.entries(files)) {
    if (!/\.(xml|rels)$/.test(path)) continue
    const text = strFromU8(bytes)
      .replaceAll(P, "http://purl.oclc.org/ooxml/presentationml/main")
      .replaceAll(A, "http://purl.oclc.org/ooxml/drawingml/main")
      .replaceAll(R, "http://purl.oclc.org/ooxml/officeDocument/relationships")
    files[path] = strToU8(text)
  }
  expect(formatPresentation(zipSync(files), labels)).toContain(
    "Slide one title"
  )
  const utf16 = Buffer.from("\ufeff<root><a>中文</a></root>", "utf16le")
  expect(children(parseXml(utf16))[0]?.text).toBe("中文")
  expect(() =>
    parseXml(
      strToU8(
        '<!DOCTYPE root [<!ENTITY x SYSTEM "https://example.test/secret">]><root>&x;</root>'
      )
    )
  ).toThrow("invalid")
})

test.each([
  { [slidePath]: null },
  { "ppt/notesSlides/notesSlide1.xml": null },
  { "ppt/slideLayouts/slideLayout2.xml": null },
  { [slidePath]: "<broken>" },
  { "_rels/.rels": `<Relationships xmlns="${REL}"/>` },
  {
    [slideRels]: xml(slideRels).replace(
      'Target="../notesSlides/notesSlide1.xml"',
      'Target="../../../../outside.xml"'
    ),
  },
  {
    "ppt/presentation.xml": xml("ppt/presentation.xml").replace(
      'r:id="rId7"',
      'r:id="missing"'
    ),
  },
])(
  "rejects incomplete or malformed presentations without partial output: %j",
  (changes) => {
    expect(() => formatPresentation(modified(changes), labels)).toThrow(
      /invalid|unclosed tag/
    )
  }
)

test("reports protected, empty and unreadable inputs and file-read failures", async () => {
  const request = (file: File) => ({ source: { file }, labels })
  expect(
    await convert(
      request(
        new File(
          [new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])],
          "locked.pptx"
        )
      )
    )
  ).toEqual({ error: "protected" })
  expect(await convert(request(new File(["broken"], "broken.pptx")))).toEqual({
    error: "invalid",
  })
  expect(() =>
    formatPresentation(
      modified({
        "ppt/presentation.xml": `<p:presentation ${namespaces}><p:sldIdLst/></p:presentation>`,
      }),
      labels
    )
  ).toThrow("noText")
  const file = new File(["bytes"], "failed.pptx")
  file.arrayBuffer = () => Promise.reject(new RangeError("allocation"))
  expect(await convert(request(file))).toEqual({ error: "resource" })
  expect(
    (await convert(request(new File([fixture], "valid.pptx")))).text
  ).toContain("Slide one title")
})

test.each([
  "../../escape.xml",
  "https://example.test/a.xml",
  "a%2fb.xml",
  "a\\b.xml",
  "a.xml#fragment",
])("rejects invalid package target %s", (target) => {
  expect(() => resolvePath("ppt/presentation.xml", target)).toThrow("invalid")
})
test("resolves encoded local part paths and namespace-qualified attributes", () => {
  expect(resolvePath("ppt/slides/a.xml", "../slides/./a%20b.xml")).toBe(
    "ppt/slides/a b.xml"
  )
  expect(resolvePath("ppt/slides/a.xml", "/ppt/slides/b.xml")).toBe(
    "ppt/slides/b.xml"
  )
  expect(
    attr(parseXml(strToU8(`<p:sld ${namespaces} r:id="id"/>`)), "id", R)
  ).toBe("id")
})

test("nests bullets under wide numbered markers and escapes leading source indentation", () => {
  const body = shape(
    paragraph(
      "Parent",
      '<a:pPr><a:buAutoNum type="arabicPeriod" startAt="1000"/></a:pPr>'
    ) +
      paragraph("Nested", '<a:pPr lvl="1"><a:buChar char="•"/></a:pPr>') +
      paragraph(
        "Next",
        '<a:pPr><a:buAutoNum type="arabicPeriod" startAt="1000"/></a:pPr>'
      ) +
      paragraph("    # literal", "<a:pPr><a:buNone/></a:pPr>")
  )
  const node = html(formatPresentation(withSlide(body), labels))
  expect(node.querySelector('ol[start="1000"] ul')?.textContent).toContain(
    "Nested"
  )
  expect(node.querySelector("pre")).toBeNull()
  expect(node.textContent).toContain("    # literal")
})

test("does not call a picture-only presentation a successful text conversion", () => {
  const emptySlide = `<p:sld ${namespaces}><p:cSld><p:spTree><p:pic/></p:spTree></p:cSld></p:sld>`
  const emptyNotes = `<p:notes ${namespaces}><p:cSld><p:spTree>${shape(paragraph("7"), '<p:ph type="sldNum"/>')}</p:spTree></p:cSld></p:notes>`
  expect(() =>
    formatPresentation(
      modified({
        [slidePath]: emptySlide,
        "ppt/slides/slide2.xml": emptySlide,
        "ppt/notesSlides/notesSlide1.xml": emptyNotes,
        "ppt/notesSlides/notesSlide2.xml": emptyNotes,
      }),
      labels
    )
  ).toThrow("noText")
})

test("has no 1000-slide quota and preserves the final slide", () => {
  const files = { ...source }
  const ids: string[] = []
  const rels: string[] = []
  for (let i = 1; i <= 1001; i++) {
    ids.push(`<p:sldId id="${255 + i}" r:id="rId${i}"/>`)
    rels.push(
      `<Relationship Id="rId${i}" Type="${R}/slide" Target="generated/slide${i}.xml"/>`
    )
    files[`ppt/generated/slide${i}.xml`] = strToU8(
      `<p:sld ${namespaces}><p:cSld><p:spTree>${shape(paragraph(`Content ${i}`))}</p:spTree></p:cSld></p:sld>`
    )
  }
  files["ppt/presentation.xml"] = strToU8(
    `<p:presentation ${namespaces}><p:sldIdLst>${ids.join("")}</p:sldIdLst></p:presentation>`
  )
  files["ppt/_rels/presentation.xml.rels"] = strToU8(
    `<Relationships xmlns="${REL}">${rels.join("")}</Relationships>`
  )
  const output = formatPresentation(zipSync(files), labels)
  expect(output.match(/^# Slide /gm)).toHaveLength(1001)
  expect(output).toContain("Content 1001")
})
