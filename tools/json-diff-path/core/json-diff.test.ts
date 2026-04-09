import { describe, expect, test, vi } from "vitest"

import {
  diffJsonValues,
  parseJsonWithError,
  toJsonPatch,
  type JsonDiffEntry,
} from "./json-diff"

describe("parseJsonWithError", () => {
  test("parses valid JSON", () => {
    expect(parseJsonWithError('{"name":"demo"}')).toEqual({
      value: { name: "demo" },
    })
  })

  test("returns an empty result for blank input", () => {
    expect(parseJsonWithError("   ")).toEqual({})
  })

  test("extracts line and column when parse errors include a position", () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, "parse")
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === "__position__") {
          throw new SyntaxError("Unexpected token at position 8")
        }

        return originalParse(...args)
      })

    expect(parseJsonWithError("__position__")).toEqual({
      error: {
        message: "Unexpected token at position 8",
        line: 1,
        column: 9,
      },
    })

    parseSpy.mockRestore()
  })

  test("calculates line and column with newline-aware positions", () => {
    const input = "x\ny"
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, "parse")
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === input) {
          throw new SyntaxError("Unexpected token at position 2")
        }

        return originalParse(...args)
      })

    expect(parseJsonWithError(input)).toEqual({
      error: {
        message: "Unexpected token at position 2",
        line: 2,
        column: 1,
      },
    })

    parseSpy.mockRestore()
  })

  test("handles parse failures without a position", () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, "parse")
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === "__message__") {
          throw new SyntaxError("Bad json")
        }

        return originalParse(...args)
      })

    expect(parseJsonWithError("__message__")).toEqual({
      error: {
        message: "Bad json",
      },
    })

    parseSpy.mockRestore()
  })

  test("handles non-Error parse exceptions", () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, "parse")
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === "__boom__") {
          throw "boom"
        }

        return originalParse(...args)
      })

    expect(parseJsonWithError("__boom__")).toEqual({
      error: {
        message: "boom",
      },
    })

    parseSpy.mockRestore()
  })
})

describe("diffJsonValues", () => {
  test("creates add, remove, and replace entries for nested objects and arrays", () => {
    const original = {
      user: { name: "Alice", age: 20, "a/b": 1, "t~s": 2 },
      tags: ["a", "b"],
    }
    const modified = {
      user: { name: "Alice Chen", "a/b": 1, "t~s": 3, "a.b": 9 },
      tags: ["a"],
      active: true,
    }

    expect(diffJsonValues(original, modified)).toEqual(
      expect.arrayContaining<JsonDiffEntry>([
        expect.objectContaining({
          op: "add",
          jsonPath: "$.active",
          jsonPointer: "/active",
        }),
        expect.objectContaining({
          op: "remove",
          jsonPath: "$.tags[1]",
          jsonPointer: "/tags/1",
        }),
        expect.objectContaining({
          op: "replace",
          jsonPath: "$.user.name",
          jsonPointer: "/user/name",
        }),
        expect.objectContaining({
          op: "remove",
          jsonPath: "$.user.age",
          jsonPointer: "/user/age",
        }),
        expect.objectContaining({
          op: "add",
          jsonPath: '$.user["a.b"]',
          jsonPointer: "/user/a.b",
        }),
        expect.objectContaining({
          op: "replace",
          jsonPath: '$.user["t~s"]',
          jsonPointer: "/user/t~0s",
        }),
      ])
    )
  })

  test("replaces the root when primitive values differ", () => {
    expect(diffJsonValues(1, 2)).toEqual([
      {
        op: "replace",
        jsonPath: "$",
        jsonPointer: "",
        oldValue: 1,
        newValue: 2,
      },
    ])
  })

  test("returns an empty diff for identical values", () => {
    expect(diffJsonValues({ ok: true }, { ok: true })).toEqual([])
  })
})

describe("toJsonPatch", () => {
  test("converts diff entries to RFC 6902 patch operations", () => {
    expect(
      toJsonPatch([
        {
          op: "add",
          jsonPath: "$.a",
          jsonPointer: "/a",
          newValue: 1,
        },
        {
          op: "remove",
          jsonPath: "$.b",
          jsonPointer: "/b",
          oldValue: 1,
        },
        {
          op: "replace",
          jsonPath: "$.c",
          jsonPointer: "/c",
          oldValue: 1,
          newValue: 2,
        },
      ])
    ).toEqual([
      { op: "add", path: "/a", value: 1 },
      { op: "remove", path: "/b" },
      { op: "replace", path: "/c", value: 2 },
    ])
  })

  test("orders array removals from highest to lowest index", () => {
    expect(toJsonPatch(diffJsonValues([1, 2, 3], []))).toEqual([
      { op: "remove", path: "/2" },
      { op: "remove", path: "/1" },
      { op: "remove", path: "/0" },
    ])
  })

  test("keeps replace operations while reordering following array removals", () => {
    expect(toJsonPatch(diffJsonValues([1, 2, 3], [4]))).toEqual([
      { op: "replace", path: "/0", value: 4 },
      { op: "remove", path: "/2" },
      { op: "remove", path: "/1" },
    ])
  })

  test("leaves a single array removal in place", () => {
    expect(toJsonPatch(diffJsonValues([1], []))).toEqual([
      { op: "remove", path: "/0" },
    ])
  })

  test("orders nested array removals by descending index", () => {
    expect(
      toJsonPatch(diffJsonValues({ items: [1, 2, 3] }, { items: [] }))
    ).toEqual([
      { op: "remove", path: "/items/2" },
      { op: "remove", path: "/items/1" },
      { op: "remove", path: "/items/0" },
    ])
  })

  test("keeps remove operations with non-pointer paths unchanged", () => {
    expect(
      toJsonPatch([
        {
          op: "remove",
          jsonPath: "$.value",
          jsonPointer: "value",
          oldValue: 1,
        },
      ])
    ).toEqual([{ op: "remove", path: "value" }])
  })
})
