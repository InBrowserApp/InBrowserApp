import { expect, test, vi } from "vitest"
import { diagnostic, failure, readSource } from "./document"

test("decodes UTF-8, removes its BOM, and preserves Unicode and newlines", () => {
  const source = "\ufeff= Café α\n" + "// comment\n".repeat(5_001)
  expect(readSource(new TextEncoder().encode(source).buffer)).toBe(
    source.slice(1)
  )
  expect(() => readSource(new Uint8Array([0xff]).buffer)).toThrow("invalid")
  expect(() => readSource(new TextEncoder().encode(" \n\t").buffer)).toThrow(
    "empty"
  )
})

test("converts compiler locations to human line and column numbers", () => {
  expect(
    diagnostic({
      range: "1:9-1:10",
      message: "unclosed delimiter",
      severity: "error",
    })
  ).toEqual({
    message: "unclosed delimiter",
    severity: "error",
    line: 2,
    column: 10,
  })
  expect(
    diagnostic({ range: "", message: "warning", severity: "warning" }).line
  ).toBeNull()
})

test("preserves decoder allocation failures for resource diagnostics", () => {
  const reason = new RangeError("Invalid string length")
  const decoder = vi
    .spyOn(TextDecoder.prototype, "decode")
    .mockImplementationOnce(() => {
      throw reason
    })
  try {
    expect(() => readSource(new ArrayBuffer(1))).toThrow(reason)
  } finally {
    decoder.mockRestore()
  }
})

test("distinguishes input and genuine memory failures from ordinary errors", () => {
  expect(failure(new Error("invalid"))).toBe("invalid")
  expect(failure(new Error("empty"))).toBe("empty")
  expect(failure(new RangeError("Array buffer allocation failed"))).toBe(
    "resource"
  )
  expect(failure(new Error("Invalid string length"))).toBe("resource")
  expect(failure(new Error("unreachable"))).toBe("failed")
  expect(failure("other failure")).toBe("failed")
})
