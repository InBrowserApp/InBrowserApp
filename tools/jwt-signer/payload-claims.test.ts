import { afterEach, describe, expect, test, vi } from "vitest"

import {
  deleteNumericDateClaim,
  formatDateTimeLocalInput,
  getCurrentUnixSeconds,
  getNumericDateClaim,
  parseDateTimeLocalInput,
  sameNumericDateValue,
  setNumericDateClaim,
} from "./payload-claims"

describe("payload claim helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("reads NumericDate claims from a payload object", () => {
    expect(getNumericDateClaim('{"iat": 1713139200.9}', "iat")).toEqual({
      status: "valid",
      value: 1713139200,
    })
    expect(getNumericDateClaim('{"sub": "user_123"}', "exp")).toEqual({
      status: "missing",
    })
    expect(getNumericDateClaim('{"exp": "soon"}', "exp")).toEqual({
      status: "invalid",
    })
    expect(getNumericDateClaim("[]", "iat")).toEqual({ status: "invalid" })
  })

  test("sets and deletes NumericDate claims while preserving valid payloads", () => {
    expect(setNumericDateClaim('{"sub":"user_123"}', "exp", 1893456000.8)).toBe(
      '{\n  "sub": "user_123",\n  "exp": 1893456000\n}\n'
    )
    expect(deleteNumericDateClaim('{"sub":"user_123","exp":1}', "exp")).toBe(
      '{\n  "sub": "user_123"\n}\n'
    )
  })

  test("refuses to modify invalid payloads", () => {
    expect(setNumericDateClaim("not json", "iat", 1)).toBeNull()
    expect(deleteNumericDateClaim("null", "exp")).toBeNull()
  })

  test("converts between local datetime input values and Unix seconds", () => {
    const inputValue = "2030-01-01T00:00:30"
    const seconds = parseDateTimeLocalInput(inputValue)

    expect(seconds).toBe(Math.floor(new Date(inputValue).getTime() / 1000))
    expect(seconds === null ? "" : formatDateTimeLocalInput(seconds)).toBe(
      inputValue
    )
    expect(parseDateTimeLocalInput("")).toBeNull()
    expect(parseDateTimeLocalInput("not-a-date")).toBeNull()
    expect(formatDateTimeLocalInput(Number.NaN)).toBe("")
  })

  test("gets current Unix seconds", () => {
    vi.spyOn(Date, "now").mockReturnValue(1893456000123)

    expect(getCurrentUnixSeconds()).toBe(1893456000)
  })

  test("compares NumericDate claim values", () => {
    expect(
      sameNumericDateValue(
        { status: "valid", value: 1 },
        { status: "valid", value: 1 }
      )
    ).toBe(true)
    expect(
      sameNumericDateValue(
        { status: "valid", value: 1 },
        { status: "valid", value: 2 }
      )
    ).toBe(false)
    expect(
      sameNumericDateValue({ status: "missing" }, { status: "missing" })
    ).toBe(true)
    expect(
      sameNumericDateValue({ status: "missing" }, { status: "invalid" })
    ).toBe(false)
  })
})
