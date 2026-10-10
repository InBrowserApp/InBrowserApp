import { CFB, read, SSF, utils } from "xlsx"
import type { ParsingOptions, WorkBook } from "xlsx"
import { describe } from "@workspace/spreadsheet-conversion"

type Source = { sheet: string; table: string }

export function worksheetName(source: string, used: Set<string>) {
  const clean =
    Array.from(source, (character) =>
      character < " " || "\\/:*?[]".includes(character) ? "_" : character
    )
      .join("")
      .trim()
      .replace(/^'+|'+$/g, "")
      .trim() || "Table"
  const truncate = (value: string, length: number) => {
    let result = ""
    for (const character of value) {
      if (result.length + character.length > length) break
      result += character
    }
    return result
  }
  let name = truncate(clean, 31).trimEnd().replace(/'+$/g, "").trimEnd()
  let index = 2
  while (used.has(name.toLowerCase())) {
    const suffix = ` (${index++})`
    name = truncate(clean, 31 - suffix.length) + suffix
  }
  used.add(name.toLowerCase())
  return name
}

export function readNumbers(bytes: Uint8Array) {
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error("unsupported")
  const archive = CFB.read(bytes, { type: "buffer" })
  if (archive.FullPaths.some((path: string) => /\.iwpv2(?:$|\/)/i.test(path)))
    throw new Error("protected")
  if (
    !archive.FullPaths.some((path: string) =>
      path.endsWith("/Index/Document.iwa")
    )
  )
    throw new Error("unsupported")
  const options: ParsingOptions & { numbersNames: boolean } = {
    type: "array",
    numbersNames: true,
    cellDates: false,
    cellNF: true,
    cellHTML: false,
    WTF: true,
  }
  const book = read(bytes, options)
  if (book.bookType !== "numbers") throw new Error("unsupported")
  return book
}

export function prepare(book: WorkBook) {
  const used = new Set<string>()
  const sources: Source[] = []
  const sheets: WorkBook["Sheets"] = Object.create(null)
  const names = book.SheetNames.map((key) => {
    const sheet = book.Sheets[key]!
    const source: Source | undefined = sheet["!numbers"]
    if (!source) throw new Error("unsupported")
    const bounds = utils.decode_range(sheet["!ref"] ?? "A1")
    if (bounds.e.r >= 1048576 || bounds.e.c >= 16384)
      throw new Error("unsupported")
    sources.push(source)
    const name = worksheetName(`${source.sheet} - ${source.table}`, used)
    for (const [address, cell] of Object.entries(sheet)) {
      if (address.startsWith("!")) continue
      if (cell.t === "s" && String(cell.v).length > 32767)
        throw new Error("unsupported")
      delete cell.f
      delete cell.F
      delete cell.l
      delete cell.c
      delete cell.w
      if (cell.t === "e") cell.v = 15
      if (cell.t === "n" && !Number.isFinite(cell.v))
        throw new Error("unsupported")
      if (cell.t === "n" && cell.numbersType === 7) cell.z = "0.###############"
      if (cell.t === "n" && cell.numbersType === 5) {
        cell.z = "yyyy-mm-dd hh:mm:ss"
        cell.w = SSF.format(cell.z, cell.v as number, {
          date1904: Boolean(book.Workbook?.WBProps?.date1904),
        })
      }
    }
    sheets[name] = sheet
    return name
  })
  book.SheetNames = names
  book.Sheets = sheets
  const info = describe(book)
  info.sheets.forEach((sheet, index) => {
    sheet.source = sources[index]!
  })
  return info
}
