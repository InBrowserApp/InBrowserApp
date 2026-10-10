import { readFileSync } from "node:fs"
import { describe, expect, test } from "vitest"
import { CFB } from "xlsx"
import type { WorkBook, CellObject } from "xlsx"
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate"
import { readXlsx, writeOds } from "./workbook"
import { cellXml } from "./values"
import { xml, paragraph } from "./xml"

const fixture = (name = "typed") =>
  new Uint8Array(
    readFileSync(`tools/xlsx-to-ods-converter/fixtures/${name}.xlsx`)
  )
const archive = (edit: (files: Record<string, Uint8Array>) => void) => {
  const files = unzipSync(fixture())
  edit(files)
  return zipSync(files)
}
const editXml = (
  files: Record<string, Uint8Array>,
  path: string,
  edit: (s: string) => string
) => {
  files[path] = strToU8(edit(strFromU8(files[path]!)))
}
const content = (book: WorkBook) =>
  strFromU8(unzipSync(new Uint8Array(writeOds(book)))["content.xml"]!)
const document = (source: string) =>
  new DOMParser().parseFromString(source, "text/xml")
const attribute = (node: Element, name: string) => node.getAttribute(name)

test("exports owned openpyxl values, hidden/empty sheets and cached results without active content", () => {
  const { book, info } = readXlsx(fixture())
  expect(info.missingCaches).toBe(1)
  expect(info.sheets.map((s) => [s.name, s.hidden])).toEqual([
    ["Data 中文", 0],
    ["Empty", 0],
    ["Hidden", 1],
    ["Very hidden", 2],
  ])
  const source = content(book)
  const doc = document(source)
  const tables = [...doc.getElementsByTagName("table:table")]
  expect(tables.map((t) => attribute(t, "table:name"))).toEqual(book.SheetNames)
  expect(tables.map((t) => attribute(t, "table:style-name"))).toEqual([
    "visible",
    "visible",
    "hidden",
    "hidden",
  ])
  const cells = [...tables[0]!.getElementsByTagName("table:table-cell")]
  const strings = cells
    .filter((c) => attribute(c, "office:value-type") === "string")
    .map((c) => attribute(c, "office:string-value"))
  expect(strings).toEqual(
    expect.arrayContaining([
      "  café 中文 😀  ",
      "00123",
      "=literal",
      "cached text",
      "#DIV/0!",
      'tab\tline\nbreak\rreturn & < > "',
      "Merged anchor",
    ])
  )
  expect(source).toContain('office:date-value="2026-10-10T12:30:00.125"')
  expect(source).toContain('office:date-value="1900-02-28T00:00:00.000"')
  expect(source).toContain('office:date-value="1900-03-01T00:00:00.000"')
  expect(source).toContain('office:time-value="PT129601S"')
  expect(source).toContain('office:time-value="-PT10800S"')
  expect(source).toContain('office:boolean-value="false"')
  expect(source).toContain('office:value="44"')
  expect(source).not.toMatch(
    /table:formula|xlink:href|number-columns-spanned|never-fetch|SUM\(/
  )
  const bytes = new Uint8Array(writeOds(book))
  const files = unzipSync(bytes)
  expect(Object.keys(files)).toEqual([
    "mimetype",
    "content.xml",
    "META-INF/manifest.xml",
  ])
  expect(strFromU8(files.mimetype!)).toBe(
    "application/vnd.oasis.opendocument.spreadsheet"
  )
  expect(new DataView(bytes.buffer).getUint16(8, true)).toBe(0)
  expect(new DataView(bytes.buffer).getUint16(28, true)).toBe(0)
})

test("respects the 1904 epoch and keeps time zero and elapsed hours", () => {
  const source = content(readXlsx(fixture("epoch-1904")).book)
  expect(source).toContain('office:date-value="1904-01-01T00:00:00.000"')
  expect(source).toContain('office:date-value="2026-10-10T12:30:00.000"')
  expect(source).toContain('office:time-value="PT0S"')
  expect(source).toContain('office:time-value="PT176400S"')
})

test("writes the last Excel cell with sparse repetition instead of traversing its rectangle", () => {
  const source = content(readXlsx(fixture("sparse")).book)
  expect(source).toContain('table:number-rows-repeated="1048574"')
  expect(source).toContain('table:number-columns-repeated="16383"')
  expect(source).toContain('Last<text:s text:c="1"/>cell')
  expect(source.length).toBeLessThan(6000)
})

test("keeps empty workbooks and cells, floating numbers, and XML-safe text", () => {
  const book: WorkBook = { SheetNames: ["A & B"], Sheets: { "A & B": {} } }
  expect(content(book)).toContain('table:name="A &amp; B"')
  book.Sheets["A & B"] = { A1: { t: "n", v: 0 }, C3: { t: "s", v: "" } }
  expect(content(book)).toContain('office:value="0"')
  expect(content(book)).toContain('table:number-columns-repeated="2"')
  expect(cellXml({ t: "n" }, false)).toBe("<table:table-cell/>")
  expect(cellXml({ t: "z", v: 0 }, false)).toBe("<table:table-cell/>")
  expect(cellXml({ t: "s", v: "=42" }, false)).toContain(
    'office:string-value="=42"'
  )
  expect(xml("&<>\"'\t\r\n")).toBe("&amp;&lt;&gt;&quot;&apos;&#9;&#13;&#10;")
  expect(paragraph("  A\tB\nC\rD")).toBe(
    '<text:p><text:s text:c="2"/>A<text:tab/>B<text:line-break/>C&#13;D</text:p>'
  )
})

describe("invalid and unsupported values", () => {
  test.each(["\u0000", "\u000b", "\ud800", "\udfff", "\ufffe", "\uffff"])(
    "rejects XML-invalid text %j",
    (value) => {
      expect(() => cellXml({ t: "s", v: value }, false)).toThrow("unsupported")
    }
  )
  test.each([
    { t: "n", v: Infinity },
    { t: "n", v: NaN },
    { t: "n", v: "42" },
    { t: "d", v: new Date() },
    { t: "n", v: 60, z: "yyyy-mm-dd" },
    { t: "n", v: 0, z: "yyyy-mm-dd" },
    { t: "n", v: -1, z: "yyyy-mm-dd" },
    { t: "n", v: 3000000, z: "yyyy-mm-dd" },
    { t: "n", v: Number.MAX_VALUE, z: "yyyy-mm-dd" },
    { t: "n", v: 40000, z: "ggge/mm/dd" },
    { t: "n", v: 40000, z: "yyyy-mm-dd;0" },
    { t: "n", v: Number.MAX_VALUE, z: "[h]:mm:ss" },
  ] as CellObject[])("rejects unrepresentable value %j", (cell) => {
    expect(() => cellXml(cell, false)).toThrow("unsupported")
  })
  test("rejects overflowing date systems and invalid cell positions", () => {
    expect(() =>
      cellXml({ t: "n", v: 2958465, z: "yyyy-mm-dd" }, true)
    ).toThrow("unsupported")
    for (const address of ["A0", "XFE1", "A1048577"]) {
      const book = {
        SheetNames: ["Data"],
        Sheets: { Data: { [address]: { t: "n", v: 1 } } },
      } as WorkBook
      expect(() => writeOds(book)).toThrow(/invalid|unsupported/)
    }
  })
})

test("validates actual XLSX packages and rejects other ZIP and compound formats", () => {
  expect(() => readXlsx(strToU8("text"))).toThrow("invalid")
  expect(() => readXlsx(zipSync({ text: strToU8("not XLSX") }))).toThrow(
    "unsupported"
  )
  expect(() =>
    readXlsx(
      archive((files) => {
        delete files["xl/workbook.xml"]
      })
    )
  ).toThrow("unsupported")
  expect(() =>
    readXlsx(
      archive((files) => {
        files["xl/vbaProject.bin"] = new Uint8Array()
      })
    )
  ).toThrow("unsupported")
  for (const stream of ["EncryptedPackage", "EncryptionInfo", "Workbook"]) {
    const cfb = CFB.utils.cfb_new()
    CFB.utils.cfb_add(cfb, stream, new Uint8Array([1]))
    expect(() => readXlsx(CFB.write(cfb, { type: "buffer" }))).toThrow(
      stream === "Workbook" ? "unsupported" : "protected"
    )
  }
})

test("rejects malformed XML, entities, wrong content types and all-hidden workbooks", () => {
  const cases: [
    (files: Record<string, Uint8Array>) => void,
    string | RegExp,
  ][] = [
    [
      (files) => editXml(files, "xl/workbook.xml", (s) => s.slice(0, -10)),
      /unclosed|unexpected/i,
    ],
    [
      (files) =>
        editXml(
          files,
          "xl/workbook.xml",
          (s) => '<!DOCTYPE workbook [<!ENTITY x "bad">]>' + s
        ),
      "unsupported",
    ],
    [
      (files) =>
        editXml(files, "[Content_Types].xml", (s) =>
          s.replace(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
            "application/vnd.ms-excel.sheet.macroEnabled.main+xml"
          )
        ),
      "unsupported",
    ],
    [
      (files) =>
        editXml(files, "[Content_Types].xml", (s) =>
          s.replace(
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"',
            ""
          )
        ),
      "unsupported",
    ],
    [
      (files) =>
        editXml(files, "xl/workbook.xml", (s) =>
          s.replaceAll('state="visible"', 'state="hidden"')
        ),
      "unsupported",
    ],
    [
      (files) =>
        editXml(files, "xl/workbook.xml", (s) =>
          s.replace('name="Empty"', 'name="Data 中文"')
        ),
      /invalid|duplicate/i,
    ],
  ]
  for (const [edit, message] of cases)
    expect(() => readXlsx(archive(edit))).toThrow(message)
})

test("rejects UTF-16 XML that the XLSX engine cannot reliably read", () => {
  for (const bigEndian of [false, true]) {
    const bytes = archive((files) => {
      const source = strFromU8(files["[Content_Types].xml"]!).replace(
        'encoding="UTF-8"',
        'encoding="UTF-16"'
      )
      const encoded = Buffer.from("\ufeff" + source, "utf16le")
      if (bigEndian) encoded.swap16()
      files["[Content_Types].xml"] = encoded
    })
    expect(() => readXlsx(bytes)).toThrow("unsupported")
  }
})

const worksheet = (edit: (s: string) => string) =>
  archive((files) => editXml(files, "xl/worksheets/sheet1.xml", edit))
const resultCell = (source: string, cell: string) =>
  source.replace(/<c r="D4"[\s\S]*?<\/c>/, cell)

test("distinguishes absent and empty typed formula caches from saved false and empty string results", () => {
  for (const kind of ["", ' t="b"', ' t="str"', ' t="n"']) {
    const { book, info } = readXlsx(
      worksheet((s) => resultCell(s, `<c r="D4"${kind}><f>SUM(1,2)</f></c>`))
    )
    expect(info.missingCaches).toBe(1)
    expect(book.Sheets["Data 中文"]!.D4.v).toBeUndefined()
    expect(content(book)).not.toContain('office:value="NaN"')
  }
  for (const [kind, value, expected] of [
    ["b", "0", false],
    ["b", "false", false],
    ["b", "true", true],
    ["str", "", ""],
  ] as const) {
    const { book, info } = readXlsx(
      worksheet((s) =>
        resultCell(
          s,
          `<c r="D4" t="${kind}"><f>SUM(1,2)</f><v>${value}</v></c>`
        )
      )
    )
    expect(info.missingCaches).toBe(0)
    expect(book.Sheets["Data 中文"]!.D4.v).toBe(expected)
  }
})

test("warns for absent array formula results without fabricating zeroes", () => {
  const { book, info } = readXlsx(
    worksheet((s) =>
      resultCell(
        s,
        '<c r="D4"><f t="array" ref="D4:E4">SUM(1,2)</f><v>3</v></c>'
      ).replace(/<c r="E4"[\s\S]*?<\/c>/, '<c r="E4"/>')
    )
  )
  expect(info.missingCaches).toBe(1)
  expect(book.Sheets["Data 中文"]!.E4.v).toBeUndefined()
  expect(book.Sheets["Data 中文"]!.D4.v).toBe(3)
})

test.each([
  '<c r="D4" t="b"><v>maybe</v></c>',
  '<c r="D4" t="b"><v> true </v></c>',
  '<c r="D4" t="n"><v>42garbage</v></c>',
  '<c r="D4" t="n"><v>1e999</v></c>',
  '<c r="D4"><c r="E4"><v>3</v></c></c>',
  "<c><v>4</v></c>",
  '<c r="D4" t="d"><v>2026-10-10T00:00:00Z</v></c>',
  '<c r="D4"><v><![CDATA[42]]></v></c>',
])("rejects unsupported or malformed cell representations %s", (cell) => {
  expect(() => readXlsx(worksheet((s) => resultCell(s, cell)))).toThrow(
    /invalid|unsupported/
  )
})

test("validates sheet names, relationship IDs and local targets", () => {
  const path = "xl/_rels/workbook.xml.rels"
  for (const change of [
    (s: string) => s.replace('Id="rId1"', ""),
    (s: string) => s.replace('Target="/xl/worksheets/sheet1.xml"', ""),
    (s: string) =>
      s.replace(
        'Target="/xl/worksheets/sheet1.xml"',
        'Target="/xl/worksheets/sheet1.xml" TargetMode="External"'
      ),
    (s: string) =>
      s.replace(
        'Target="/xl/worksheets/sheet1.xml"',
        'Target="https://example.invalid/sheet.xml"'
      ),
    (s: string) =>
      s.replace('Target="/xl/worksheets/sheet1.xml"', 'Target="missing.xml"'),
  ])
    expect(() =>
      readXlsx(archive((files) => editXml(files, path, change)))
    ).toThrow(Error)
  for (const change of [
    (s: string) => s.replace('name="Data 中文"', ""),
    (s: string) => s.replace('r:id="rId1"', ""),
  ])
    expect(() =>
      readXlsx(archive((files) => editXml(files, "xl/workbook.xml", change)))
    ).toThrow("invalid")
})

test("does not import spreadsheet-like cells stored only inside extension metadata", () => {
  const { book, info } = readXlsx(
    worksheet((s) =>
      s.replace(
        "</worksheet>",
        '<extLst><ext uri="urn:owned-test"><c r="Z99"/></ext></extLst></worksheet>'
      )
    )
  )
  expect(book.Sheets["Data 中文"]!.Z99).toBeUndefined()
  expect(info.missingCaches).toBe(1)
})
