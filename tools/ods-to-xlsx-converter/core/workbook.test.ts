import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { strToU8, unzipSync, zipSync } from "fflate"
import { read, utils } from "xlsx"
import { writeXlsx } from "@workspace/spreadsheet-conversion"
import { readOds } from "./workbook"

const fixture = (name = "typed") =>
  new Uint8Array(
    readFileSync(`tools/ods-to-xlsx-converter/fixtures/${name}.ods`)
  )
const original = unzipSync(fixture())
const namespace =
  'xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"'
const content = (tables: string, styles = "") =>
  `<office:document-content ${namespace}>${styles}<office:body><office:spreadsheet>${tables}</office:spreadsheet></office:body></office:document-content>`
const table = (cells: string, rowAttributes = "", name = "Data") =>
  `<table:table table:name="${name}"><table:table-row ${rowAttributes}>${cells}</table:table-row></table:table>`
const cell = (attributes = "", text = "") =>
  `<table:table-cell ${attributes}>${text}</table:table-cell>`
function source(xml: string, extra: Record<string, Uint8Array> = {}) {
  return zipSync({
    mimetype: original.mimetype!,
    "content.xml": strToU8(xml),
    ...extra,
  })
}
const convert = (cells: string, rowAttributes = "") =>
  readOds(source(content(table(cells, rowAttributes))))

test("converts typed data, repetitions, formulas, hidden and empty worksheets without importing embedded content", () => {
  const { book, info } = readOds(fixture())
  expect(book.SheetNames).toEqual(["数据 العربية", "Empty", "Hidden"])
  expect(info.missingCaches).toBe(1)
  expect(info.sheets[1]!.range).toBeNull()
  expect(info.sheets[2]!.hidden).toBe(1)
  const sheet = book.Sheets[book.SheetNames[0]!]!
  expect(sheet.A1).toEqual({ t: "s", v: "00123" })
  expect(sheet.B1).toEqual({ t: "n", v: 123.75 })
  expect(sheet.C1).toEqual({ t: "b", v: true })
  expect(sheet.D1.v).toBeCloseTo(46305.5208333333)
  expect(sheet.E1).toEqual({ t: "n", v: 0.125, z: "0.00%" })
  expect(sheet.F1).toEqual({ t: "n", v: 42.5 })
  expect(sheet.G1.v).toBeCloseTo(26.5 / 24)
  expect(sheet.A2.v).toBe("中文  العربية\t😀\nnext\nSecond paragraph boldlink")
  expect(sheet.B2).toEqual({ t: "s", v: "=SUM(A1:A2)" })
  expect(sheet["!merges"]).toEqual([utils.decode_range("A3:B3")])
  expect(sheet.D5.v).toBe(5)
  expect(sheet.A6).toEqual({ t: "n", v: 30 })
  expect(sheet.B6).toBeUndefined()
  expect(sheet.C6.v).toBe(true)
  expect(sheet.D6.v).toBe("A")
  expect(sheet.E6).toEqual({ t: "e", v: 15 })
  expect(sheet.F6.v).toBe(77)
  expect(sheet.A7).toEqual({ t: "s", v: "" })
  expect(sheet.B7.v).toBe(sheet.D1.v)
  expect(sheet.C7.v).toBeCloseTo(-2 / 24)
  const exported = read(writeXlsx(book), { type: "array", cellNF: true })
  expect(exported.Sheets[book.SheetNames[0]!]!.B2.t).toBe("s")
  expect(exported.Workbook!.Sheets![2]!.Hidden).toBe(1)
  for (const sheet of Object.values(exported.Sheets))
    for (const [address, value] of Object.entries(sheet))
      if (!address.startsWith("!")) expect(value.f).toBeUndefined()
})

test("exports the last Excel cell efficiently while preserving empty row metadata and all worksheets", () => {
  const { book } = readOds(fixture("sparse"))
  book.Sheets.Sparse!["!rows"] = []
  book.Sheets.Sparse!["!rows"]![500000] = { hidden: true, hpt: 30, level: 2 }
  const result = read(writeXlsx(book), { type: "array", cellStyles: true })
  expect(result.Sheets.Sparse!.A1.v).toBe("Start")
  expect(result.Sheets.Sparse!.XFD1048576.v).toBe("Last cell")
  expect(result.Sheets.Sparse!["!rows"]![500000]).toMatchObject({
    hidden: true,
    hpt: 30,
    level: 2,
  })
}, 10000)

test("recognizes namespace aliases, alternate XML encodings, CDATA, plain strings and rich whitespace", () => {
  const xml = content(
    table(
      cell("", "<text:p><![CDATA[<literal>]]></text:p>") +
        cell('office:value-type="string" office:string-value="attribute"') +
        cell('office:value-type="boolean" office:boolean-value="0"')
    )
  )
    .replace(/(?<=[</ ])office:/g, "o:")
    .replace("xmlns:office=", "xmlns:o=")
  for (const encoding of ["utf8", "utf16le", "utf16be"] as const) {
    const bytes =
      encoding === "utf8"
        ? strToU8(xml)
        : new Uint8Array(Buffer.from("\ufeff" + xml, "utf16le"))
    if (encoding === "utf16be")
      for (let i = 0; i < bytes.length; i += 2)
        [bytes[i], bytes[i + 1]] = [bytes[i + 1]!, bytes[i]!]
    const { book } = readOds(
      zipSync({ mimetype: original.mimetype!, "content.xml": bytes })
    )
    expect(book.Sheets.Data!.A1.v).toBe("<literal>")
    expect(book.Sheets.Data!.B1.v).toBe("attribute")
    expect(book.Sheets.Data!.C1.v).toBe(false)
  }
  const defaultNamespace = content(
    table(
      cell(
        'office:value-type="string"',
        '<p xmlns="urn:oasis:names:tc:opendocument:xmlns:text:1.0">A<s/>B</p>'
      )
    )
  )
  expect(readOds(source(defaultNamespace)).book.Sheets.Data!.A1.v).toBe("A B")
})

test("normalizes dates independently of ODF's numeric epoch and handles positive and negative durations", () => {
  for (const [value, expected] of [
    ["1900-01-01", 1],
    ["1900-02-28", 59],
    ["1900-03-01", 61],
    ["1904-01-01", 1462],
    ["2026-10-10T12:30:00.500Z", 46305 + 45000.5 / 86400],
  ] as const)
    expect(
      convert(cell(`office:value-type="date" office:date-value="${value}"`))
        .book.Sheets.Data!.A1.v
    ).toBeCloseTo(expected)
  for (const [value, expected] of [
    ["P2D", 2],
    ["PT1H2M3S", 3723 / 86400],
    ["-PT0.5H", -0.5 / 24],
  ] as const)
    expect(
      convert(cell(`office:value-type="time" office:time-value="${value}"`))
        .book.Sheets.Data!.A1.v
    ).toBeCloseTo(expected)
  expect(
    convert(cell('office:value-type="boolean" office:boolean-value="1"')).book
      .Sheets.Data!.A1.v
  ).toBe(true)
  expect(
    convert(cell('office:value-type="boolean" office:boolean-value="false"'))
      .book.Sheets.Data!.A1.v
  ).toBe(false)
})

test("counts missing saved results without inventing zeroes or retaining formulas", () => {
  const values = [
    "",
    'office:value-type="float"',
    'office:value-type="boolean"',
    'office:value-type="string"',
  ]
    .map((type) => cell(`${type} table:formula="of:=1"`))
    .join("")
  const { book, info } = convert(values, 'table:number-rows-repeated="2"')
  expect(info.missingCaches).toBe(8)
  expect(Object.keys(book.Sheets.Data!)).toEqual(["!ref"])
  expect(
    read(writeXlsx(book), { type: "array" }).Sheets.Data!.A1
  ).toBeUndefined()
})

test("rejects disguised, damaged, encrypted and entity-bearing archives", () => {
  expect(() => readOds(strToU8("not ODS"))).toThrow("unsupported")
  expect(() => readOds(fixture("protected"))).toThrow("protected")
  for (const bytes of [
    zipSync({}),
    zipSync({ mimetype: strToU8("other") }),
    zipSync({ mimetype: original.mimetype! }),
    source("<wrong/>"),
    source(`<office:document-content ${namespace}/>`),
    source(
      `<office:document-content ${namespace}><office:body/></office:document-content>`
    ),
    source(content("")),
    source(content(table("")), {
      "META-INF/manifest.xml": strToU8("<wrong/>"),
    }),
    source(content(table("")), { "styles.xml": strToU8("<wrong/>") }),
  ])
    expect(() => readOds(bytes)).toThrow(/invalid|unsupported/)
  expect(() =>
    readOds(
      source('<!DOCTYPE root [<!ENTITY data "unsafe">]>' + content(table("")))
    )
  ).toThrow("unsupported")
  expect(() => readOds(source("<broken>"))).toThrow(/unclosed tag/)
})

test("rejects cell types, malformed values, illegal repetitions and unrepresentable Excel data", () => {
  const attributes = [
    'office:value-type="unsupported"',
    'office:value-type="float"',
    'office:value-type="boolean"',
    'office:value-type="float" office:value="NaN"',
    'office:value-type="float" office:value="1e999"',
    'office:value-type="float" office:value="0x10"',
    'office:value-type="float" office:value=" "',
    'office:value-type="boolean" office:boolean-value="yes"',
    ...[
      "not a date",
      "1899-12-31",
      "1900-01-01T00:00:00+01:00",
      "9999-12-31T23:59:59-01:00",
      "2026-02-30",
      "2026-10-10T24:00:00",
      "2026-10-10T12:60:00",
      "2026-10-10T12:30:60",
      "2026-10-10T12:30:00+25:00",
    ].map((v) => `office:value-type="date" office:date-value="${v}"`),
    ...["P", "PT", "P1Y"].map(
      (v) => `office:value-type="time" office:time-value="${v}"`
    ),
    'table:number-columns-repeated="0"',
    'table:number-columns-repeated="1.2"',
    'office:value-type="string" table:number-columns-repeated="16385"',
    'table:number-columns-spanned="16385"',
    'table:number-rows-spanned="1048577"',
    'table:number-columns-spanned="2" table:number-columns-repeated="2"',
  ]
  for (const attrs of attributes)
    expect(() => convert(cell(attrs))).toThrow(/invalid|unsupported/)
  expect(() =>
    convert(
      cell(
        'office:value-type="string"',
        "<text:p>" + "x".repeat(32768) + "</text:p>"
      )
    )
  ).toThrow("unsupported")
  expect(() =>
    convert(
      cell('office:value-type="string"'),
      'table:number-rows-repeated="1048577"'
    )
  ).toThrow("unsupported")
  expect(() =>
    convert(
      cell('table:number-rows-spanned="2"'),
      'table:number-rows-repeated="2"'
    )
  ).toThrow("unsupported")
  expect(() =>
    convert(cell('table:number-columns-repeated="9007199254740991"') + cell())
  ).toThrow("invalid")
  expect(() =>
    readOds(
      source(
        content(
          '<table:table table:name="Data"><table:table-row table:number-rows-repeated="9007199254740991"/><table:table-row/></table:table>'
        )
      )
    )
  ).toThrow("invalid")
  for (const name of ["", "History", "'Data", "Data'", "A/B", "A".repeat(32)])
    expect(() => readOds(source(content(table("", "", name))))).toThrow(
      "unsupported"
    )
  expect(() =>
    readOds(source(content(table("", "", "Data") + table("", "", "DATA"))))
  ).toThrow("unsupported")
})

test("preserves hidden style inheritance, respects local overrides, and ignores non-cell content", () => {
  const style = (name: string, parent = "", display?: string) =>
    `<style:style style:name="${name}" style:family="table" style:parent-style-name="${parent}">${display === undefined ? "" : `<style:table-properties table:display="${display}"/>`}</style:style>`
  const table =
    '<table:table table:name="Data" table:style-name="child"><table:table-row-group><table:table-rows><table:table-row>ignored<other:node xmlns:other="example"/></table:table-row></table:table-rows></table:table-row-group></table:table>'
  const xml = content(
    table,
    `<office:automatic-styles>${style("child", "base")}${style("base", "", "true")}<style:style style:family="other"/></office:automatic-styles>`
  )
  expect(readOds(source(xml)).info.sheets[0]!.hidden).toBe(0)
  expect(() =>
    readOds(
      source(
        content(
          table,
          `<office:automatic-styles>${style("child", "base")}${style("base", "child")}</office:automatic-styles>`
        )
      )
    )
  ).toThrow("invalid")
  expect(
    readOds(
      source(
        content(
          table,
          `<office:automatic-styles><style:style style:family="table"/></office:automatic-styles>`
        )
      )
    ).info.sheets[0]!.range
  ).toBeNull()
})

test("does not cap worksheet counts", () => {
  const xml = content(
    Array.from({ length: 1001 }, (_, i) => table("", "", `Sheet${i + 1}`)).join(
      ""
    )
  )
  const { book, info } = readOds(source(xml))
  expect(info.sheets).toHaveLength(1001)
  expect(read(writeXlsx(book), { type: "array" }).SheetNames).toHaveLength(1001)
}, 20000)

test("ignores drawing and comment nodes, allows an unstyled hidden-style parent, and rejects all-hidden workbooks", () => {
  const xml = content(
    `<table:table table:name="Data" table:style-name="plain"><!-- comment --><unknown/><table:table-column/><table:table-row>${cell('office:value-type="string"', "<text:p>safe<unknown>excluded</unknown><text:span/>tail</text:p>")}</table:table-row></table:table>`,
    '<office:automatic-styles><style:style style:name="plain" style:family="table"/></office:automatic-styles>'
  )
  expect(readOds(source(xml)).book.Sheets.Data!.A1.v).toBe("safetail")
  expect(() => readOds(source(content("<table:table/>")))).toThrow(
    "unsupported"
  )
  expect(() =>
    readOds(source(content(table("")), { "styles.xml": strToU8("") }))
  ).toThrow(/document must contain a root element/)
  expect(() =>
    readOds(
      source(
        content(
          '<table:table table:name="Data" table:style-name="hidden"/>',
          '<office:automatic-styles><style:style style:name="hidden" style:family="table"><style:table-properties table:display="false"/></style:style></office:automatic-styles>'
        )
      )
    )
  ).toThrow("unsupported")
})

test("rejects truncated XML, hidden data under merged cells, and recognizes numeric hidden-sheet flags", () => {
  const complete = content(
    table(cell('office:value-type="float" office:value="42"'))
  )
  expect(() => readOds(source(complete.slice(0, -26)))).toThrow(
    /unclosed tag|unexpected end/
  )
  for (const data of [
    'office:value-type="float" office:value="42"',
    'table:formula="of:=1"',
  ])
    expect(() => convert(`<table:covered-table-cell ${data}/>`)).toThrow(
      "unsupported"
    )
  expect(() =>
    readOds(
      source(
        content(
          '<table:table table:name="Data" table:style-name="hidden"/>',
          '<office:automatic-styles><style:style style:name="hidden" style:family="table"><style:table-properties table:display="0"/></style:style></office:automatic-styles>'
        )
      )
    )
  ).toThrow("unsupported")
  expect(
    convert(
      cell(
        'office:value-type="string"',
        "<text:p><![CDATA[<!DOCTYPE is literal text here>]]></text:p>"
      )
    ).book.Sheets.Data!.A1.v
  ).toBe("<!DOCTYPE is literal text here>")
})

test("retains headings and list paragraphs inside cells without importing drawing text", () => {
  const text =
    "<text:section><text:h>Heading</text:h><text:list><text:list-header><text:p>Header</text:p></text:list-header><text:list-item><text:p>One</text:p><text:list><text:list-item><text:p>Nested</text:p></text:list-item></text:list></text:list-item></text:list><text:numbered-paragraph><text:p>Two</text:p></text:numbered-paragraph></text:section>"
  expect(convert(cell("", `\n    ${text}\n`)).book.Sheets.Data!.A1.v).toBe(
    "Heading\nHeader\nOne\nNested\nTwo"
  )
})
