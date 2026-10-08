import { expect, test } from "vitest"
import type { Cell, Row } from "@silurus/ooxml/xlsx"
import { cellDetails, cellReference, isCellReference } from "./cells"

test("formats Excel coordinates and validates worksheet bounds", () => {
  expect(cellReference({ row: 1, col: 1 })).toBe("A1")
  expect(cellReference({ row: 2, col: 27 })).toBe("AA2")
  expect(cellReference({ row: 1048576, col: 16384 })).toBe("XFD1048576")
  for (const value of ["A1", "aa20", "XFD1048576"])
    expect(isCellReference(value)).toBe(true)
  for (const value of [
    "",
    "A0",
    "A-1",
    "A1:B2",
    "AAAA1",
    "XFE1",
    "XFD1048577",
    "ZZZ1",
  ])
    expect(isCellReference(value)).toBe(false)
})
test("distinguishes cached formula results, missing caches, and blank cells", () => {
  const cells: Cell[] = [
    { row: 1, col: 1, value: { type: "text", text: "hello" } },
    { row: 1, col: 2, value: { type: "empty" }, formula: "SUM(A1:A2)" },
    {
      row: 1,
      col: 3,
      value: { type: "number", number: 0 },
      formula: "SUM(A1:A2)",
    },
    {
      row: 1,
      col: 4,
      value: { type: "text", text: "" },
      formula: 'IF(A1=1,"","")',
    },
    { row: 1, col: 5, value: { type: "empty" } },
  ]
  const rows: Row[] = [
    { index: 1, height: 20, cells },
    { index: 2, height: 20, cells: [] },
  ]
  const display = (cell: Cell) =>
    cell.value.type === "number"
      ? "$0.00"
      : cell.value.type === "text"
        ? cell.value.text
        : ""
  expect(
    cellDetails({ rows, mergeCells: [] }, { row: 1, col: 1 }, display)
  ).toEqual({
    reference: "A1",
    value: "hello",
    formula: "",
    noCachedValue: false,
  })
  expect(
    cellDetails({ rows, mergeCells: [] }, { row: 1, col: 2 }, display)
  ).toEqual({
    reference: "B1",
    value: "",
    formula: "=SUM(A1:A2)",
    noCachedValue: true,
  })
  expect(
    cellDetails({ rows, mergeCells: [] }, { row: 1, col: 3 }, display)
  ).toEqual({
    reference: "C1",
    value: "$0.00",
    formula: "=SUM(A1:A2)",
    noCachedValue: false,
  })
  expect(
    cellDetails({ rows, mergeCells: [] }, { row: 1, col: 4 }, display)
      .noCachedValue
  ).toBe(false)
  expect(
    cellDetails({ rows, mergeCells: [] }, { row: 1, col: 5 }, display)
      .noCachedValue
  ).toBe(false)
  for (const address of [
    { row: 1, col: 6 },
    { row: 2, col: 1 },
    { row: 3, col: 1 },
  ])
    expect(cellDetails({ rows, mergeCells: [] }, address, display)).toEqual({
      reference: cellReference(address),
      value: "",
      formula: "",
      noCachedValue: false,
    })
})

test("reads the anchor value of merged cells and preserves adjacent cells", () => {
  const sheet = {
    rows: [
      {
        index: 2,
        height: 20,
        cells: [
          { row: 2, col: 2, value: { type: "text" as const, text: "Merged" } },
        ],
      },
    ],
    mergeCells: [{ top: 2, bottom: 3, left: 2, right: 3 }],
  }
  expect(cellDetails(sheet, { row: 3, col: 3 }, () => "Merged")).toEqual({
    reference: "B2",
    value: "Merged",
    formula: "",
    noCachedValue: false,
  })
  for (const address of [
    { row: 1, col: 2 },
    { row: 4, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 4 },
  ])
    expect(cellDetails(sheet, address, () => "Merged").value).toBe("")
})
