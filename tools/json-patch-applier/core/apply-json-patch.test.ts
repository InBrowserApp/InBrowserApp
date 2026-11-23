import { stringify } from "lossless-json"
import { describe, expect, test, vi } from "vitest"
import { applyJsonPatch } from "./apply-json-patch"

vi.mock("lossless-json", { spy: true })

function apply(original: unknown, patch: unknown) {
  return applyJsonPatch(JSON.stringify(original), JSON.stringify(patch))
}

function preview(original: unknown, patch: unknown) {
  const result = apply(original, patch)
  if (result.kind !== "success" || result.text === undefined) {
    throw new Error(JSON.stringify(result))
  }
  return JSON.parse(result.text)
}

describe("applyJsonPatch", () => {
  test("applies all six operations in order and copies independently", () => {
    expect(
      preview({ tags: ["api", "draft", "v1"], info: { active: false } }, [
        { op: "test", path: "/info", value: { active: false } },
        { op: "move", from: "/tags/0", path: "/tags/2" },
        { op: "add", path: "/tags/1", value: "beta" },
        { op: "replace", path: "/tags/0", value: "release" },
        { op: "remove", path: "/tags/2" },
        { op: "add", path: "/tags/-", value: 7, extra: true },
        { op: "copy", from: "/info", path: "/backup" },
        { op: "replace", path: "/info/active", value: true },
        { op: "remove", path: "/backup/active" },
        { op: "add", path: "/info", value: null },
      ])
    ).toEqual({ tags: ["release", "beta", "api", 7], info: null, backup: {} })
  })

  test("copies array contents and permits copying the root into a child", () => {
    expect(
      preview({ values: [1] }, [
        { op: "copy", from: "", path: "/copy" },
        { op: "add", path: "/values/-", value: 2 },
      ])
    ).toEqual({ values: [1, 2], copy: { values: [1] } })
  })

  test("addresses empty and escaped tokens and protects inherited members", () => {
    const original =
      '{"":0,"a/b":{"~1":2},"__proto__":{"private":3},"constructor":4}'
    const patch = [
      { op: "replace", path: "/", value: 1 },
      { op: "replace", path: "/a~1b/~01", value: 5 },
      { op: "test", path: "/__proto__/private", value: 3 },
      { op: "add", path: "/__proto__", value: {} },
      { op: "replace", path: "/constructor", value: 6 },
    ]
    const result = applyJsonPatch(original, JSON.stringify(patch))
    expect(result).toMatchObject({ kind: "success" })
    expect(result.kind === "success" && JSON.parse(result.text!)).toEqual(
      JSON.parse('{"":1,"a/b":{"~1":5},"__proto__":{},"constructor":6}')
    )
    expect(
      apply({}, [{ op: "add", path: "/__proto__/polluted", value: true }])
    ).toMatchObject({ kind: "operationError", reason: "missingPath" })
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false)
  })

  test("handles empty patches and root replacement, removal, and restoration", () => {
    expect(preview(false, [])).toBe(false)
    expect(preview({ x: 2 }, [{ op: "move", path: "", from: "/x" }])).toBe(2)
    expect(preview(["a"], [{ op: "move", path: "", from: "" }])).toEqual(["a"])
    expect(preview(null, [{ op: "replace", path: "", value: "" }])).toBe("")
    expect(apply(null, [{ op: "remove", path: "" }])).toEqual({
      kind: "success",
      text: undefined,
    })
    expect(
      preview(1, [
        { op: "remove", path: "" },
        { op: "add", path: "", value: ["new root"] },
      ])
    ).toEqual(["new root"])
  })

  test("compares JSON structurally and preserves exact numbers in output", () => {
    const original =
      '{"b":[null,true,9007199254740993,-0,1e9007199254740993],"a":"same"}'
    const patch =
      '[{"op":"test","path":"","value":{"a":"same","b":[null,true,9007199254740993.0,0.000,10e9007199254740992]}}]'
    const result = applyJsonPatch(original, patch)
    expect(result).toMatchObject({ kind: "success" })
    expect(result.kind === "success" && result.text).toContain(
      "9007199254740993,"
    )
    expect(result.kind === "success" && result.text).toContain(
      "1e9007199254740993"
    )
    expect(
      applyJsonPatch(
        "9007199254740993",
        '[{"op":"test","path":"","value":9007199254740992}]'
      )
    ).toMatchObject({ kind: "operationError", reason: "testFailed" })
    expect(preview(0.012, [{ op: "test", path: "", value: 0.012 }])).toBe(0.012)
  })

  test("treats equivalent negative decimals as equal", () => {
    expect(
      applyJsonPatch("-0.012", '[{"op":"test","path":"","value":-12e-3}]')
    ).toEqual({ kind: "success", text: "-0.012" })
  })

  test("reports exhausted formatter capacity and propagates unexpected errors", () => {
    const formatter = vi.mocked(stringify)
    try {
      formatter.mockImplementationOnce(() => {
        throw new RangeError("Invalid string length")
      })
      expect(applyJsonPatch("[]", "[]")).toEqual({
        kind: "error",
        reason: "documentTooComplex",
      })
      formatter.mockImplementationOnce(() => {
        throw new TypeError("Unexpected formatter error")
      })
      expect(() => applyJsonPatch("[]", "[]")).toThrow(
        "Unexpected formatter error"
      )
    } finally {
      formatter.mockReset()
    }
  })

  test("reports repeated op or path fields at the affected operation", () => {
    const original = '{"status":"draft"}'
    const duplicateOp =
      '[{"op":"test","path":"/status","value":"draft"},{"op":"add","op":"add","path":"/tag","value":"api"}]'
    const duplicatePath = String.raw`[{"op":"add","path":"/tag","p\u0061th":"/status","value":"api"}]`
    expect(applyJsonPatch(original, duplicateOp)).toMatchObject({
      kind: "operationError",
      number: 2,
      reason: "duplicateOperationField",
    })
    expect(applyJsonPatch(original, duplicatePath)).toMatchObject({
      kind: "operationError",
      number: 1,
      reason: "duplicateOperationField",
    })
    expect(
      applyJsonPatch(
        original,
        '[{"op":"test","path":"/missing","value":0},' + duplicatePath.slice(1)
      )
    ).toMatchObject({
      kind: "operationError",
      number: 1,
      reason: "missingPath",
    })
  })

  test("allows op and path properties inside operation values", () => {
    const value = {
      op: 'text with } ] , and "',
      path: [{ op: 1 }, { path: 2 }],
    }
    expect(preview({}, [{ op: "add", path: "/test", value }])).toEqual({
      test: value,
    })
  })

  test("reports only the first failure and omits partial results", () => {
    expect(
      apply({ status: "draft" }, [
        { op: "replace", path: "/status", value: "published" },
        { op: "test", path: "/status", value: "draft" },
        { op: "bad", path: "" },
      ])
    ).toEqual({
      kind: "operationError",
      number: 2,
      op: "test",
      path: "/status",
      from: undefined,
      reason: "testFailed",
    })
  })

  test.each([
    ["{", "[]", "invalidOriginal"],
    ["{}", "[", "invalidPatch"],
    ["{}", "null", "patchNotArray"],
    ["[".repeat(20_000) + "0" + "]".repeat(20_000), "[]", "documentTooComplex"],
  ])("validates the input documents (%#)", (original, patch, reason) => {
    expect(applyJsonPatch(original, patch)).toEqual({ kind: "error", reason })
  })

  test.each([
    [[], null, "invalidOperation"],
    [[], { path: "" }, "invalidOperation"],
    [[], { op: "jump", path: "/0" }, "invalidOperation"],
    [{}, { op: "add", value: 1 }, "invalidPath"],
    [{}, { op: "add", path: "#/", value: 1 }, "invalidPath"],
    [{}, { op: "add", path: "/bad~2", value: 1 }, "invalidPath"],
    [{}, { op: "test", path: "" }, "missingValue"],
    [
      {},
      { op: "replace", path: "", from: "", value: undefined },
      "missingValue",
    ],
    [{}, { op: "copy", path: "" }, "invalidFrom"],
    [{}, { op: "move", path: "", from: "/missing" }, "missingFrom"],
    [{ a: {} }, { op: "move", path: "/a/moved", from: "/a" }, "invalidMove"],
    [{ a: 1 }, { op: "add", path: "/a/deeper", value: 0 }, "missingPath"],
    [{}, { op: "add", path: "/missing/deeper", value: 0 }, "missingPath"],
    [{}, { op: "remove", path: "/missing" }, "missingPath"],
    [[], { op: "add", path: "/01", value: 2 }, "missingPath"],
    [[], { op: "add", path: "/2", value: 2 }, "missingPath"],
    [[0], { op: "replace", path: "/-", value: 2 }, "missingPath"],
    [[0], { op: "test", path: "/0", value: false }, "testFailed"],
    [[0], { op: "test", path: "", value: [] }, "testFailed"],
    [[0], { op: "test", path: "", value: [1] }, "testFailed"],
    [{ a: 1 }, { op: "test", path: "", value: {} }, "testFailed"],
    [{ a: 1 }, { op: "test", path: "", value: { b: 1 } }, "testFailed"],
  ] as const)(
    "reports an invalid operation (%#)",
    (original, operation, reason) => {
      expect(apply(original, [operation])).toMatchObject({
        kind: "operationError",
        number: 1,
        reason,
      })
    }
  )

  test("checks the copy destination and reports the source pointer", () => {
    expect(
      apply({ a: 1 }, [{ op: "copy", from: "/a", path: "/missing/a" }])
    ).toEqual({
      kind: "operationError",
      number: 1,
      op: "copy",
      path: "/missing/a",
      from: "/a",
      reason: "missingPath",
    })
  })

  test("reports a missing root after it is removed", () => {
    const remove = { op: "remove", path: "" }
    expect(apply(null, [remove, remove])).toMatchObject({
      kind: "operationError",
      number: 2,
      reason: "missingPath",
    })
    expect(
      apply(null, [remove, { op: "test", path: "", value: null }])
    ).toMatchObject({
      kind: "operationError",
      number: 2,
      reason: "missingPath",
    })
  })
})
