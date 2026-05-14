import { afterEach, describe, expect, test, vi } from "vitest"

import {
  base64ToBytes,
  base64UrlEncodeText,
  bytesToBase64Url,
  concatBytes,
  textToBytes,
  toArrayBuffer,
} from "./encoding"
import { JwtSignerError } from "./errors"

describe("JWT encoding helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test("encodes text and bytes as base64url", () => {
    expect(base64UrlEncodeText("hello?")).toBe("aGVsbG8_")
    expect(bytesToBase64Url(new Uint8Array([251, 255]))).toBe("-_8")
  })

  test("decodes base64 with browser APIs", () => {
    expect([...base64ToBytes("AQID")]).toEqual([1, 2, 3])
  })

  test("uses Buffer fallbacks when browser base64 helpers are unavailable", () => {
    vi.stubGlobal("btoa", undefined)
    vi.stubGlobal("atob", undefined)

    expect(bytesToBase64Url(new Uint8Array([1, 2, 3]))).toBe("AQID")
    expect([...base64ToBytes("AQID")]).toEqual([1, 2, 3])
  })

  test("throws when no base64 implementation is available", () => {
    vi.stubGlobal("btoa", undefined)
    vi.stubGlobal("atob", undefined)
    vi.stubGlobal("Buffer", undefined)

    expect(() => bytesToBase64Url(new Uint8Array([1]))).toThrow(JwtSignerError)
  })

  test("concatenates bytes and returns exact array buffers", () => {
    const bytes = concatBytes(new Uint8Array([1]), new Uint8Array([2, 3]))
    const view = new Uint8Array([9, 1, 2, 3, 9]).subarray(1, 4)

    expect([...bytes]).toEqual([1, 2, 3])
    expect([...textToBytes("ok")]).toEqual([111, 107])
    expect([...new Uint8Array(toArrayBuffer(view))]).toEqual([1, 2, 3])
  })
})
