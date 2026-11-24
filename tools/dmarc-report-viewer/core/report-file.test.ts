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
