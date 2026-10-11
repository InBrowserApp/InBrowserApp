import { expect, test } from "vitest"
import { ConversionError, failure } from "./errors"
test("preserves known failures and distinguishes browser allocation failures", () => {
  const error = new ConversionError("protected")
  expect(failure(error)).toBe(error)
  expect(failure(new RangeError("memory allocation failed")).code).toBe(
    "resource"
  )
  expect(failure("bad format").code).toBe("invalid")
  expect(failure(new Error("read failed")).code).toBe("invalid")
})
