import { gzipSync, zipSync } from "fflate"
import { expect, test } from "vitest"
import { reportXmlFromBytes } from "./report-file"

const source = "<feedback>é</feedback>"
const xml = new TextEncoder().encode(source)

test("reads direct XML, GZIP XML, and one XML file inside a ZIP", () => {
  expect(reportXmlFromBytes(xml)).toBe(source)
  expect(reportXmlFromBytes(gzipSync(xml))).toBe(source)
  expect(
    reportXmlFromBytes(
      zipSync({
        "nested/report.XML": xml,
        "readme.txt": xml,
        "__MACOSX/extra.xml": xml,
      })
    )
  ).toBe(source)
})

test("requires a ZIP to contain one XML report", () => {
  expect(reportXmlFromBytes(zipSync({ "a.xml": xml, "b.xml": xml }))).toBeNull()
  expect(reportXmlFromBytes(zipSync({ "readme.txt": xml }))).toBeNull()
})

test("decodes BOM-tagged UTF-16 report attachments", () => {
  const littleEndian = Uint8Array.from([
    0xff,
    0xfe,
    ...Array.from(source).flatMap((character) => [character.charCodeAt(0), 0]),
  ])
  const bigEndian = Uint8Array.from([
    0xfe,
    0xff,
    ...Array.from(source).flatMap((character) => [0, character.charCodeAt(0)]),
  ])
  expect(reportXmlFromBytes(littleEndian)).toBe(source)
  expect(reportXmlFromBytes(gzipSync(bigEndian))).toBe(source)
})

test("reads an XML report split across several GZIP members", () => {
  const first = gzipSync(xml.subarray(0, 11))
  const second = gzipSync(xml.subarray(11))
  const archive = Uint8Array.from([...first, ...second])
  expect(reportXmlFromBytes(archive)).toBe(source)
})

test("preserves text in an attachment that declares a different encoding", () => {
  const declared = '<?xml version="1.0" encoding="ISO-8859-1"?>' + source
  const encoded = Uint8Array.from(declared, (character) =>
    character.charCodeAt(0)
  )
  expect(reportXmlFromBytes(encoded)).toBe(declared)
  expect(() => reportXmlFromBytes(Uint8Array.of(0xff))).toThrow(
    /not valid for encoding utf-8/i
  )
})

test("recognizes UTF-16 byte order from an XML declaration without a BOM", () => {
  const le = '<?xml version="1.0" encoding="UTF-16LE"?>' + source
  const be = '<?xml version="1.0" encoding="UTF-16BE"?>' + source
  expect(
    reportXmlFromBytes(
      Uint8Array.from(
        Array.from(le).flatMap((character) => [character.charCodeAt(0), 0])
      )
    )
  ).toBe(le)
  expect(
    reportXmlFromBytes(
      Uint8Array.from(
        Array.from(be).flatMap((character) => [0, character.charCodeAt(0)])
      )
    )
  ).toBe(be)
})
