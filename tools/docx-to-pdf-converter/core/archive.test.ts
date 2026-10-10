// @vitest-environment jsdom
import { expect, test } from "vitest"
import { strToU8, zipSync } from "fflate"
import { inspectArchive } from "./archive"
import { ConversionError, failure } from "./errors"

const w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
const r = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
const document = (body = "") =>
  `<w:document xmlns:w="${w}" xmlns:r="${r}"><w:body>${body}</w:body></w:document>`
const relation = (attributes: string) => `<Relationship ${attributes}/>`
const relationships = (body: string) => `<Relationships>${body}</Relationships>`
function archive(entries: Record<string, string | Uint8Array> = {}) {
  const bytes = zipSync(
    Object.fromEntries(
      Object.entries({
        "[Content_Types].xml": "<Types/>",
        "word/document.xml": document(),
        ...entries,
      }).map(([name, value]) => [
        name,
        typeof value === "string" ? strToU8(value) : value,
      ])
    )
  )
  return bytes.slice().buffer
}
function image(target = "media/image.png", mode = "") {
  return {
    "word/document.xml": document('<w:drawing r:embed="image"/>'),
    "word/_rels/document.xml.rels": relationships(
      relation(`Id="image" Type="${r}/image" Target="${target}" ${mode}`)
    ),
    "word/media/image.png": new Uint8Array([255]),
  }
}

test("accepts local resources, normalized targets and omitted PDF hyperlinks without decoding binary assets", () => {
  for (const target of [
    "media/image.png",
    "/word/media/image.png",
    "./temp/../media/%69mage.png#part",
  ])
    expect(() => inspectArchive(archive(image(target)))).not.toThrow()
  expect(() =>
    inspectArchive(
      archive({
        ...image(),
        "_rels/.rels": relationships(
          relation(
            `Id="root" Type="${r}/officeDocument" Target="word/document.xml"`
          )
        ),
        "word/_rels/document.xml.rels": relationships(
          relation(`Id="image" Type="${r}/image" Target="media/image.png"`) +
            relation(
              `Id="url" Type="${r}/hyperlink" Target="https://example.com" TargetMode="External"`
            )
        ),
        "word/styles.xml": '<styles><item id="not-a-relationship"/></styles>',
        "word/unused.xml": document('<w:p r:id=""/>'),
      })
    )
  ).not.toThrow()
})
test("rejects missing parts and missing relationship IDs instead of a successful PDF with omitted images", () => {
  const entries = image()
  delete (entries as Record<string, unknown>)["word/media/image.png"]
  expect(() => inspectArchive(archive(entries))).toThrow("unsupported")
  expect(() =>
    inspectArchive(
      archive({
        "word/document.xml": document('<w:drawing r:embed="missing"/>'),
      })
    )
  ).toThrow("unsupported")
  expect(() =>
    inspectArchive(
      archive({
        ...image(),
        "word/document.xml": document('<w:drawing r:embed="other"/>'),
      })
    )
  ).toThrow("unsupported")
})
test.each([
  ["https://example.com/image.png", 'TargetMode="External"'],
  ["https://example.com/image.png", ""],
  ["../../../outside.png", ""],
  ["%zz", ""],
])("rejects remote or invalid resource target %s", (target, mode) => {
  expect(() => inspectArchive(archive(image(target, mode)))).toThrow(Error)
})
test.each([
  "<w:altChunk/>",
  "<w:object/>",
  "<w:control/>",
  "<w:subDoc/>",
  '<w:instrText>INCLUDETEXT "external"</w:instrText>',
  '<w:fldSimple w:instr="INCLUDEPICTURE external"/>',
])("rejects unsupported active or embedded content %s", (body) => {
  expect(() =>
    inspectArchive(archive({ "word/document.xml": document(body) }))
  ).toThrow("unsupported")
})
test.each([
  '<Relationship Type="image" Target="image.png"/>',
  '<Relationship Id="image" Type="image"/>',
  '<Relationship Id="image" Target="image.png"/>',
  '<Relationship Id="x" Type="hyperlink" Target="x"/><Relationship Id="x" Type="hyperlink" Target="x"/>',
])("rejects invalid relationships %s", (body) => {
  expect(() =>
    inspectArchive(
      archive({ "word/_rels/document.xml.rels": relationships(body) })
    )
  ).toThrow(Error)
})
const invalid: Record<string, string | Uint8Array>[] = [
  { "./word/document.xml": document() },
  { "../escape": "" },
  { "word/./media/image.png": new Uint8Array([255]) },
  { "word\\media\\image.png": new Uint8Array([255]) },
  { "word/document.xml": "<broken>" },
  { "word/document.xml": "" },
  { "word/document.xml": "<!DOCTYPE root><root/>" },
  { "word/document.xml": '<!ENTITY content "value"><root/>' },
  { "word/document.xml": new Uint8Array([255, 254, 255]) },
]
test.each(invalid)(
  "rejects malformed XML and ambiguous package paths %j",
  (entries) => {
    expect(() => inspectArchive(archive(entries))).toThrow(Error)
  }
)
test("recognizes protected Office containers and invalid non-ZIP input", () => {
  expect(() =>
    inspectArchive(
      new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]).buffer
    )
  ).toThrow("protected")
  expect(() => inspectArchive(new ArrayBuffer(0))).toThrow("INVALID")
})
test("reads UTF-16 XML in either byte order, with or without a BOM", () => {
  for (const big of [false, true])
    for (const bom of [false, true]) {
      const source = (bom ? "\ufeff" : "") + document()
      const bytes = new Uint8Array(source.length * 2)
      const view = new DataView(bytes.buffer)
      for (let i = 0; i < source.length; i++)
        view.setUint16(i * 2, source.charCodeAt(i), !big)
      expect(() =>
        inspectArchive(archive({ "word/document.xml": bytes }))
      ).not.toThrow()
    }
})
test("handles strict OOXML relationship namespaces", () => {
  const source = document('<w:drawing r:embed="missing"/>')
    .replace(w, "http://purl.oclc.org/ooxml/wordprocessingml/main")
    .replace(r, "http://purl.oclc.org/ooxml/officeDocument/relationships")
  expect(() =>
    inspectArchive(archive({ "word/document.xml": source }))
  ).toThrow("unsupported")
})
test("classifies errors without leaking private document text", () => {
  const typed = new ConversionError("unsupported", 3)
  expect(failure(typed)).toBe(typed)
  for (const code of [
    "encrypted",
    "invalid-password",
    "unsupported-encryption",
  ])
    expect(failure(Object.assign(new Error("private"), { code })).code).toBe(
      "protected"
    )
  expect(
    failure(
      Object.assign(new Error("private"), { code: "ooxml-decoded-image-limit" })
    ).code
  ).toBe("resource")
  expect(failure(new Error("TOO_LARGE")).code).toBe("resource")
  expect(failure(new RangeError("Invalid array length")).code).toBe("resource")
  expect(failure("private document path")).toMatchObject({
    code: "invalid",
    message: "invalid",
  })
  expect(
    failure(Object.assign(new Error("WASM trap"), { code: "parser-crashed" }))
      .code
  ).toBe("invalid")
})
