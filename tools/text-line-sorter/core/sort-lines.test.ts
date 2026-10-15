import { describe, expect, test } from "vitest"
import { DEFAULT_OPTIONS, sortLines } from "./sort-lines"

const sort = (input: string, options = {}) =>
  sortLines(input, { ...DEFAULT_OPTIONS, ...options })

describe("sortLines", () => {
  test("sorts deterministically by UTF-16 code units and retains duplicates", () => {
    expect(sort("b\na\nb\n10\n2\nA\né\n😀")).toBe("10\n2\nA\na\nb\nb\né\n😀")
    expect(sort("a\nc\nb\nb", { descending: true })).toBe("c\nb\nb\na")
  })

  test("keeps equal case-folded keys stable in both directions", () => {
    expect(sort("b\nA\na\nB", { ignoreCase: true })).toBe("A\na\nb\nB")
    expect(sort("b\nA\na\nB", { ignoreCase: true, descending: true })).toBe(
      "b\nB\nA\na"
    )
  })

  test("normalizes line endings and preserves a trailing blank line", () => {
    expect(sort("c\rb\r\na\n")).toBe("\na\nb\nc")
    expect(sort("\n\na\n")).toBe("\n\n\na")
    expect(sort("")).toBe("")
  })

  test("preserves spaces by default and optionally trims every line", () => {
    expect(sort(" z \na\n\t")).toBe("\t\n z \na")
    expect(sort(" z \na\n\t", { trim: true })).toBe("\na\nz")
  })

  test("removes whitespace-only lines without trimming retained lines", () => {
    expect(sort(" b \n\t\n\n a \n", { removeBlank: true })).toBe(" a \n b ")
    expect(sort("\n \n\t", { removeBlank: true })).toBe("")
  })

  test("deduplicates exact lines by default, including blank lines", () => {
    expect(sort("a\nA\na\n\n", { deduplicate: true })).toBe("\nA\na")
  })

  test("applies trim and case folding before deduplicating, keeping the first", () => {
    expect(
      sort(" b \nA\n a \nB\n\t", {
        trim: true,
        ignoreCase: true,
        removeBlank: true,
        deduplicate: true,
      })
    ).toBe("A\nb")
  })
})
