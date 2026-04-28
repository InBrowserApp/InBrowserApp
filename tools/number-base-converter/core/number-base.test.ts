import { describe, expect, test } from "vitest"

import {
  BASE64_ALPHABET,
  STANDARD_ALPHABET,
  clampCustomBase,
  createEmptyValues,
  formatAllBaseValues,
  parseFieldInput,
} from "./number-base"

describe("number base core", () => {
  test("clamps the custom base to the supported range", () => {
    expect(clampCustomBase(Number.NaN)).toBe(58)
    expect(clampCustomBase(1)).toBe(2)
    expect(clampCustomBase(64.9)).toBe(64)
  })

  test("returns empty values for a fresh state", () => {
    expect(createEmptyValues()).toEqual({
      binary: "",
      octal: "",
      decimal: "",
      hexadecimal: "",
      base32: "",
      base36: "",
      base62: "",
      base64: "",
      custom: "",
    })
  })

  test("formats a decimal number across every supported base", () => {
    expect(formatAllBaseValues(255n, 58)).toEqual({
      binary: "11111111",
      octal: "377",
      decimal: "255",
      hexadecimal: "ff",
      base32: "7v",
      base36: "73",
      base62: "47",
      base64: "D/",
      custom: "4n",
    })
  })

  test("formats zero consistently across every base", () => {
    expect(formatAllBaseValues(0n, 64)).toEqual({
      binary: "0",
      octal: "0",
      decimal: "0",
      hexadecimal: "0",
      base32: "0",
      base36: "0",
      base62: "0",
      base64: "0",
      custom: "0",
    })
  })

  test("parses common bases case-insensitively up to base 36", () => {
    expect(parseFieldInput("hexadecimal", "FF", 58)).toEqual({
      kind: "valid",
      value: 255n,
    })
    expect(parseFieldInput("base36", "Z", 58)).toEqual({
      kind: "valid",
      value: 35n,
    })
  })

  test("treats base62 as case-sensitive", () => {
    expect(parseFieldInput("base62", "a", 58)).toEqual({
      kind: "valid",
      value: BigInt(STANDARD_ALPHABET.indexOf("a")),
    })
    expect(parseFieldInput("base62", "A", 58)).toEqual({
      kind: "valid",
      value: BigInt(STANDARD_ALPHABET.indexOf("A")),
    })
  })

  test("parses the numeric base64 alphabet separately", () => {
    expect(parseFieldInput("base64", "D/", 58)).toEqual({
      kind: "valid",
      value: 255n,
    })
    expect(parseFieldInput("base64", "a", 58)).toEqual({
      kind: "valid",
      value: BigInt(BASE64_ALPHABET.indexOf("a")),
    })
  })

  test("parses custom bases with the expected case rules", () => {
    expect(parseFieldInput("custom", "Z", 36)).toEqual({
      kind: "valid",
      value: 35n,
    })
    expect(parseFieldInput("custom", "A", 62)).toEqual({
      kind: "valid",
      value: BigInt(STANDARD_ALPHABET.indexOf("A")),
    })
    expect(parseFieldInput("custom", "A", 16)).toEqual({
      kind: "valid",
      value: 10n,
    })
  })

  test("reports empty and invalid inputs explicitly", () => {
    expect(parseFieldInput("decimal", "   ", 58)).toEqual({ kind: "empty" })
    expect(parseFieldInput("binary", "102", 58)).toEqual({ kind: "invalid" })
    expect(parseFieldInput("base64", "_", 58)).toEqual({ kind: "invalid" })
  })
})
