import initSqlJs from "sql.js"
import { beforeAll, expect, test } from "vitest"
import { utils, write } from "xlsx"
import { createDatabase } from "./database"
import { columnNames, uniqueNames } from "./names"
import { readSpreadsheet } from "./spreadsheet"

let SQL: Awaited<ReturnType<typeof initSqlJs>>

beforeAll(async () => {
  SQL = await initSqlJs()
})

const encode = (text: string) => new TextEncoder().encode(text)

test("turns multiple CSV and Excel sheets into a real queryable database", () => {
  const workbook = utils.book_new()
  utils.book_append_sheet(
    workbook,
    utils.aoa_to_sheet([
      ["id", "name"],
      [1, "Ana"],
      [2, "Ken"],
    ]),
    "customers"
  )
  utils.book_append_sheet(
    workbook,
    utils.aoa_to_sheet(
      [
        ["code", "active", "date"],
        ["0012", true, new Date("2024-05-04T00:00:00Z")],
      ],
      { UTC: true }
    ),
    "notes"
  )
  const sources = [
    ...readSpreadsheet(
      encode(
        "id,customer_id,total,reference\n11,1,12.25,0012\n12,1,8.75,0013\n13,2,,0014"
      ),
      "orders.csv"
    ),
    ...readSpreadsheet(
      new Uint8Array(write(workbook, { type: "array", bookType: "xlsx" })),
      "records.xlsx"
    ),
  ]

  const db = new SQL.Database(
    createDatabase(
      SQL,
      sources.map((source) => ({
        ...source,
        name: source.label,
        width: source.rows[0]!.length,
        header: true,
      }))
    )
  )
  expect(
    db.exec(`
    SELECT customers.name, SUM(total)
    FROM orders JOIN customers ON customers.id = orders.customer_id
    GROUP BY customers.name ORDER BY customers.name
  `)[0]?.values
  ).toEqual([
    ["Ana", 21],
    ["Ken", null],
  ])
  expect(
    db.exec("SELECT reference, typeof(reference) FROM orders LIMIT 1")[0]
      ?.values
  ).toEqual([["0012", "text"]])
  expect(db.exec("SELECT * FROM notes")[0]?.values).toEqual([
    ["0012", 1, "2024-05-04T00:00:00.000Z"],
  ])
  db.close()
})

test("imports legacy Excel, formula errors and mixed column values without dropping records", () => {
  const workbook = utils.book_new()
  const sheet = utils.aoa_to_sheet([
    ["data"],
    [1],
    [],
    [1234567890123456],
    [1e-9],
    ["text"],
  ])
  sheet.A3 = { t: "e", v: 7, f: "1/0" }
  utils.book_append_sheet(workbook, sheet, "Values")
  for (const bookType of ["xls", "xlsx"] as const) {
    const bytes = new Uint8Array(write(workbook, { type: "array", bookType }))
    const [table] = readSpreadsheet(bytes, `values.${bookType}`)
    const db = new SQL.Database(
      createDatabase(SQL, [
        { ...table!, name: "Values", width: 1, header: true },
      ])
    )
    expect(db.exec('SELECT * FROM "Values" ORDER BY rowid')[0]?.values).toEqual(
      [["1"], ["#DIV/0!"], ["1234567890123456"], ["1e-9"], ["text"]]
    )
    db.close()
  }
})

test("preserves quoted delimiters, padding, NULL and the first row in headerless files", () => {
  const [source] = readSpreadsheet(
    encode('sep=;\n"north;south";001;12345678901234567\n"two\nlines"'),
    "regions.csv"
  )
  const db = new SQL.Database(
    createDatabase(SQL, [
      { ...source!, name: 'Geo "regions"', width: 3, header: false },
    ])
  )
  expect(db.exec('SELECT * FROM "Geo ""regions"""')).toEqual([
    {
      columns: ["column_1", "column_2", "column_3"],
      values: [
        ["north;south", "001", "12345678901234567"],
        ["two\nlines", null, null],
      ],
    },
  ])
  db.close()
})

test("keeps names usable for duplicate files, SQL identifiers and missing headers", () => {
  expect(
    uniqueNames(["data", "DATA", "sqlite_master", " ", "data_2"], true)
  ).toEqual(["data", "DATA_2", "table_sqlite_master", "data_3", "data_2_2"])
  expect(columnNames([[0, null, "name", "Name"]], 5, true)).toEqual([
    "0",
    "column_2",
    "name",
    "Name_2",
    "column_5",
  ])
})

test("detects a UTF-16 BOM and rejects unreadable input instead of fabricating a table", () => {
  expect(
    readSpreadsheet(
      new Uint8Array([255, 254, 97, 0, 10, 0, 49, 0]),
      "bom.csv"
    )[0]?.rows
  ).toEqual([["a"], ["1"]])
  expect(
    readSpreadsheet(
      new Uint8Array([254, 255, 0, 97, 0, 10, 0, 49]),
      "bom.csv"
    )[0]?.rows
  ).toEqual([["a"], ["1"]])
  expect(() =>
    readSpreadsheet(encode('name\n"unterminated'), "bad.csv")
  ).toThrow("Invalid CSV")
  expect(() => readSpreadsheet(encode("data"), "wrong.xlsx")).toThrow(
    "Invalid Excel workbook"
  )
  expect(() => readSpreadsheet(encode("data"), "wrong.txt")).toThrow(
    "Unsupported file"
  )
})
