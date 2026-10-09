import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { strToU8, unzipSync, zipSync } from "fflate"
import { parseOdt } from "./parse"
import { failure } from "./failure"
import { fixture, namespaces } from "./test-fixture"

const p = "<text:p>Readable text</text:p>"
const manifest = (value: string) =>
  `<m:manifest xmlns:m="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">${value}</m:manifest>`

test.each(["odt", "ott"])(
  "reads genuine LibreOffice %s packages",
  (extension) => {
    const bytes = readFileSync(
      `tools/odt-viewer/fixtures/river-survey.${extension}`
    )
    const result = parseOdt(new Uint8Array(bytes).buffer)
    expect(result.html).toContain("River")
    expect(result.html).toContain("<table")
    expect(result.html).toContain("<h1")
    expect(result.html).toContain('role="note"')
    expect(result.template).toBe(extension === "ott")
  }
)

test("recognizes MIME, including optional mimetype omission and namespace aliases", () => {
  const entries = unzipSync(new Uint8Array(fixture(p)))
  delete entries.mimetype
  entries["META-INF/manifest.xml"] = strToU8(
    manifest(
      '<m:file-entry m:full-path="/" m:media-type="application/vnd.oasis.opendocument.text-template"/>'
    )
  )
  entries["content.xml"] = strToU8(
    new TextDecoder()
      .decode(entries["content.xml"])
      .replace(/(<\/?)(?:office):/g, "$1o:")
      .replaceAll("xmlns:office=", "xmlns:o=")
  )
  expect(parseOdt(zipSync(entries).buffer as ArrayBuffer).template).toBe(true)
  delete entries["META-INF/manifest.xml"]
  expect(parseOdt(zipSync(entries).buffer as ArrayBuffer).html).toContain(
    "Readable text"
  )
})

test("rejects encrypted, unsupported, malformed and incomplete packages accurately", () => {
  expect(() => parseOdt(new ArrayBuffer(0))).toThrow("emptyFile")
  expect(() => parseOdt(new Uint8Array([1, 2, 3]).buffer)).toThrow(
    "invalid zip data"
  )
  expect(() =>
    parseOdt(zipSync({ mimetype: strToU8("x") }).buffer as ArrayBuffer)
  ).toThrow("invalid")
  expect(() =>
    parseOdt(
      fixture(p, { mimetype: "application/vnd.oasis.opendocument.spreadsheet" })
    )
  ).toThrow("unsupported")
  expect(() =>
    parseOdt(
      fixture(p, { "META-INF/manifest.xml": manifest("<m:encryption-data/>") })
    )
  ).toThrow("protected")
  expect(() =>
    parseOdt(
      fixture(p, {
        "META-INF/manifest.xml": manifest(
          '<m:file-entry m:full-path="/" m:media-type="application/vnd.oasis.opendocument.text-template"/>'
        ),
      })
    )
  ).toThrow("invalid")
  expect(() =>
    parseOdt(
      fixture(p, { "content.xml": `<office:document-content ${namespaces}/>` })
    )
  ).toThrow("unsupported")
  expect(() => parseOdt(fixture(p, { "content.xml": "<broken>" }))).toThrow(
    "unclosed tag"
  )
  expect(() =>
    parseOdt(
      fixture(p, {
        "content.xml":
          '<!DOCTYPE root [<!ENTITY file SYSTEM "https://example.invalid/secret">]><root/>',
      })
    )
  ).toThrow("invalid")
})

test("preserves explicit inherited page breaks and default/first page parts", () => {
  const styles = `<office:document-styles ${namespaces}><office:styles><style:style style:name="Parent" style:family="paragraph"><style:paragraph-properties fo:break-before="page"/></style:style></office:styles><office:master-styles><style:master-page style:name="Standard"><style:header>${p}</style:header><style:footer>${p}</style:footer><style:header-first>${p}</style:header-first><style:footer-first>${p}</style:footer-first></style:master-page></office:master-styles></office:document-styles>`
  const result = parseOdt(
    fixture(
      '<text:p text:style-name="Child">Next page</text:p>',
      { "styles.xml": styles },
      '<style:style style:name="Child" style:family="paragraph" style:parent-style-name="Parent"><style:paragraph-properties fo:break-after="page"/></style:style>'
    )
  )
  expect(result.breaks).toHaveLength(2)
  expect(result.html).toContain(result.breaks[0])
  expect(Object.keys(result.parts)).toHaveLength(4)
  const cyclic =
    '<style:style style:name="Cycle" style:family="paragraph" style:parent-style-name="Cycle"/>'
  expect(
    parseOdt(
      fixture('<text:p text:style-name="Cycle">Text</text:p>', {}, cyclic)
    ).breaks
  ).toHaveLength(0)
})

test("shows final tracked text and flags unsupported or unavailable content", () => {
  const body = `<text:tracked-changes><text:changed-region text:id="delete1"><text:deletion><text:p>Deleted secret</text:p></text:deletion></text:changed-region></text:tracked-changes><text:p>Visible final text<text:change text:change-id="delete1"/></text:p><office:annotation>${p}</office:annotation><draw:frame><draw:object xlink:href="Object 1"/></draw:frame><text:p><draw:frame><draw:image xlink:href="https://example.invalid/image.png"/></draw:frame></text:p>`
  const result = parseOdt(fixture(body))
  expect(result.html).toContain("Visible final text")
  expect(result.html).not.toContain("Deleted secret")
  expect(result.limited).toBe(true)
})

test("does not impose heading or archive entry limits", () => {
  const body = Array.from(
    { length: 1101 },
    (_, i) => `<text:h text:outline-level="1">Heading ${i}</text:h>`
  ).join("")
  const extras = Object.fromEntries(
    Array.from({ length: 10001 }, (_, i) => [`unused/${i}`, ""])
  )
  const result = parseOdt(fixture(body, extras))
  expect(result.html.match(/<h1/g)).toHaveLength(1101)
})

test.each([
  [new Error("protected"), "protected"],
  [new Error("unsupported"), "unsupported"],
  [new Error("emptyFile"), "emptyFile"],
  [new Error("resourceLimit"), "resourceLimit"],
  [new RangeError("Invalid array length"), "resourceLimit"],
  [new Error("allocation failed"), "resourceLimit"],
  [new RangeError("offset outside bounds"), "invalid"],
  [new RangeError("Maximum call stack size exceeded"), "invalid"],
  [null, "invalid"],
  [new Error("broken xml"), "invalid"],
])(
  "classifies parser failures without calling malformed data memory exhaustion",
  (reason, expected) => {
    expect(failure(reason)).toBe(expected)
  }
)

test("reads UTF-16 XML and refuses foreign namespaces posing as office content", () => {
  const xml = `<office:document-content ${namespaces}><office:body><office:text><text:p>Unicode 世界</text:p></office:text></office:body></office:document-content>`
  const utf16 = new Uint8Array(2 + xml.length * 2)
  utf16.set([0xff, 0xfe])
  for (let index = 0; index < xml.length; index++) {
    utf16[2 + index * 2] = xml.charCodeAt(index) & 255
    utf16[3 + index * 2] = xml.charCodeAt(index) >> 8
  }
  expect(parseOdt(fixture("", { "content.xml": utf16 })).html).toContain(
    "Unicode 世界"
  )
  const spoof = xml.replace(
    "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
    "urn:unrelated"
  )
  expect(() => parseOdt(fixture("", { "content.xml": spoof }))).toThrow(
    "unsupported"
  )
})

test("keeps inline raster data with extension MIME hints and ignores empty script containers", () => {
  const body =
    '<text:p><draw:frame><draw:image xmlns:loext="urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0" loext:mime-type="image/png"><office:binary-data>iVBORw0KGgo=</office:binary-data></draw:image></draw:frame></text:p><office:scripts/>'
  const result = parseOdt(fixture(body))
  expect(result.html).toContain('src="data:image/png;base64,iVBORw0KGgo="')
  expect(result.limited).toBe(false)
})
