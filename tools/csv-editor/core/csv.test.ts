import { describe, expect, it } from "vitest"
import { encodeCsv, parseCsv, readCsv, serializeCsv } from "./csv"

describe("reading delimited text", () => {
  it.each([
    [",", "\n", "csv"],
    [";", "\r\n", "csv"],
    ["|", "\r", "csv"],
    ["\t", "\n", "tsv"],
  ])(
    "detects %j and %j while retaining blank and short records",
    (delimiter, newline, extension) => {
      const text = [
        ["Name", "Stock"].join(delimiter),
        ["First", "007"].join(delimiter),
        "",
        "Short",
        ["Last", "-12.5"].join(delimiter),
        "",
      ].join(newline)
      const document = parseCsv(text)
      expect(document.format).toMatchObject({
        delimiter,
        linebreak: newline,
        extension,
        finalLinebreak: true,
      })
      expect(document.rows).toEqual([
        ["Name", "Stock"],
        ["First", "007"],
        [""],
        ["Short"],
        ["Last", "-12.5"],
      ])
      expect(
        parseCsv(serializeCsv(document.rows, [0, 1], document.format)).rows
      ).toEqual(document.rows)
    }
  )

  it("honors the filename and a case-insensitive Excel separator directive", () => {
    expect(parseCsv("a,b\nc,d", "sample.tsv").rows).toEqual([["a,b"], ["c,d"]])
    expect(parseCsv("a\tb\nc\td", "sample.csv").format.extension).toBe("csv")
    const source = "SEP=;\r\nName;Stock\r\nPen;1"
    const document = parseCsv(source, "some.csv")
    expect(document.rows).toEqual([
      ["Name", "Stock"],
      ["Pen", "1"],
    ])
    expect(serializeCsv(document.rows, [0, 1], document.format)).toBe(source)
  })

  it("normalizes mixed record boundaries while preserving embedded line breaks", () => {
    const document = parseCsv('A,B\r\nx,"one\n""two""\rthree"\ny,2\rz,3\r\n')
    expect(document.rows).toEqual([
      ["A", "B"],
      ["x", 'one\n"two"\rthree'],
      ["y", "2"],
      ["z", "3"],
    ])
    expect(serializeCsv(document.rows, [0, 1], document.format)).toBe(
      'A,B\r\nx,"one\n""two""\rthree"\r\ny,2\r\nz,3\r\n'
    )
  })

  it("prefers the fuller dialect and quotes literal alternate delimiters on export", () => {
    const document = parseCsv(
      "City, region;Amount;Date\nParis, France;1;2026\nLondon, England;2;2026"
    )
    expect(document.format.delimiter).toBe(";")
    const output = serializeCsv(document.rows, [0, 1, 2], document.format)
    expect(output).toContain('"Paris, France";1;2026')
    expect(parseCsv(output)).toEqual(document)
    expect(parseCsv("a,b;c\nd,e;f").format.delimiter).toBe(",")
  })

  it("uses a single column for text with no delimiter", () => {
    expect(parseCsv("001").rows).toEqual([["001"]])
    expect(parseCsv('""').rows).toEqual([[""]])
  })

  it.each(["", "\uFEFF", "sep=;\n"])("rejects missing data %j", (text) => {
    expect(() => parseCsv(text)).toThrow("empty")
  })

  it.each(["a\0b", 'A,B\nx,"unclosed'])("rejects invalid data %j", (text) => {
    expect(() => parseCsv(text)).toThrow("invalid")
  })

  it.each(["utf-8", "utf-16le", "utf-16be"] as const)(
    "round trips %s with a BOM and Unicode text",
    (encoding) => {
      const source = "Name\tValue\r\n咖啡\t🥤\r\n"
      const format = { ...parseCsv(source).format, bom: true, encoding }
      const bytes = encodeCsv(source, format)
      const parsed = readCsv(bytes, "example.tsv")
      expect(parsed.format).toEqual(format)
      expect(parsed.rows).toEqual([
        ["Name", "Value"],
        ["咖啡", "🥤"],
      ])
      expect(
        encodeCsv(
          serializeCsv(parsed.rows, [0, 1], parsed.format),
          parsed.format
        )
      ).toEqual(bytes)
    }
  )

  it("preserves absence of a BOM and rejects invalid UTF-8", () => {
    const bytes = new TextEncoder().encode("value\né")
    const document = readCsv(bytes, "example.csv")
    expect(document.format.bom).toBe(false)
    expect(
      encodeCsv(
        serializeCsv(document.rows, [0], document.format),
        document.format
      )
    ).toEqual(bytes)
    expect(() => readCsv(new Uint8Array([0xc3, 0x28]), "bad.csv")).toThrow(
      TypeError
    )
  })
})

describe("writing edited data", () => {
  it("reorders fields, retaining explicit empties, quoting, and newlines", () => {
    const { format } = parseCsv("Name,Note,SKU\nPen,,0007\nMissing\n")
    const output = serializeCsv(
      [
        ["Name", "Note", "SKU"],
        ["Pen", ' ", " \n', "0007"],
        ["Missing"],
        ["Blank", ""],
      ],
      [2, 0, 1],
      format
    )
    expect(output).toBe(
      'SKU,Name,Note\n0007,Pen," "", "" \n"\n,Missing\n,Blank,\n'
    )
    expect(parseCsv(output).rows[1]).toEqual(["0007", "Pen", ' ", " \n'])
    expect(serializeCsv([], [2, 0, 1], format)).toBe("")
    expect(
      serializeCsv([[" leading "]], [0], { ...format, finalLinebreak: false })
    ).toBe('" leading "')
  })

  it("quotes a first literal separator directive and preserves a leading BOM character in a value", () => {
    const { rows, format } = parseCsv('"sep=;"\nx,y')
    expect(serializeCsv(rows, [0, 1], format)).toBe('"sep=;"\nx,y')
    expect(serializeCsv([["normal"], ["sep=;"]], [0], format)).toBe(
      'normal\n"sep=;"'
    )
    expect(serializeCsv([["\uFEFFvalue", "x"]], [0, 1], format)).toBe(
      '"\uFEFFvalue",x'
    )
  })
})
