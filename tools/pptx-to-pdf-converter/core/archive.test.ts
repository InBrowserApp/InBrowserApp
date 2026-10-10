// @vitest-environment jsdom
import { expect, test } from "vitest"
import { strToU8, zipSync } from "fflate"
import { inspectArchive } from "./archive"
import { ConversionError, failure } from "./errors"

const p = "http://schemas.openxmlformats.org/presentationml/2006/main"
const a = "http://schemas.openxmlformats.org/drawingml/2006/main"
const r = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
const document = (body = "") =>
  `<p:sld xmlns:p="${p}" xmlns:a="${a}" xmlns:r="${r}"><p:cSld>${body}</p:cSld></p:sld>`
const relation = (attributes: string) => `<Relationship ${attributes}/>`
const relationships = (body: string) => `<Relationships>${body}</Relationships>`
function archive(entries: Record<string, string | Uint8Array> = {}) {
  const bytes = zipSync(
    Object.fromEntries(
      Object.entries({
        "[Content_Types].xml": "<Types/>",
        "ppt/presentation.xml": `<p:presentation xmlns:p="${p}"/>`,
        "ppt/slides/slide1.xml": document(),
        ...entries,
      }).map(([name, value]) => [
        name,
        typeof value === "string" ? strToU8(value) : value,
      ])
    )
  )
  return bytes.slice().buffer
}
function image(target = "../media/image.png", mode = "") {
  return {
    "ppt/slides/slide1.xml": document('<a:blip r:embed="image"/>'),
    "ppt/slides/_rels/slide1.xml.rels": relationships(
      relation(`Id="image" Type="${r}/image" Target="${target}" ${mode}`)
    ),
    "ppt/media/image.png": new Uint8Array([255]),
  }
}

test("accepts local resources, normalized targets and omitted PDF hyperlinks without decoding binary assets", () => {
  for (const target of [
    "../media/image.png",
    "/ppt/media/image.png",
    "../temp/../media/%69mage.png#part",
  ])
    expect(() => inspectArchive(archive(image(target)))).not.toThrow()
  expect(() =>
    inspectArchive(
      archive({
        ...image(),
        "_rels/.rels": relationships(
          relation(
            `Id="root" Type="${r}/officeDocument" Target="ppt/presentation.xml"`
          )
        ),
        "ppt/slides/_rels/slide1.xml.rels": relationships(
          relation(`Id="image" Type="${r}/image" Target="../media/image.png"`) +
            relation(
              `Id="url" Type="${r}/hyperlink" Target="https://example.com" TargetMode="External"`
            )
        ),
        "ppt/styles.xml": '<styles><item id="not-a-relationship"/></styles>',
        "ppt/unused.xml": document('<p:sp r:id=""/>'),
      })
    )
  ).not.toThrow()
})
test("rejects missing parts and missing relationship IDs instead of a successful PDF with omitted images", () => {
  const entries = image()
  delete (entries as Record<string, unknown>)["ppt/media/image.png"]
  expect(() => inspectArchive(archive(entries))).toThrow("unsupported")
  expect(() =>
    inspectArchive(
      archive({
        "ppt/slides/slide1.xml": document('<a:blip r:embed="missing"/>'),
      })
    )
  ).toThrow("unsupported")
  expect(() =>
    inspectArchive(
      archive({
        ...image(),
        "ppt/slides/slide1.xml": document('<a:blip r:embed="other"/>'),
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
test.each(["<p:oleObj/>", "<p:control/>", "<p:contentPart/>"])(
  "rejects unsupported embedded content %s",
  (body) => {
    expect(() =>
      inspectArchive(archive({ "ppt/slides/slide1.xml": document(body) }))
    ).toThrow("unsupported")
  }
)
test.each([
  '<Relationship Type="image" Target="image.png"/>',
  '<Relationship Id="image" Type="image"/>',
  '<Relationship Id="image" Target="image.png"/>',
  '<Relationship Id="x" Type="hyperlink" Target="x"/><Relationship Id="x" Type="hyperlink" Target="x"/>',
])("rejects invalid relationships %s", (body) => {
  expect(() =>
    inspectArchive(
      archive({ "ppt/slides/_rels/slide1.xml.rels": relationships(body) })
    )
  ).toThrow(Error)
})
const invalid: Record<string, string | Uint8Array>[] = [
  { "./ppt/slides/slide1.xml": document() },
  { "../escape": "" },
  { "ppt/./media/image.png": new Uint8Array([255]) },
  { "ppt\\media\\image.png": new Uint8Array([255]) },
  { "ppt/slides/slide1.xml": "<broken>" },
  { "ppt/slides/slide1.xml": "" },
  { "ppt/slides/slide1.xml": "<!DOCTYPE root><root/>" },
  { "ppt/slides/slide1.xml": '<!ENTITY content "value"><root/>' },
  { "ppt/slides/slide1.xml": new Uint8Array([255, 254, 255]) },
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
        inspectArchive(archive({ "ppt/slides/slide1.xml": bytes }))
      ).not.toThrow()
    }
})
test("handles strict OOXML relationship namespaces", () => {
  const source = document('<a:blip r:embed="missing"/>')
    .replace(p, "http://purl.oclc.org/ooxml/presentationml/main")
    .replace(r, "http://purl.oclc.org/ooxml/officeDocument/relationships")
  expect(() =>
    inspectArchive(archive({ "ppt/slides/slide1.xml": source }))
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

test.each([
  ["ppt/presentation.xml", "<presentation/>"],
  ["ppt/presentation.xml", `<p:wrong xmlns:p="${p}"/>`],
  ["ppt/slides/slide1.xml", `<p:wrong xmlns:p="${p}"/>`],
  ["ppt/slides/slide1.xml", "<sld/>"],
])("rejects an invalid OOXML root in %s", (name, value) => {
  expect(() => inspectArchive(archive({ [name]: value }))).toThrow("invalid")
})
test.each(["off", "chOff", "ext", "chExt", "xfrm"])(
  "rejects malformed %s geometry instead of silently changing slide appearance",
  (element) => {
    expect(() =>
      inspectArchive(
        archive({
          "ppt/slides/slide1.xml": document(`<a:${element} x="invalid"/>`),
        })
      )
    ).toThrow("invalid")
    expect(() =>
      inspectArchive(
        archive({
          "ppt/slides/slide1.xml": document(
            `<a:${element} x=" -42 " y="+1" cx="100" cy="200" rot="0"/>`
          ),
        })
      )
    ).not.toThrow()
  }
)
test("accepts strict DrawingML geometry and explicit ZIP directories", () => {
  expect(() =>
    inspectArchive(
      archive({
        "ppt/media/": "",
        "ppt/slides/slide1.xml": document('<a:off x="1"/>').replace(
          a,
          "http://purl.oclc.org/ooxml/drawingml/main"
        ),
      })
    )
  ).not.toThrow()
})
test.each(["videoFile", "audioFile"])(
  "requires an embedded poster for %s",
  (element) => {
    const media = `<a:${element}/>`
    for (const body of [
      media,
      `<p:pic><p:nvPicPr>${media}</p:nvPicPr></p:pic>`,
      `<p:pic>${media}<a:blip embed="image"/></p:pic>`,
      `<p:pic>${media}<a:blip r:embed=""/></p:pic>`,
    ]) {
      expect(() =>
        inspectArchive(archive({ "ppt/slides/slide1.xml": document(body) }))
      ).toThrow("unsupported")
    }
    expect(() =>
      inspectArchive(
        archive({
          ...image(),
          "ppt/slides/slide1.xml": document(
            `<p:pic><p:nvPicPr>${media}</p:nvPicPr><p:blipFill><a:blip r:embed="image"/></p:blipFill></p:pic>`
          ),
        })
      )
    ).not.toThrow()
  }
)
