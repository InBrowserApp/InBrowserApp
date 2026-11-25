// @vitest-environment jsdom
import { strToU8, zipSync } from "fflate"
import { expect, test } from "vitest"
import { readArchive } from "./archive"

const word = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
const core =
  "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
const dc = "http://purl.org/dc/elements/1.1/"
const contentTypes = `[Content_Types].xml`
const main = "word/document.xml"
const properties = "docProps/core.xml"
const styles = "word/styles.xml"

function archive(parts: Record<string, string | Uint8Array> = {}) {
  return zipSync(
    Object.fromEntries(
      Object.entries({
        [contentTypes]: `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/${main}" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
        [main]: `<w:document xmlns:w="${word}"><w:body><w:p><w:r><w:t>Chapter one</w:t></w:r></w:p></w:body></w:document>`,
        ...parts,
      }).map(([name, data]) => [
        name,
        typeof data === "string" ? strToU8(data) : data,
      ])
    )
  ).slice().buffer
}

function metadata(elements: string) {
  return `<cp:coreProperties xmlns:cp="${core}" xmlns:dc="${dc}">${elements}</cp:coreProperties>`
}

function defaultStyles(runProperties: string) {
  return `<w:styles xmlns:w="${word}"><w:docDefaults><w:rPrDefault><w:rPr>${runProperties}</w:rPr></w:rPrDefault></w:docDefaults></w:styles>`
}

test("reads trimmed Dublin Core values, prefers their language and records package parts", () => {
  const parts = {
    [properties]: metadata(`
      <dc:title>  La mer &amp; la lune  </dc:title>
      <dc:creator>  Renée 小林  </dc:creator>
      <dc:description>  A collection of illustrated stories.  </dc:description>
      <dc:language>  fr-CA  </dc:language>
    `),
    [styles]: defaultStyles(`<w:lang w:val="en-US"/>`),
    "word/footnotes.xml": `<w:footnotes xmlns:w="${word}"/>`,
  }

  expect(readArchive(archive(parts))).toEqual({
    entries: new Set([contentTypes, main, ...Object.keys(parts)]),
    title: "La mer & la lune",
    author: "Renée 小林",
    description: "A collection of illustrated stories.",
    language: "fr-CA",
  })
})

test("falls back to the default run language if metadata has no usable language", () => {
  expect(
    readArchive(
      archive({
        [properties]: metadata(`<dc:language>  </dc:language>`),
        [styles]: defaultStyles(`<w:lang w:val="ja-JP"/>`),
      })
    )
  ).toMatchObject({ title: "", author: "", description: "", language: "ja-JP" })
})

test.each([
  ["little-endian with BOM", true, true],
  ["little-endian without BOM", true, false],
  ["big-endian with BOM", false, true],
  ["big-endian without BOM", false, false],
])("decodes UTF-16 properties and styles, %s", (_label, littleEndian, bom) => {
  function utf16(xml: string) {
    const text = bom ? `\ufeff${xml}` : xml
    const bytes = new Uint8Array(text.length * 2)
    const view = new DataView(bytes.buffer)
    for (let index = 0; index < text.length; index++) {
      view.setUint16(index * 2, text.charCodeAt(index), littleEndian)
    }
    return bytes
  }

  expect(
    readArchive(
      archive({
        [properties]: utf16(metadata(`<dc:title>月の物語</dc:title>`)),
        [styles]: utf16(defaultStyles(`<w:lang w:val="ja-JP"/>`)),
      })
    )
  ).toMatchObject({ title: "月の物語", language: "ja-JP" })
})

const absentMetadata = {
  title: "",
  author: "",
  description: "",
  language: undefined,
}

test.each([
  ["missing", {}],
  ["empty", { [properties]: "", [styles]: "" }],
  ["malformed XML", { [properties]: "<broken>", [styles]: "<broken>" }],
  [
    "a document type declaration",
    {
      [properties]: `<!DOCTYPE cp:coreProperties>${metadata(`<dc:title>Ignored</dc:title>`)}`,
    },
  ],
  ["no default styles", { [styles]: `<w:styles xmlns:w="${word}"/>` }],
  ["no default language", { [styles]: defaultStyles(`<w:b/>`) }],
  ["no language value", { [styles]: defaultStyles(`<w:lang w:bidi="ar"/>`) }],
])("ignores optional metadata when it has %s", (_label, parts) => {
  expect(readArchive(archive(parts))).toMatchObject(absentMetadata)
})

test("rejects blank input, damaged ZIP data and ZIP archives missing the Word document", () => {
  expect(() => readArchive(new ArrayBuffer(0))).toThrow("INVALID")
  expect(() => readArchive(Uint8Array.of(0x50, 0x4b, 3, 4).buffer)).toThrow(
    "invalid zip data"
  )
  const noDocument = zipSync({ [contentTypes]: strToU8("<Types/>") })
  expect(() => readArchive(noDocument.slice().buffer)).toThrow("INVALID")
})

test("reports a compound-file Office container as protected", () => {
  const signature = Uint8Array.of(
    0xd0,
    0xcf,
    0x11,
    0xe0,
    0xa1,
    0xb1,
    0x1a,
    0xe1
  )
  expect(() => readArchive(signature.buffer)).toThrow("protected")
})
