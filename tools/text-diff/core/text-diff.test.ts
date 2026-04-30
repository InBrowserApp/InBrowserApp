import { describe, expect, test } from "vitest"

import { compareText, splitIntoLines } from "./text-diff"

describe("splitIntoLines", () => {
  test("normalizes CRLF line endings", () => {
    expect(splitIntoLines("a\r\nb\rc")).toEqual(["a", "b", "c"])
  })

  test("returns an empty list for blank input", () => {
    expect(splitIntoLines("")).toEqual([])
  })
})

describe("compareText", () => {
  const defaultOptions = {
    ignoreCase: false,
    ignoreWhitespace: false,
  }

  test("builds equal, replace, add, and remove rows with line counts", () => {
    const result = compareText(
      "alpha\nbeta\ngamma\ndelta",
      "alpha\nbeta 2\ngamma\nepsilon",
      defaultOptions
    )

    expect(result.rows.map((row) => row.kind)).toEqual([
      "equal",
      "replace",
      "equal",
      "replace",
    ])
    expect(result.stats).toEqual({
      originalLineCount: 4,
      modifiedLineCount: 4,
      unchanged: 2,
      changed: 2,
      added: 0,
      removed: 0,
    })
    expect(result.rows[1]?.original.tokens).toEqual([
      { kind: "equal", value: "beta" },
    ])
    expect(result.rows[1]?.modified.tokens).toEqual([
      { kind: "equal", value: "beta" },
      { kind: "add", value: " 2" },
    ])
    expect(result.unifiedText).toContain("- beta")
    expect(result.unifiedText).toContain("+ beta 2")
  })

  test("creates pure add and remove rows", () => {
    const addResult = compareText("", "new line", defaultOptions)
    const removeResult = compareText("old line", "", defaultOptions)

    expect(addResult.rows).toHaveLength(1)
    expect(addResult.rows[0]?.kind).toBe("add")
    expect(addResult.rows[0]?.modified.lineNumber).toBe(1)
    expect(removeResult.rows).toHaveLength(1)
    expect(removeResult.rows[0]?.kind).toBe("remove")
    expect(removeResult.rows[0]?.original.lineNumber).toBe(1)
  })

  test("treats whitespace-only and case-only changes as equal when requested", () => {
    const result = compareText(
      "Hello world\nconst  value = 1",
      "hello world\nconst value=1",
      {
        ignoreCase: true,
        ignoreWhitespace: true,
      }
    )

    expect(result.rows.map((row) => row.kind)).toEqual(["equal", "equal"])
    expect(result.stats.changed).toBe(0)
  })

  test("keeps non-empty fallback tokens when inline diff only changes one side", () => {
    const result = compareText("keep", "keep plus", defaultOptions)
    const changedRow = result.rows[0]

    expect(changedRow?.kind).toBe("replace")
    expect(changedRow?.original.tokens).toEqual([
      { kind: "equal", value: "keep" },
    ])
    expect(changedRow?.modified.tokens).toEqual([
      { kind: "equal", value: "keep" },
      { kind: "add", value: " plus" },
    ])
  })

  test("keeps token arrays empty when a replaced line starts empty", () => {
    const result = compareText("\nnext", "filled\nnext", defaultOptions)
    const changedRow = result.rows[0]

    expect(changedRow?.kind).toBe("replace")
    expect(changedRow?.original.text).toBe("")
    expect(changedRow?.original.tokens).toEqual([])
    expect(changedRow?.modified.tokens).toEqual([
      { kind: "add", value: "filled" },
    ])
  })

  test("keeps token arrays empty when a replaced line ends empty", () => {
    const result = compareText("filled\nnext", "\nnext", defaultOptions)
    const changedRow = result.rows[0]

    expect(changedRow?.kind).toBe("replace")
    expect(changedRow?.modified.text).toBe("")
    expect(changedRow?.original.tokens).toEqual([
      { kind: "remove", value: "filled" },
    ])
    expect(changedRow?.modified.tokens).toEqual([])
  })
})
