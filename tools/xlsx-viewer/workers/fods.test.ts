import { expect, test } from "vitest"
import { normalizeSpreadsheet } from "./normalize"
import { defaultImportOptions } from "../formats"
import { read } from "xlsx"
import { zipSync, strToU8 } from "fflate"

test("keeps worksheet identity when FODS cells contain an embedded chart with a local data table", () => {
  const xml = `<?xml version="1.0"?><office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"><office:body><office:spreadsheet><table:table table:name="Report"><table:table-row><table:table-cell office:value-type="string"><text:p>Before chart</text:p><draw:frame><draw:object><office:document><office:body><office:chart><table:table table:name="local-table"><table:table-row><table:table-cell office:value-type="string"><text:p>Chart resource</text:p></table:table-cell></table:table-row></table:table></office:chart></office:body></office:document></draw:object></draw:frame></table:table-cell><table:table-cell office:value-type="string"><text:p>After chart</text:p></table:table-cell></table:table-row></table:table><table:table table:name="Second"><table:table-row><table:table-cell office:value-type="float" office:value="42"/></table:table-row></table:table></office:spreadsheet></office:body></office:document>`
  const result = normalizeSpreadsheet(
    new TextEncoder().encode(xml).buffer,
    "report.fods",
    defaultImportOptions
  )
  const book = read(result.data, { type: "array" })
  expect(result.names).toEqual(["Report", "Second"])
  expect(book.Sheets.Sheet1!.A1.v).toBe("Before chart")
  expect(book.Sheets.Sheet1!.B1.v).toBe("After chart")
  expect(book.Sheets.Sheet2!.A1.v).toBe(42)
})

test("keeps saved date/currency displays, repeated cell coordinates, and hidden sheets", () => {
  const xml = `<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"><office:automatic-styles><style:style style:name="hidden" style:family="table"><style:table-properties table:display="false"/></style:style></office:automatic-styles><office:body><office:spreadsheet><table:table table:name="Saved values" table:style-name="hidden"><table:table-row table:number-rows-repeated="2"><table:table-cell table:number-columns-repeated="2"/><table:table-cell office:value-type="date" office:date-value="2026-10-08"><text:p>2026-10-08</text:p></table:table-cell><table:table-cell table:number-columns-repeated="2" office:value-type="currency" office:currency="USD" office:value="12.5" table:formula="of:=25/2"><text:p>$12.50</text:p></table:table-cell><table:table-cell office:value-type="float" office:value="42"><text:p>42</text:p></table:table-cell></table:table-row></table:table></office:spreadsheet></office:body></office:document>`
  const result = normalizeSpreadsheet(
    new TextEncoder().encode(xml).buffer,
    "saved.fods",
    defaultImportOptions
  )
  const book = read(result.data, { type: "array", cellNF: true })
  expect(book.Workbook!.Sheets![0]!.Hidden).toBe(1)
  expect(book.Sheets.Sheet1!.C2).toMatchObject({ t: "n", w: "2026-10-08" })
  expect(book.Sheets.Sheet1!.D2).toMatchObject({
    t: "n",
    v: 12.5,
    w: "$12.50",
    f: "25/2",
  })
  expect(book.Sheets.Sheet1!.E1).toMatchObject({ t: "n", v: 12.5, w: "$12.50" })
  expect(book.Sheets.Sheet1!.F2).toMatchObject({ t: "n", v: 42, w: "42" })
})

test.each(["fods", "ods"])(
  "keeps annotations separate from numeric and rich-text cell displays in %s",
  (extension) => {
    const xml = `<?xml version="1.0"?><office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" office:version="1.2"><office:body><office:spreadsheet><table:table table:name="Annotated"><table:table-row><table:table-cell office:value-type="float" office:value="42"><office:annotation><dc:creator>Reviewer</dc:creator><text:p>Needs review</text:p></office:annotation><text:p>42</text:p></table:table-cell><table:table-cell office:value-type="currency" office:currency="USD" office:value="12.5"><office:annotation><text:p>Budget confirmed</text:p></office:annotation><text:p>$12.50<text:s text:c="2"/><text:span>USD</text:span><text:tab/>unit<text:line-break/>total</text:p></table:table-cell><table:table-cell office:value-type="string"><office:annotation><text:p>Separate comment</text:p></office:annotation><text:p>Before<text:s text:c="2"/><text:span>after</text:span></text:p></table:table-cell></table:table-row></table:table></office:spreadsheet></office:body></office:document>`
    const source =
      extension === "fods"
        ? strToU8(xml)
        : zipSync({
            mimetype: strToU8("application/vnd.oasis.opendocument.spreadsheet"),
            "content.xml": strToU8(
              xml.replaceAll("office:document", "office:document-content")
            ),
            "styles.xml": strToU8(
              '<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" office:version="1.2"><office:styles/></office:document-styles>'
            ),
            "META-INF/manifest.xml": strToU8(
              '<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"><manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>'
            ),
          })
    const result = normalizeSpreadsheet(
      Uint8Array.from(source).buffer,
      `annotated.${extension}`,
      defaultImportOptions
    )
    const book = read(result.data, { type: "array" })
    expect(book.Sheets.Sheet1!.A1).toMatchObject({ v: 42, w: "42" })
    expect(book.Sheets.Sheet1!.B1).toMatchObject({
      v: 12.5,
      w: "$12.50  USD\tunit\ntotal",
    })
    expect(book.Sheets.Sheet1!.C1.v).toBe("Before  after")
  }
)
