import { expect, test } from "vitest"
import { xml2js } from "xml-js"
import type { Element } from "xml-js"
import { read } from "xlsx"
import { zipSync, strToU8 } from "fflate"
import { applyOdfMetadata } from "./odf-metadata"
import { readOpenDocument } from "./fods"
import { workbookArchive } from "./workbook-archive"
import type { WorkBook } from "xlsx"

const xml = (value: string) => xml2js(value, { compact: false }) as Element

test("preserves escaped display text without changing stored numeric values", () => {
  const book: WorkBook = {
    SheetNames: ["Data"],
    Sheets: { Data: { A1: { t: "n", v: 12.5, w: "saved parser cache" } } },
  }
  applyOdfMetadata(book, [
    xml(
      `<root xmlns:table="table" xmlns:text="text" xmlns:office="office"><table:table table:name="Data"><table:table-row><table:table-cell office:value-type="currency"><text:p><text:span><![CDATA[12.50]]></text:span><text:s text:c="2"/>&quot;USD&quot;<text:tab/>unit<text:line-break/>total<office:annotation><text:p>Cell note</text:p></office:annotation></text:p></table:table-cell></table:table-row></table:table><table:table table:name="Other"/></root>`
    ),
  ])
  const stored = read(workbookArchive(book), { type: "array" }).Sheets.Sheet1!
    .A1
  expect(stored.v).toBe(12.5)
  expect(stored.w).toBe('12.50  "USD"\tunit\ntotal')
})

test("rejects invalid repetition counts instead of guessing coordinates", () => {
  const book: WorkBook = { SheetNames: ["Data"], Sheets: { Data: {} } }
  expect(() =>
    applyOdfMetadata(book, [
      xml(
        '<root><table name="Data"><table-row number-rows-repeated="-1"/></table></root>'
      ),
    ])
  ).toThrow("INVALID")
})

test("rejects encrypted or incomplete ODS containers", () => {
  const archive = (files: Record<string, string>) =>
    Uint8Array.from(
      zipSync(
        Object.fromEntries(
          Object.entries(files).map(([key, value]) => [key, strToU8(value)])
        )
      )
    ).buffer
  expect(() =>
    readOpenDocument(
      archive({
        "META-INF/manifest.xml": "<manifest><encryption-data/></manifest>",
        "content.xml": "ciphertext",
      }),
      false
    )
  ).toThrow("Encrypted")
  expect(() =>
    readOpenDocument(
      archive({ mimetype: "application/vnd.oasis.opendocument.spreadsheet" }),
      false
    )
  ).toThrow("INVALID")
})
