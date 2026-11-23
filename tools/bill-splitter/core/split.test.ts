import { describe, expect, it } from "vitest"

import { parseDecimal, parsePeople, splitBill } from "./split"

describe("bill split inputs", () => {
  it("parses whole numbers, decimal separators and localized digits exactly", () => {
    expect(parseDecimal(" 12 ", 2)).toBe(1200n)
    expect(parseDecimal("12.", 2)).toBe(1200n)
    expect(parseDecimal(",5", 2)).toBe(50n)
    expect(parseDecimal("١٢٫٣٤", 2)).toBe(1234n)
    expect(parseDecimal("１２．３４", 2)).toBe(1234n)
    expect(parseDecimal("०.१२५", 3)).toBe(125n)
    expect(parseDecimal("999999999999.99", 2)).toBe(99999999999999n)
  })

  it.each([
    "",
    ".",
    "-1",
    "1e2",
    "1 000",
    "1,000.00",
    "1.001",
    "1000000000000",
  ])("rejects an invalid amount %j", (value) =>
    expect(parseDecimal(value, 2)).toBeNull()
  )

  it("accepts whole participant counts between 2 and 100", () => {
    expect(parsePeople(" ๓ ")).toBe(3)
    expect(parsePeople("2")).toBe(2)
    expect(parsePeople("100")).toBe(100)
    for (const value of ["", "1", "101", "2.5", "12e1"]) {
      expect(parsePeople(value)).toBeNull()
    }
  })
})

describe("splitting a bill in hundredths", () => {
  it("splits a bill equally and assigns extra hundredths in list order", () => {
    expect(splitBill(10000n, "equal", ["", "", ""])).toEqual({
      amounts: [3334n, 3333n, 3333n],
    })
    expect(splitBill(1n, "equal", ["", "", ""])).toEqual({
      amounts: [1n, 0n, 0n],
    })
  })

  it("preserves fixed amounts including zero and splits the balance", () => {
    expect(splitBill(10001n, "fixed", ["20.00", "", "0", " "])).toEqual({
      amounts: [2000n, 4001n, 0n, 4000n],
    })
    expect(splitBill(10000n, "fixed", ["20", "40", "40"])).toEqual({
      amounts: [2000n, 4000n, 4000n],
    })
    expect(splitBill(10000n, "fixed", ["100", ""])).toEqual({
      amounts: [10000n, 0n],
    })
  })

  it("reports invalid or incomplete fixed amounts", () => {
    expect(splitBill(10000n, "fixed", ["", "-5"])).toEqual({
      error: "fixedError",
      index: 1,
    })
    expect(splitBill(10000n, "fixed", ["51", "50"])).toEqual({
      error: "fixedOver",
    })
    expect(splitBill(10000n, "fixed", ["49", "50"])).toEqual({
      error: "fixedShort",
    })
  })

  it("uses fractional weights, distributes by largest remainder and honors zero weight", () => {
    expect(splitBill(10000n, "weighted", ["2", "1", "1"])).toEqual({
      amounts: [5000n, 2500n, 2500n],
    })
    expect(splitBill(4n, "weighted", ["0.125", "0.250", "0.375", "0"])).toEqual(
      {
        amounts: [1n, 1n, 2n, 0n],
      }
    )
    expect(
      splitBill(99999999999999n, "weighted", ["999999999999.999", "0"])
    ).toEqual({
      amounts: [99999999999999n, 0n],
    })
  })

  it("reports invalid or all-zero ratio weights", () => {
    expect(splitBill(10000n, "weighted", ["1", ""])).toEqual({
      error: "weightError",
      index: 1,
    })
    expect(splitBill(10000n, "weighted", ["0", "0"])).toEqual({
      error: "zeroWeights",
    })
  })
})
